import { StorageCard } from '@/components/owner/create-location/StorageCard'
import { ROUTES } from '@/constants/routes'
import { locationService } from '@/services/locationServices'
import { useLocationStore } from '@/store/useLocationStore'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { uploadService } from '@/services/uploadService'
import Toast from 'react-native-toast-message'

export default function CreateLocationScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { address, lat, lng, reset: clearLocation } = useLocationStore()

  const [loading, setLoading] = useState(false);
  const [showFeeInfo, setShowFeeInfo] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    smallPrice: '5000',
    mediumPrice: '8000',
    largePrice: '12000',
    smallCapacity: '1',
    mediumCapacity: '1',
    largeCapacity: '1',
    lat: '',
    lng: '',
    imageUrl: null as string | null,
    workingHours: [
      {       day: 1, label: 'Mon', open: '09:00', close: '18:00', isClosed: false },
      { day: 2, label: 'Tue', open: '09:00', close: '18:00', isClosed: false },
      { day: 3, label: 'Wed', open: '09:00', close: '18:00', isClosed: false },
      { day: 4, label: 'Thu', open: '09:00', close: '18:00', isClosed: false },
      { day: 5, label: 'Fri', open: '09:00', close: '18:00', isClosed: false },
      { day: 6, label: 'Sat', open: '10:00', close: '14:00', isClosed: true },
      { day: 0, label: 'Sun', open: '00:00', close: '00:00', isClosed: true },
    ]
  })

  useEffect(() => {
    clearLocation();
  }, []);

  useEffect(() => {
    if (address) {
      setForm((prev) => ({
        ...prev,
        address: address as string,
        lat: lat as string,
        lng: lng as string,
      }))
    }
  }, [address, lat, lng])

  const handleBack = () => {
    router.back()
  }

    const handleSubmit = async () => {
      if (loading) return;
      
      const MIN_PRICE = 990;
      const prices = [
        { key: 'small', val: parseInt(form.smallPrice) },
        { key: 'medium', val: parseInt(form.mediumPrice) },
        { key: 'large', val: parseInt(form.largePrice) },
      ];
      const lowPrice = prices.find(p => p.val < MIN_PRICE);
      if (lowPrice) {
        Toast.show({ type: 'error', text1: t('createLocation.toast_invalid_price'), text2: t('createLocation.toast_invalid_price_desc', { key: lowPrice.key, min: MIN_PRICE }) });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await locationService.create(form);
        
        console.log('Success:', response);
        Toast.show({
          type: 'success',
          text1: t('createLocation.toast_store_submitted'),
          text2: t('createLocation.toast_store_submitted_desc')
        });
        router.replace(ROUTES.OWNER.STORES);
        
      } catch (error: any) {
        console.error('Error creating location:', error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: error.response?.data?.message || t('createLocation.toast_something_wrong')
        });
      } finally {
        setLoading(false);
      }
    };

    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: t('createLocation.toast_permission_denied'), text2: t('createLocation.toast_gallery_needed') });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          setLoading(true);
          const uploadedUrl = await uploadService.uploadImage(result.assets[0].uri, 'locations');
          setForm({ ...form, imageUrl: uploadedUrl });
          Toast.show({ type: 'success', text1: t('createLocation.toast_image_uploaded') });
        } catch (error) {
          Toast.show({ type: 'error', text1: t('createLocation.toast_upload_failed') });
        } finally {
          setLoading(false);
        }
      }
    };

  const s = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Image source={require('@/assets/images/login-logo.png')} style={{ width: 100, height: 48, resizeMode: 'contain' }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={s.mainTitle}>{t('createLocation.title')}</Text>
          <Text style={s.description}>{t('createLocation.desc')}</Text>

          <View style={s.sectionHeader}>
            <Ionicons name="camera" size={20} color="#B45309" />
            <Text style={s.sectionTitle}>{t('createLocation.store_photo')}</Text>
          </View>

          <TouchableOpacity 
            style={[s.imageUploadCard, form.imageUrl ? s.imageActive : null]} 
            onPress={pickImage}
            disabled={loading}
          >
            {form.imageUrl ? (
              <View style={s.imagePreviewContainer}>
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    source={{ uri: form.imageUrl }} 
                    style={s.previewImage} 
                  />
                  <View style={s.imageOverlay}>
                    <Ionicons name="create" size={24} color="#FFF" />
                    <Text style={s.overlayText}>{t('createLocation.change_photo')}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={s.uploadPlaceholder}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.textMuted} />
                <Text style={s.uploadTitle}>{t('createLocation.upload_photo')}</Text>
                <Text style={s.uploadSubtitle}>{t('createLocation.upload_subtitle')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={s.sectionHeader}>
            <Ionicons name="location" size={20} color="#B45309" />
            <Text style={s.sectionTitle}>{t('createLocation.location_details')}</Text>
          </View>

          <Text style={s.inputLabel}>{t('createLocation.location_name')}</Text>
          <TextInput
            style={s.textField}
            placeholder={t('createLocation.location_placeholder')}
            placeholderTextColor={colors.iconMuted}
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
          />

          <Text style={s.inputLabel}>{t('createLocation.full_address')}</Text>
          <TextInput
            style={s.textField}
            placeholder={t('createLocation.address_placeholder')}
            placeholderTextColor={colors.iconMuted}
            value={form.address}
            editable={false}
          />

          <TouchableOpacity
            style={[s.mapPlaceholder, form.lat ? s.mapPinned : null]}
            onPress={() => router.push(ROUTES.OWNER.MAP_SELECTOR)}
          >
            <View style={s.mapButton}>
              <Ionicons name={form.lat ? 'checkmark-circle' : 'navigate'} size={18} color={colors.iconColor} />
              <Text style={s.mapButtonText}>
                {form.lat ? t('createLocation.location_pinned') : t('createLocation.pin_location')}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={s.sectionHeader}>
            <Ionicons name="cash" size={20} color="#B45309" />
            <Text style={s.sectionTitle}>{t('createLocation.luggage_pricing')}</Text>
            <TouchableOpacity onPress={() => setShowFeeInfo(!showFeeInfo)}>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24 }}>
                <Ionicons name={showFeeInfo ? 'close-circle-outline' : 'information-circle-outline'} size={22} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </View>
          {showFeeInfo && (
            <View style={{ backgroundColor: colors.surfaceLight, borderRadius: 16, padding: 16, marginBottom: 16, gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary }}>{t('createLocation.fee_explain_title')}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
                {t('createLocation.fee_explain_owner')}
              </Text>
            </View>
          )}

          <View style={s.priceContainer}>
            <StorageCard
              icon="bag-personal"
              label={t('createLocation.small')}
              subLabel={t('createLocation.small_sub')}
              priceValue={form.smallPrice}
              capacityValue={form.smallCapacity}
              onPriceChange={(v) => setForm({ ...form, smallPrice: v })}
              onCapacityChange={(v) => setForm({ ...form, smallCapacity: v })}
              minPrice={3500}
            />
            <StorageCard
              icon="bag-suitcase"
              label={t('createLocation.medium')}
              subLabel={t('createLocation.medium_sub')}
              priceValue={form.mediumPrice}
              capacityValue={form.mediumCapacity}
              onPriceChange={(v) => setForm({ ...form, mediumPrice: v })}
              onCapacityChange={(v) => setForm({ ...form, mediumCapacity: v })}
              minPrice={5000}
            />
            <StorageCard
              icon="suitcase"
              label={t('createLocation.large')}
              subLabel={t('createLocation.large_sub')}
              priceValue={form.largePrice}
              capacityValue={form.largeCapacity}
              onPriceChange={(v) => setForm({ ...form, largePrice: v })}
              onCapacityChange={(v) => setForm({ ...form, largeCapacity: v })}
              minPrice={7000}
            />
          </View>

          <View style={{ marginTop: -10, marginBottom: 20, paddingHorizontal: 4, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted, flex: 1 }}>{t('createLocation.prices_info')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Ionicons name="trending-down-outline" size={16} color="#22C55E" />
              <Text style={{ fontSize: 11, color: '#22C55E', flex: 1 }}>{t('createLocation.owner_fee_info')}</Text>
            </View>
          </View>

          <View style={s.sectionHeader}>
            <Ionicons name="time" size={20} color="#B45309" />
            <Text style={s.sectionTitle}>{t('createLocation.business_hours')}</Text>
          </View>

          <View style={s.hoursContainer}>
            {form.workingHours.map((item, index) => (
              <View key={item.day} style={s.hourRow}>
                <View style={s.dayInfo}>
                  <Text style={s.dayLabel}>{item.label}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      const newHours = [...form.workingHours];
                      newHours[index].isClosed = !newHours[index].isClosed;
                      setForm({ ...form, workingHours: newHours });
                    }}
                    style={[s.statusBadge, item.isClosed ? s.closedBadge : s.openBadge]}
                  >
                    <Text style={[s.statusText, item.isClosed && { color: colors.error }]}>{item.isClosed ? t('createLocation.closed') : t('createLocation.open')}</Text>
                  </TouchableOpacity>
                </View>

                {!item.isClosed && (
                  <View style={s.timeInputs}>
                    <TextInput
                      style={s.timeInput}
                      value={item.open}
                      onChangeText={(val) => {
                        const newHours = [...form.workingHours];
                        newHours[index].open = val;
                        setForm({ ...form, workingHours: newHours });
                      }}
                      placeholder="09:00"
                      placeholderTextColor={colors.iconMuted}
                      maxLength={5}
                    />
                    <Text style={s.timeDivider}>{t('createLocation.to')}</Text>
                    <TextInput
                      style={s.timeInput}
                      value={item.close}
                      onChangeText={(val) => {
                        const newHours = [...form.workingHours];
                        newHours[index].close = val;
                        setForm({ ...form, workingHours: newHours });
                      }}
                      placeholder="18:00"
                      placeholderTextColor={colors.iconMuted}
                      maxLength={5}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={s.submitBtn} onPress={() => handleSubmit()} disabled={loading}>
            <Text style={s.submitBtnText}>{t('createLocation.submit')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surfaceCardLow },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, letterSpacing: 1 },
  scroll: { padding: 20 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 },
  description: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, lineHeight: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.textLabel, marginBottom: 8 },
  textField: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 15,
    color: colors.textPrimary,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: colors.iconMuted,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mapPinned: { backgroundColor: colors.border, borderWidth: 2, borderColor: colors.iconColor },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
  },
  mapButtonText: { fontWeight: 'bold', color: colors.iconColor },
  priceContainer: { gap: 12 },
  imageUploadCard: {
    height: 180,
    backgroundColor: colors.surfaceCard,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 25,
    overflow: 'hidden',
  },
  imageActive: {
    borderStyle: 'solid',
    borderColor: colors.iconColor,
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: colors.iconMuted,
  },
  imagePreviewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 94, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  overlayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  hoursContainer: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    width: 40,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadge: {
    backgroundColor: colors.successLight,
  },
  closedBadge: {
    backgroundColor: colors.errorLight,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textPrimary,
  },
  timeDivider: {
    fontSize: 12,
    color: colors.iconMuted,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
