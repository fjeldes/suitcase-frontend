import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatMiniCardsProps {
  today: number;
  yesterday: number;
  percentageIncrease: number;
}

export const StatMiniCards = ({ 
  today, 
  percentageIncrease, 
}: StatMiniCardsProps) => {
  
  // Determinamos el icono de tendencia (subida o bajada)
  const isPositive = percentageIncrease >= 0;
  const trendIcon = isPositive ? '↗' : '↘';

  return (
    <View style={styles.row}>
      {/* Tarjeta de REVENUE (Azul) */}
      <View style={[styles.miniCard, { backgroundColor: '#0A0E5E' }]}>
        <Text style={styles.miniLabelWhite}>REVENUE</Text>
        <Text style={styles.miniValueWhite}>${today.toFixed(2)}</Text>
        <Text style={styles.miniSubWhite}>
          {trendIcon} {isPositive ? '+' : ''}{percentageIncrease}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    width: '100%' 
  },
  miniCard: { 
    flex: 1, 
    backgroundColor: '#0A0E5E', 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 4 
  },
  miniLabelWhite: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: 'rgba(255,255,255,0.6)', 
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  miniValueWhite: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFF', 
    marginBottom: 4 
  },
  miniSubWhite: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#FFF' 
  },
});