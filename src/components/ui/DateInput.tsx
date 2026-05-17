import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';

interface DateInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  format?: string;
  placeholder?: string;
  icon?: keyof typeof Ionicons.prototype.props.name;
}

export const DateInput = ({
  label,
  value,
  onChange,
  mode = 'datetime',
  minimumDate,
  maximumDate,
  format = 'ddd, MMM D - HH:mm',
  placeholder,
  icon = 'calendar-outline',
}: DateInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const showPicker = () => setIsVisible(true);
  const hidePicker = () => setIsVisible(false);

  const handleConfirm = (date: Date) => {
    onChange(date);
    hidePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={styles.inputBox} 
        onPress={showPicker}
        activeOpacity={0.7}
        accessibilityLabel={`Select ${label.toLowerCase()}`}
        accessibilityRole="button"
      >
        <View style={styles.content}>
          <Ionicons name={icon as any} size={18} color="#0A0E5E" style={styles.icon} />
          <Text style={styles.value}>
            {value ? dayjs(value).format(format) : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color="#94A3B8" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={value || new Date()}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        minuteInterval={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8898AA',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputBox: {
    backgroundColor: '#F8F9FB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: '#0A0E5E',
    fontWeight: '600',
  },
});
