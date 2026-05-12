import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '📍',
    titleKey: 'onboarding.slide1_title',
    subtitleKey: 'onboarding.slide1_desc',
  },
  {
    id: '2',
    emoji: '📅',
    titleKey: 'onboarding.slide2_title',
    subtitleKey: 'onboarding.slide2_desc',
  },
  {
    id: '3',
    emoji: '📱',
    titleKey: 'onboarding.slide3_title',
    subtitleKey: 'onboarding.slide3_desc',
  },
  {
    id: '4',
    emoji: '🔔',
    titleKey: 'onboarding.slide4_title',
    subtitleKey: 'onboarding.slide4_desc',
  },
];

const ONBOARDING_KEY = 'onboarding_complete';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000666', '#1a237e']} style={StyleSheet.absoluteFill} />

      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Button */}
      <View style={styles.bottom}>
        {isLast ? (
          <TouchableOpacity style={styles.cta} onPress={handleGetStarted}>
            <Text style={styles.ctaText}>{t('onboarding.get_started')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>{t('common.next')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleGetStarted} style={styles.skip}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24, backgroundColor: '#fd6c00', borderRadius: 4 },
  bottom: { paddingHorizontal: 40, paddingBottom: 60, alignItems: 'center', gap: 12 },
  cta: {
    backgroundColor: '#fd6c00', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 16,
    width: '100%', alignItems: 'center',
  },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 18 },
  nextBtn: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 16, width: '100%', alignItems: 'center' },
  nextText: { color: 'white', fontWeight: '600', fontSize: 16 },
  skip: { padding: 8 },
  skipText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
});
