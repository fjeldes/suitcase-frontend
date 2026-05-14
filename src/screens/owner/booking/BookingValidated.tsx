import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

import { ROUTES } from '@/constants/routes'
import { useProcessBooking } from '@/hooks/useProcessBooking'
import { useBookingStore } from '@/store/useBookingStore'
import { bookingService } from '@/services/bookingService'
import { uploadService } from '@/services/uploadService'
import * as ImagePicker from 'expo-image-picker'

export default function BookingValidated() {
  const router = useRouter()
  const { currentBooking, clearCurrentBooking } = useBookingStore()
  const { mutate: processBooking, isPending } = useProcessBooking()
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  if (!currentBooking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A0E5E" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading booking data...</Text>
      </View>
    )
  }

  const isCheckIn = currentBooking.status === 'confirmed'
  const bookingIdDisplay = currentBooking.id?.slice(0, 8).toUpperCase()

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take luggage photos.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })

    if (!result.canceled && result.assets[0]) {
      setUploadingPhoto(true)
      try {
        const url = await uploadService.uploadImage(result.assets[0].uri, 'check-in-photos')
        setPhotos((prev) => [...prev, url])
      } catch {
        Alert.alert('Upload failed', 'Could not save the photo.')
      } finally {
        setUploadingPhoto(false)
      }
    }
  }

  const handleConfirm = async () => {
    if (isCheckIn && photos.length > 0) {
      try {
        await bookingService.saveCheckInPhotos(currentBooking.id, photos)
      } catch {
        // non-blocking: photos are optional
      }
    }

    processBooking(currentBooking.qrCode, {
      onSuccess: () => {
        router.replace(ROUTES.OWNER.CHECKIN_SUCCESS)
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.message || 'Action could not be completed.'
        Alert.alert('Transaction Failed', errorMsg)
      },
    })
  }

  const handleCancel = () => {
    clearCurrentBooking()
    router.back()
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={42} color="white" />
            </View>
          </View>
        </View>

        <Text style={styles.mainTitle}>Booking Validated</Text>
        <Text style={styles.subTitle}>
          QR code verified. Please confirm the details below before proceeding.
        </Text>

        <View style={styles.badgeContainer}>
          <View style={[styles.readyBadge, !isCheckIn && styles.readyBadgeOut]}>
            <Ionicons
              name={isCheckIn ? 'lock-closed' : 'log-out'}
              size={14}
              color={isCheckIn ? '#9A3412' : '#065F46'}
            />
            <Text style={[styles.readyBadgeText, !isCheckIn && styles.readyBadgeTextOut]}>
              {isCheckIn ? ' Ready for Check-in' : ' Ready for Check-out'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View>
            <Text style={styles.label}>CUSTOMER</Text>
            <Text style={styles.customerName}>
              {currentBooking.user?.profile
                ? `${currentBooking.user.profile.firstName} ${currentBooking.user.profile.lastName}`
                : 'Guest User'}
            </Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#0A0E5E" />
          </View>
        </View>

        <View style={[styles.card, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <View style={styles.bookingIdRow}>
            <View>
              <Text style={styles.label}>BOOKING ID</Text>
              <Text style={styles.bookingIdText}>#{bookingIdDisplay}</Text>
            </View>
            <MaterialCommunityIcons name="qrcode" size={26} color="black" />
          </View>

          {currentBooking.declaredValue > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.declaredValueRow}>
                <Ionicons name="shield-checkmark" size={18} color="#B45309" />
                <Text style={styles.declaredValueText}>
                  Declared value: ${Number(currentBooking.declaredValue).toLocaleString()}
                </Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <Text style={[styles.label, { marginBottom: 12 }]}>STORAGE ITEMS</Text>

          {Object.entries(currentBooking.items || {}).map(([key, value]) => {
            if (!value || value === 0) return null
            return (
              <View key={key} style={styles.itemBox}>
                <View style={styles.itemIconContainer}>
                  <MaterialCommunityIcons
                    name={key === 'large' ? 'bag-checked' : 'bag-personal'}
                    size={24}
                    color="#0A0E5E"
                  />
                </View>
                <View>
                  <Text style={styles.itemTitle}>
                    {value} {key.charAt(0).toUpperCase() + key.slice(1)} Item{value > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.itemSubtitle}>Scan verified</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* PHOTOS SECTION - only during check-in */}
        {isCheckIn && (
          <View style={styles.photosSection}>
            <Text style={styles.photosLabel}>LUGGAGE PHOTOS (optional)</Text>
            <Text style={styles.photosDesc}>
              Take photos of the items for their protection and yours.
            </Text>

            {photos.length > 0 && (
              <View style={styles.photoGrid}>
                {photos.map((uri, index) => (
                  <View key={index} style={styles.photoThumb}>
                    <Image source={{ uri }} style={styles.photoImage} />
                    <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(index)}>
                      <Ionicons name="close-circle" size={22} color="#E53E3E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={takePhoto}
              disabled={uploadingPhoto || photos.length >= 4}
            >
              {uploadingPhoto ? (
                <ActivityIndicator color="#0A0E5E" size="small" />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={20} color="#0A0E5E" />
                  <Text style={styles.addPhotoText}>
                    {photos.length >= 4 ? 'Max 4 photos' : 'Take Photo'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmButton, isPending && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.confirmButtonText}>
                {isCheckIn ? 'Confirm Check-in' : 'Confirm Check-out'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel and Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  backButton: { padding: 5 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  successContainer: { alignItems: 'center', marginTop: 20, marginBottom: 25 },
  outerCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#DCF7E8',
    justifyContent: 'center', alignItems: 'center',
  },
  innerCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#22C55E',
    justifyContent: 'center', alignItems: 'center',
  },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subTitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
  badgeContainer: { alignItems: 'center', marginVertical: 25 },
  readyBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEDD5',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  readyBadgeOut: { backgroundColor: '#D1FAE5' },
  readyBadgeText: { color: '#9A3412', fontWeight: '700', fontSize: 13 },
  readyBadgeTextOut: { color: '#065F46' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
    shadowRadius: 15, elevation: 2, width: '100%',
  },
  label: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 4 },
  customerName: { fontSize: 20, fontWeight: '700', color: '#0A0E5E' },
  avatarPlaceholder: {
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
  },
  bookingIdRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%',
  },
  bookingIdText: { fontSize: 22, fontWeight: '800', color: '#0A0E5E' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20, width: '100%' },
  declaredValueRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -10, marginBottom: 5,
  },
  declaredValueText: {
    fontSize: 14, fontWeight: '700', color: '#92400E',
  },
  itemBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    borderRadius: 18, padding: 15, marginBottom: 12, width: '100%',
  },
  itemIconContainer: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  itemSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  photosSection: { marginBottom: 16 },
  photosLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 4 },
  photosDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 18 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  photoThumb: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoRemove: { position: 'absolute', top: -6, right: -6 },
  addPhotoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14,
    padding: 16, gap: 8, borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed',
  },
  addPhotoText: { fontSize: 14, fontWeight: '600', color: '#0A0E5E' },
  footer: { marginTop: 30, gap: 15 },
  confirmButton: {
    backgroundColor: '#0A0E5E', borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#0A0E5E', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2,
    shadowRadius: 10, elevation: 5,
  },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButton: { paddingVertical: 10, alignItems: 'center' },
  cancelText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
})
