import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const NetworkBanner = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E53E3E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
});
