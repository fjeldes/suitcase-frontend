import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: any;
  isPassword?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
}

export const FormInput = <T extends FieldValues>({ 
  control, 
  name, 
  label, 
  icon, 
  error, 
  isPassword, 
  showPassword, 
  togglePassword, 
  ...props 
}: Props<T>) => {
  const { colors } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={s.inputWrapper}>
      <Text style={s.inputLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[s.inputField, error && s.inputError]}>
            <Ionicons name={icon} size={20} color={colors.iconMuted} style={s.inputIcon} />
            <TextInput
              style={s.textInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.iconMuted}
              secureTextEntry={isPassword && !showPassword}
              {...props}
            />
            {isPassword && (
              <TouchableOpacity onPress={togglePassword}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={colors.iconMuted} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {error && <Text style={s.errorText}>{error.message}</Text>}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  inputWrapper: { gap: 8, marginBottom: 4 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: colors.textLabel, letterSpacing: 0.5, textTransform: 'uppercase' },
  inputField: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight,
    borderRadius: 12, paddingHorizontal: 16, height: 56,
    borderWidth: 1, borderColor: 'transparent',
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, color: colors.textPrimary, fontSize: 15, height: '100%' },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorLight },
  errorText: { color: colors.error, fontSize: 11, fontWeight: '600', marginTop: 2, marginLeft: 4 },
});
