import { useStoreDetail } from '@/hooks/useStoreDetail';
import { useUpdateLocation } from '@/hooks/useUpdateLocation';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function EditStoreScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { locationId } = useLocalSearchParams<{ locationId: string }>();
    const id = Array.isArray(locationId) ? locationId[0] : locationId;

    // Hooks de datos
    const { data: location, isLoading } = useStoreDetail(id);
    const updateLocationMutation = useUpdateLocation();

    // Estados del formulario
    const [image, setImage] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        currency: 'CLP',
        pricePerDay: { small: 5000, medium: 8000, large: 12000 },
        capacity: { small: 0, medium: 0, large: 0 }
    });

    // Cargar datos iniciales
    useEffect(() => {
        if (location) {
            setForm({
                name: location.name || '',
                currency: location.currency || 'CLP',
                pricePerDay: location.pricePerDay || { small: 0, medium: 0, large: 0 },
                // Mapeo defensivo para 'capacity' vs 'maxCapacity'
                capacity: location.capacity || { small: 0, medium: 0, large: 0 }
            });
            setImage(location.imageUrl || null);
        }
    }, [location]);

    // Función para seleccionar imagen
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            // Nota: Aquí podrías disparar una subida a S3/Cloudinary si fuera necesario
        }
    };

    const handleSave = async () => {
        try {
            await updateLocationMutation.mutateAsync({
                id: id,
                ...form,
                imageUrl: image, // Incluimos la imagen (local uri o url remota)
                currency: form.currency.toUpperCase()
            });
            Toast.show({ type: 'success', text1: t('createLocation.success_label'), text2: t('createLocation.toast_update_success') });
            router.push('/(owner)/stores');
        } catch (error) {
            Toast.show({ type: 'error', text1: t('common.error'), text2: t('createLocation.toast_update_error') });
        }
    };

    if (!id) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.textMuted, fontSize: 16 }}>{t('createLocation.store_id_not_found')}</Text>
                    <TouchableOpacity onPress={() => router.push('/(owner)/stores')} style={{ marginTop: 16, padding: 12 }}> 
                        <Text style={{ color: '#1A1F71', fontWeight: '600' }}>{t('booking.go_back')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A1F71" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Header Image Editable */}
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
                        <ImageBackground
                            source={{ uri: image || 'https://via.placeholder.com/800x400' }}
                            style={styles.headerImage}
                            imageStyle={{ borderRadius: 24 }}
                        >
                            <View style={styles.headerTopRow}>
                                <TouchableOpacity onPress={() => router.push('/(owner)/stores')} style={styles.backCircle}>
                                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                                </TouchableOpacity>

                                <View style={styles.editPhotoBadge}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                    <Text style={styles.editPhotoText}>{t('createLocation.change_photo')}</Text>
                                </View>
                            </View>

                            <View style={styles.overlay}>
                                <Text style={styles.headerLabel}>{t('createLocation.store_identifier')}</Text>
                                <Text style={styles.headerTitle}>{form.name || t('createLocation.store_name_fallback')}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    <View style={styles.formContent}>
                        {/* Basic Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('createLocation.basic_info')}</Text>

                            <Text style={styles.label}>{t('createLocation.location_name')}</Text>
                            <TextInput
                                style={styles.input}
                                value={form.name}
                                onChangeText={(val) => setForm({ ...form, name: val })}
                                placeholder={t('createLocation.edit_name_placeholder')}
                            />

                            <Text style={[styles.label, { marginTop: 20 }]}>{t('createLocation.currency')}</Text>
                            <View style={styles.currencySelector}>
                                {['CLP', 'USD', 'EUR'].map((curr) => (
                                    <TouchableOpacity
                                        key={curr}
                                        style={[
                                            styles.currencyOption,
                                            form.currency === curr && styles.currencyOptionActive
                                        ]}
                                        onPress={() => setForm({ ...form, currency: curr })}
                                    >
                                        <Text style={[
                                            styles.currencyText,
                                            form.currency === curr && styles.currencyTextActive
                                        ]}>{curr}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Pricing & Capacity */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('createLocation.pricing_capacity')}</Text>
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <View key={size} style={styles.priceCard}>
                                    <View style={styles.priceHeader}>
                                        <View style={styles.iconCircle}>
                                            <MaterialCommunityIcons
                                                name={size === 'small' ? 'bag-personal' : size === 'medium' ? 'suitcase' : 'trunk'}
                                                size={18} color="#1A1F71"
                                            />
                                        </View>
                                        <Text style={styles.sizeTag}>{size.toUpperCase()}</Text>
                                    </View>

                                    <View style={styles.priceRow}>
                                        <View style={{ flex: 1, marginRight: 15 }}>
                                            <Text style={styles.miniLabel}>{t('createLocation.daily_price', { currency: form.currency })}</Text>
                                            <TextInput
                                                style={styles.cardInput}
                                                keyboardType="numeric"
                                                value={(form.pricePerDay?.[size] ?? 0).toString()}
                                                onChangeText={(val) => {
                                                    const cleanVal = val.replace(/[^0-9.]/g, '');
                                                    setForm({
                                                        ...form,
                                                        pricePerDay: { ...form.pricePerDay, [size]: parseFloat(cleanVal) || 0 }
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.miniLabel}>{t('createLocation.max_units')}</Text>
                                            <TextInput
                                                style={styles.cardInput}
                                                keyboardType="numeric"
                                                value={(form.capacity?.[size] ?? 0).toString()}
                                                onChangeText={(val) => {
                                                    const cleanVal = val.replace(/[^0-9]/g, '');
                                                    setForm({
                                                        ...form,
                                                        capacity: { ...form.capacity, [size]: parseInt(cleanVal) || 0 }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={updateLocationMutation.isPending}
                        >
                            {updateLocationMutation.isPending ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.saveButtonText}>{t('createLocation.save_changes')}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerImage: { height: 200, margin: 20, justifyContent: 'space-between' },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    backCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', margin: 15 },
    editPhotoBadge: { backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 15, marginRight: 15, alignItems: 'center' },
    editPhotoText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 6 },
    overlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerLabel: { color: '#CBD5E1', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    formContent: { paddingHorizontal: 24 },
    section: { marginBottom: 32 },
    sectionTitle: { color: '#0A0E5E', fontSize: 18, fontWeight: '800', borderLeftWidth: 4, borderLeftColor: '#E63946', paddingLeft: 12, marginBottom: 20 },
    label: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
    input: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },

    // Estilos del Selector de Moneda
    currencySelector: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 4 },
    currencyOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    currencyOptionActive: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    currencyText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
    currencyTextActive: { color: '#1A1F71' },

    priceCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
    priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
    sizeTag: { color: '#64748B', fontSize: 10, fontWeight: '800' },
    priceRow: { flexDirection: 'row' },
    miniLabel: { fontSize: 10, color: '#94A3B8', marginBottom: 6, fontWeight: '600' },
    cardInput: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', fontSize: 18, fontWeight: '700', color: '#1E293B', paddingVertical: 6 },
    saveButton: { backgroundColor: '#1A1F71', flexDirection: 'row', padding: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 40, elevation: 4 },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});