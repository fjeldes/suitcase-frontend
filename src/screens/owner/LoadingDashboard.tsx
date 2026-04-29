import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

export const LoadingDashboard = ({ message = "Loading dashboard..." }) => {

  const fadeAnim = useRef(new Animated.Value(0.5)).current;

 useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={styles.circleSkeleton} />
        <View style={styles.textStack}>
          <Animated.View style={[styles.lineShort, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.lineLong, { opacity: fadeAnim }]} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Spinner Principal */}
        <ActivityIndicator size="large" color="#0A0E5E" />
        <Text style={styles.text}>{message}</Text>

        {/* Cards Skeletons Visuales */}
        <View style={styles.row}>
          <Animated.View style={[styles.miniCardSkeleton, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.miniCardSkeleton, { opacity: fadeAnim }]} />
        </View>
        <Animated.View style={[styles.mainCardSkeleton, { opacity: fadeAnim }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSkeleton: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    gap: 12,
  },
  circleSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  textStack: { gap: 6 },
  lineShort: { width: 60, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4 },
  lineLong: { width: 120, height: 12, backgroundColor: '#F1F5F9', borderRadius: 4 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },
  text: {
    marginTop: -10,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 15,
  },
  miniCardSkeleton: {
    flex: 1,
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 24,
  },
  mainCardSkeleton: {
    width: '100%',
    height: 180,
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
});