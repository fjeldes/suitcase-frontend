import { useTheme } from '@/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  icon: any;
  label: string;
  subLabel: string;
  priceValue: string;
  capacityValue: string;
  onPriceChange: (val: string) => void;
  onCapacityChange: (val: string) => void;
}

export const StorageCard = ({ 
  icon, 
  label, 
  subLabel, 
  priceValue, 
  capacityValue, 
  onPriceChange, 
  onCapacityChange 
}: Props) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>

      <View style={styles.row}>
        <View style={styles.fieldColumn}>
          <Text style={styles.fieldHeader}>PRICE / DAY</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={priceValue}
              onChangeText={onPriceChange}
              placeholder="0.00"
              placeholderTextColor={colors.iconMuted}
            />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.fieldColumn}>
          <Text style={styles.fieldHeader}>CAPACITY</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={capacityValue}
              onChangeText={onCapacityChange}
              placeholder="0"
              placeholderTextColor={colors.iconMuted}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  card: { 
    backgroundColor: colors.surfaceCard, 
    borderRadius: 24, 
    padding: 24, 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 14, 
    backgroundColor: colors.surfaceLight, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  label: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  subLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 20 },
  row: { 
    flexDirection: 'row', 
    width: '100%',
    alignItems: 'flex-end'
  },
  fieldColumn: { 
    flex: 1 
  },
  separator: { 
    width: 15 
  },
  fieldHeader: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: colors.iconMuted, 
    textAlign: 'center', 
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surfaceLight, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 48 
  },
  currency: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.textMuted, 
    marginRight: 2 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600',
    color: colors.textPrimary, 
    textAlign: 'center',
    padding: 0
  }
});
