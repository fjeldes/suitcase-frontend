import { useCreateBooking } from '@/hooks/useCreateBooking'
import { useStoreDetail } from '@/hooks/useStoreDetail'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { usePayment } from '@/hooks/usePayment'
import { useReviews } from '@/hooks/useReviews'
import { paymentService } from '@/services/paymentServices'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { DateInput } from '../ui/DateInput'

interface Props {
  storeId: string | string[]
}

export default function BookingDetail({ storeId }: Props) {
  const router = useRouter()
  const { t } = useTranslation()
 
  // Hooks de datos, mutación y pago
  const { data: store, isLoading, error } = useStoreDetail(storeId)
  const { mutate: createBooking, isPending } = useCreateBooking()
  const { reviews, averageRating, isLoadingReviews } = useReviews(Array.isArray(storeId) ? storeId[0] : storeId)
  const { setupPaymentSheet } = usePayment();

  const { data: savedCards, isLoading: loadingCards, error: cardsError, refetch: refetchCards } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentService.getSavedCards(),
  });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (savedCards && savedCards.length > 0 && !selectedCardId) {
      const defaultCard = savedCards.find((c: any) => c.isDefault) || savedCards[0];
      setSelectedCardId(defaultCard.id);
    }
  }, [savedCards]);

  // Estados de maletas
  const [bags, setBags] = useState({ small: 0, medium: 0, large: 0 })

  useEffect(() => {
    if (store) setBags({ small: 0, medium: 0, large: 0 })
  }, [store])

  // Fechas
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  const [showHours, setShowHours] = useState(false);
  const [showValueDeclare, setShowValueDeclare] = useState(false);
  const [declaredValue, setDeclaredValue] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoInfo, setPromoInfo] = useState<{ discountType: string; discountValue: number } | null>(null);

  // Determinar si la tienda está abierta ahora
  const isStoreOpen = useMemo(() => {
    if (!store?.workingHours) return true;
    const now = new Date();
    const dayConfig = store.workingHours.find((h: any) => h.day === now.getDay());
    if (!dayConfig || dayConfig.isClosed) return false;

    const timeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const currentMins = now.getHours() * 60 + now.getMinutes();
    return currentMins >= timeToMinutes(dayConfig.open) && currentMins <= timeToMinutes(dayConfig.close);
  }, [store]);

  // Cálculo de días y precio total
  const days = useMemo(() => {
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [startDate, endDate])

  const totalPrice = useMemo(() => {
    if (!store || !store.pricePerDay) return 0
    return (bags.small * store.pricePerDay.small + bags.medium * store.pricePerDay.medium + bags.large * store.pricePerDay.large) * days
  }, [bags, store, days])

  const promoDiscount = useMemo(() => {
    if (!promoApplied || !promoInfo) return 0;
    if (promoInfo.discountType === 'percentage') {
      return Math.round(totalPrice * (promoInfo.discountValue / 100));
    }
    return Math.min(promoInfo.discountValue, totalPrice);
  }, [promoApplied, promoInfo, totalPrice]);

  const updateQuantity = (type: keyof typeof bags, delta: number) => {
    const newValue = bags[type] + delta
    if (newValue < 0) return
    const limit = store?.availability?.[type] ?? 0
    if (newValue > limit) {
      Toast.show({ type: 'error', text1: t('booking.no_space'), text2: t('booking.no_space_desc', { limit, type }) })
      return
    }
    setBags({ ...bags, [type]: newValue })
  }

  const toLocalISO = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const offset = -date.getTimezoneOffset()
    const sign = offset >= 0 ? '+' : '-'
    const abs = Math.abs(offset)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  }

  const handleConfirm = async () => {
    if (isPending || totalPrice === 0) return

    if (startDate >= endDate) {
      Toast.show({ type: 'error', text1: t('booking.invalid_dates'), text2: t('booking.pickup_after_dropoff') });
      return;
    }

    createBooking({
      locationId: Array.isArray(storeId) ? storeId[0] : storeId,
      startDate: toLocalISO(startDate),
      endDate: toLocalISO(endDate),
      items: bags,
      declaredValue: declaredValue > 0 ? declaredValue : undefined,
      promoCode: promoApplied ? promoCode.trim().toUpperCase() : undefined,
    })
  }

  const handleAddCard = async () => {
    const result = await setupPaymentSheet();
    if (result.success) {
      await refetchCards();
    }
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#0A0E5E" /></View>
  if (error) return <View style={styles.center}><Text style={styles.errorText}>{t('booking.error_loading')}</Text></View>


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={{ uri: store?.imageUrl || 'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=1000&auto=format&fit=crop' }} style={styles.bannerImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button"><Ionicons name="chevron-back" size={28} color="#0A0E5E" /></TouchableOpacity>
          <View style={styles.headerInfoCard}>
            <Text style={styles.storeName}>{store?.name || t('common.loading')}</Text>
            <Text style={styles.subInfo}><Ionicons name="navigate" size={14} color="#0A0E5E" /> {store?.address?.split(',')[0]} • {isStoreOpen ? t('booking.open_now') : t('booking.closed')}</Text>
          </View>
        </View>

        {/* HORARIOS */}
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowHours(!showHours)} accessibilityLabel={showHours ? 'Hide opening hours' : 'Show opening hours'} accessibilityRole="button">
            <Ionicons name="time" size={20} color="#0A0E5E" /><Text style={styles.sectionTitle}> {t('booking.opening_hours')}</Text>
            <Ionicons name={showHours ? "chevron-up" : "chevron-down"} size={20} color="#CBD5E0" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          {showHours && (
            <View style={styles.hoursList}>
              {store?.workingHours?.map((item: any) => (
                <View key={item.day} style={styles.hourRow}><Text style={styles.dayText}>{item.label}</Text><Text style={[styles.timeText, item.isClosed && styles.closedText]}>{item.isClosed ? t('booking.closed') : `${item.open} - ${item.close}`}</Text></View>
              ))}
            </View>
          )}
        </View>

        {/* CONFIGURATION */}
        <View style={styles.whiteSection}>
          <Text style={styles.configMainTitle}>{t('booking.configure_storage')}</Text>

          <View style={styles.dateTimeRow}>
            <DateInput
              label={t('booking.drop_off')}
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (date >= endDate) setEndDate(new Date(date.getTime() + 2 * 60 * 60 * 1000));
              }}
              minimumDate={new Date()}
              icon="calendar"
            />
            <DateInput
              label={t('booking.pick_up')}
              value={endDate}
              onChange={(date) => setEndDate(date)}
              minimumDate={startDate}
              icon="time"
            />
          </View>

          <Text style={styles.luggageLabel}>{t('booking.luggage_items')}</Text>

          {/* REVIEWS SECTION */}
          <View style={styles.reviewsContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={20} color="#0A0E5E" />
              <Text style={styles.sectionTitle}> {t('booking.what_travelers_say')}</Text>
            </View>

            {isLoadingReviews ? (
              <ActivityIndicator color="#0A0E5E" />
            ) : reviews.length === 0 ? (
              <View style={styles.emptyReviewsContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyReviews}>{t('booking.no_reviews_yet')}</Text>
              </View>
            ) : (
              reviews.map((rev: any) => (
                <View key={rev.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>
                      {rev.user?.profile?.firstName || 'User'} {rev.user?.profile?.lastName || ''}
                    </Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name="star"
                          size={12}
                          color={s <= rev.rating ? "#FFD700" : "#E2E8F0"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                  <Text style={styles.reviewDate}>{dayjs(rev.createdAt).format('MMM D, YYYY')}</Text>
                </View>
              ))
            )}
          </View>

          {/* ITEM SELECTORS */}
          {(['small', 'medium', 'large'] as const).map((type) => {
            const available = store?.availability?.[type] ?? 0
            const remaining = available - bags[type]

            return (
              <View key={type} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {type === 'small'
                      ? t('booking.item_small')
                      : type === 'medium'
                        ? t('booking.item_medium')
                        : t('booking.item_large')}
                  </Text>
                  <Text style={styles.itemSubLabel}>
                    {type === 'small'
                      ? t('createLocation.small_sub')
                      : type === 'medium'
                        ? t('createLocation.medium_sub')
                        : t('createLocation.large_sub')}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>${store?.pricePerDay?.[type] || 0}/day</Text>
                    <View
                      style={[styles.availabilityBadge, remaining === 0 && styles.soldOutBadge]}
                    >
                      <Text
                        style={[styles.availabilityText, remaining === 0 && styles.soldOutText]}
                      >
                        {remaining > 0 ? t('booking.remaining', { remaining }) : t('booking.sold_out')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(type, -1)}
                    style={styles.counterBtn}
                    accessibilityLabel={`Decrease ${type} luggage count`}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name="remove-outline"
                      size={20}
                      color={bags[type] > 0 ? '#0A0E5E' : '#CBD5E0'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countNumber}>{bags[type]}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(type, 1)}
                    style={styles.counterBtn}
                    disabled={remaining <= 0}
                    accessibilityLabel={`Increase ${type} luggage count`}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name="add-outline"
                      size={20}
                      color={remaining > 0 ? '#0A0E5E' : '#CBD5E0'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}

          <View style={styles.statsContainer}>
            <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {averageRating || t('common.no_rating')} ({reviews.length} {t('common.reviews')})
              </Text>
            </View>
          </View>

          {/* VALUE DECLARATION */}
          <TouchableOpacity style={styles.valueDeclareBtn} onPress={() => setShowValueDeclare(!showValueDeclare)} accessibilityLabel={showValueDeclare ? 'Hide value declaration' : 'Declare valuable items'} accessibilityRole="button">
            <Ionicons name={showValueDeclare ? 'shield-checkmark' : 'shield-outline'} size={20} color="#B45309" />
            <Text style={styles.valueDeclareBtnText}>
              {showValueDeclare ? t('booking.value_declared', { amount: declaredValue }) : t('booking.value_declare')}
            </Text>
            <Ionicons name={showValueDeclare ? 'chevron-up' : 'chevron-down'} size={18} color="#B45309" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          {showValueDeclare && (
            <View style={styles.valueDeclareCard}>
              <Text style={styles.valueDeclareDesc}>{t('booking.value_declare_desc')}</Text>
              <View style={styles.valueInputRow}>
                <Text style={styles.valueCurrency}>$</Text>
                <TextInput
                  style={styles.valueInput}
                  keyboardType="numeric"
                  value={declaredValue > 0 ? String(declaredValue) : ''}
                  onChangeText={(v) => setDeclaredValue(Number(v) || 0)}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  accessibilityLabel="Declared value input"
                />
              </View>
            </View>
          )}

          {/* PROMO CODE */}
          {totalPrice > 0 && (
            <View style={styles.promoSection}>
              <View style={styles.promoInputRow}>
                <TextInput
                  style={styles.promoInput}
                  placeholder={t('booking.promo_placeholder')}
                  placeholderTextColor="#94A3B8"
                  value={promoCode}
                  onChangeText={(v) => { setPromoCode(v); setPromoApplied(false); setPromoInfo(null); setPromoError(''); }}
                  autoCapitalize="characters"
                  editable={!promoApplied}
                />
                {promoApplied ? (
                  <TouchableOpacity style={styles.promoRemoveBtn} onPress={() => { setPromoCode(''); setPromoApplied(false); setPromoInfo(null); setPromoError(''); }}>
                    <Ionicons name="close-circle" size={20} color="#E53E3E" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.promoApplyBtn, (!promoCode.trim() || promoLoading) && styles.promoApplyBtnDisabled]}
                    onPress={async () => {
                      if (!promoCode.trim()) return;
                      setPromoLoading(true);
                      setPromoError('');
                      try {
                        const { bookingService } = await import('@/services/bookingService');
                        const result = await bookingService.validatePromo(promoCode.trim(), totalPrice);
                        setPromoInfo(result.promo);
                        setPromoApplied(true);
                      } catch (e: any) {
                        setPromoError(e?.response?.data?.message || t('booking.promo_invalid'));
                      } finally {
                        setPromoLoading(false);
                      }
                    }}
                    disabled={!promoCode.trim() || promoLoading}
                  >
                    <Text style={styles.promoApplyText}>{promoLoading ? t('common.loading') : t('booking.promo_apply')}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {promoError ? <Text style={styles.promoErrorText}>{promoError}</Text> : null}
              {promoApplied && promoDiscount > 0 ? (
                <Text style={styles.promoSuccessText}>
                  {promoInfo?.discountType === 'percentage'
                    ? `${promoInfo.discountValue}% ${t('booking.promo_off')}`
                    : t('booking.promo_applied', { amount: promoDiscount.toLocaleString() })}
                </Text>
              ) : null}
            </View>
          )}

          {/* PRICE BREAKDOWN */}
          {totalPrice > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>{t('booking.price_breakdown_title')}</Text>
              <View style={styles.breakdownDivider} />
              {(['small', 'medium', 'large'] as const).map((type) => {
                const qty = bags[type]
                if (qty === 0) return null
                const price = store?.pricePerDay?.[type] || 0
                const subtotal = qty * price * days
                const name = type === 'small' ? t('booking.item_small') : type === 'medium' ? t('booking.item_medium') : t('booking.item_large')
                return (
                  <View key={type} style={styles.breakdownRow}>
                    <Text style={styles.breakdownItem}>{qty}x {name}</Text>
                    <Text style={styles.breakdownCalc}>${price}/day × {days} {days > 1 ? t('booking.days') : t('booking.day')}</Text>
                    <Text style={styles.breakdownTotal}>${subtotal.toLocaleString()}</Text>
                  </View>
                )
              })}
              <View style={styles.breakdownDivider} />
              {(() => {
                const baseTotal = Math.max(0, totalPrice - promoDiscount);
                const travelerFee = Math.round(baseTotal * 0.15);
                const totalToPay = baseTotal + travelerFee;
                return (
                  <>
                    <View style={styles.breakdownRow}>
                      <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#1a1c1c' }}>{t('booking.fee_taxes_label')}</Text>
                      <Text style={{ fontSize: 13, color: '#767683' }}>+${travelerFee.toLocaleString()}</Text>
                    </View>
                    {promoDiscount > 0 && (
                      <>
                        <View style={styles.breakdownRow}>
                          <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#22C55E' }}>
                            {promoInfo?.discountType === 'percentage' ? `${promoInfo.discountValue}% ${t('booking.promo_off')}` : t('booking.promo_discount')}
                          </Text>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: '#22C55E' }}>-${promoDiscount.toLocaleString()}</Text>
                        </View>
                        <View style={styles.breakdownDivider} />
                      </>
                    )}
                    <View style={styles.breakdownFinalRow}>
                      <Text style={styles.breakdownFinalLabel}>{t('booking.total_to_pay')}</Text>
                      <Text style={styles.breakdownFinalValue}>${Math.round(totalToPay).toLocaleString()}</Text>
                    </View>
                  </>
                );
              })()}
            </View>
          )}

          {/* PAYMENT METHOD */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentSectionTitle}>{t('booking.payment_method')}</Text>
            {cardsError ? (
              <View style={styles.addCardPrompt}>
                <Ionicons name="alert-circle-outline" size={24} color="#E53E3E" />
                <Text style={[styles.addCardPromptText, { color: '#E53E3E' }]}>{t('booking.error_loading_cards')}</Text>
                <TouchableOpacity style={styles.addCardBtn} onPress={handleAddCard} accessibilityLabel={t('booking.add_card_instead')} accessibilityRole="button">
                  <Text style={styles.addCardBtnText}>{t('booking.add_card_instead')}</Text>
                </TouchableOpacity>
              </View>
            ) : loadingCards ? (
              <ActivityIndicator color="#0A0E5E" style={{ marginVertical: 12 }} />
            ) : savedCards && savedCards.length > 0 ? (
              <>
                <FlatList
                  data={savedCards}
                  keyExtractor={(item: any) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }: { item: any }) => {
                    const isSelected = item.id === selectedCardId;
                    return (
                      <TouchableOpacity
                        style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
                        onPress={() => setSelectedCardId(item.id)}
                        accessibilityLabel={`Select card ending in ${item.last4}`}
                        accessibilityRole="button"
                      >
                        <View style={styles.cardOptionLeft}>
                          <Ionicons
                            name={item.brand === 'visa' ? 'card' : 'card-outline'}
                            size={22}
                            color={isSelected ? '#0A0E5E' : '#64748B'}
                          />
                          <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.cardOptionNumber, isSelected && { color: '#0A0E5E' }]}>
                              •••• {item.last4}
                            </Text>
                            <Text style={styles.cardOptionBrand}>{item.brand?.toUpperCase()}</Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={22}
                          color={isSelected ? '#0A0E5E' : '#CBD5E0'}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
                <TouchableOpacity style={styles.addCardBtn} onPress={handleAddCard} accessibilityLabel="Add another card" accessibilityRole="button">
                  <Ionicons name="add-circle-outline" size={18} color="#0A0E5E" />
                  <Text style={styles.addCardBtnText}>{t('booking.add_another_card')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.addCardPrompt} onPress={handleAddCard} accessibilityLabel="Add payment method" accessibilityRole="button">
                <Ionicons name="card-outline" size={24} color="#0A0E5E" />
                <Text style={styles.addCardPromptText}>{t('booking.add_payment')}</Text>
                <Text style={styles.addCardPromptSub}>{t('booking.secure_checkout')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* TOTAL & CONFIRM */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalHoursLabel}>{t('booking.total_to_pay')}</Text>
              <Text style={styles.totalAmount}>
                ${(() => {
                  const base = Math.max(0, totalPrice - promoDiscount);
                  return Math.round(base + Math.round(base * 0.15)).toLocaleString();
                })()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.confirmButton, (totalPrice === 0 || isPending) && styles.disabledBtn]}
              disabled={Math.max(0, totalPrice - promoDiscount) === 0 || isPending}
              onPress={handleConfirm}
              accessibilityLabel="Confirm booking"
              accessibilityRole="button"
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>{t('booking.confirm_booking')} </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: { height: 280, width: '100%', marginBottom: 10 },
  bannerImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  headerInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  storeName: { fontSize: 22, fontWeight: 'bold', color: '#0A0E5E' },
  subInfo: { fontSize: 13, color: '#8898AA', marginTop: 5 },
  statsContainer: { paddingHorizontal: 25, marginTop: 15 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#0A0E5E', fontWeight: '600', fontSize: 14 },
  sectionCard: { margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  securityGrid: { gap: 8 },
  securityItem: { color: '#4A5568', fontSize: 14 },
  whiteSection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    marginTop: 10,
    elevation: 20,
  },
  configMainTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 20 },
  dateTimeRow: { gap: 12, marginBottom: 25 },
  dateInput: {
    backgroundColor: '#F8F9FB',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  dateLabel: { fontSize: 10, color: '#8898AA', fontWeight: 'bold', marginBottom: 4 },
  dateValue: { fontSize: 13, color: '#0A0E5E', fontWeight: '600' },
  luggageLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8898AA',
    marginBottom: 15,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#0A0E5E' },
  itemPrice: { fontSize: 13, color: '#8898AA' },
  itemSubLabel: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  availabilityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  availabilityText: { fontSize: 10, color: '#2E7D32', fontWeight: '800' },
  soldOutBadge: { backgroundColor: '#FFEBEE' },
  soldOutText: { color: '#C62828' },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  counterBtn: { padding: 5 },
  countNumber: { marginHorizontal: 15, fontWeight: '800', fontSize: 16, color: '#0A0E5E' },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  totalHoursLabel: { fontSize: 12, color: '#8898AA' },
  totalAmount: { fontSize: 32, fontWeight: 'bold', color: '#0A0E5E' },
  confirmButton: {
    backgroundColor: '#0A0E5E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 5,
  },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { backgroundColor: '#CBD5E0' },
  errorText: { color: '#64748B', marginBottom: 20 },
  retryBtn: { backgroundColor: '#0A0E5E', padding: 12, borderRadius: 8 },
  retryBtnText: { color: 'white', fontWeight: 'bold' },

  // Price Breakdown
  breakdownCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8898AA',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownItem: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0A0E5E',
  },
  breakdownCalc: {
    fontSize: 11,
    color: '#8898AA',
    marginRight: 12,
  },
  breakdownTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0E5E',
    minWidth: 60,
    textAlign: 'right',
  },
  breakdownFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownFinalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0A0E5E',
  },
  breakdownFinalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E5E',
  },

  // Value Declaration
  valueDeclareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  valueDeclareBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  valueDeclareCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  valueDeclareDesc: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  valueInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  valueCurrency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0E5E',
  },
  // Payment Section
  paymentSection: {
    marginTop: 24,
  },
  paymentSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8898AA',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
  },
  cardOptionSelected: {
    borderColor: '#0A0E5E',
    backgroundColor: '#F0F2FF',
  },
  cardOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardOptionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  cardOptionBrand: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
  },
  addCardBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0A0E5E',
  },
  addCardPrompt: {
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  addCardPromptText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0E5E',
    marginTop: 4,
  },
  addCardPromptSub: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // Promo Code
  promoSection: { marginTop: 20 },
  promoInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  promoInput: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#0A0E5E',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    textTransform: 'uppercase',
  },
  promoApplyBtn: {
    backgroundColor: '#0A0E5E',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  promoApplyBtnDisabled: { opacity: 0.5 },
  promoApplyText: { color: 'white', fontWeight: '700', fontSize: 14 },
  promoRemoveBtn: { padding: 10 },
  promoErrorText: { color: '#E53E3E', fontSize: 12, marginTop: 6 },
  promoSuccessText: { color: '#22C55E', fontSize: 12, marginTop: 6, fontWeight: '600' },

  // Hours Styles
  hoursList: { marginTop: 10, gap: 8 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  dayText: { color: '#4A5568', fontSize: 14, fontWeight: '500' },
  timeText: { color: '#2D3748', fontSize: 14, fontWeight: 'bold' },
  closedText: { color: '#E53E3E' },
  reviewsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#F8F9FB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A0E5E',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 8,
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#F8F9FB',
    borderRadius: 20,
    marginTop: 10,
  },
  emptyReviews: {
    color: '#8898AA',
    fontSize: 14,
    marginTop: 10,
  },
})
