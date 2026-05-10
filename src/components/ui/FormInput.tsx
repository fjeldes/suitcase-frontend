import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

// T representa los datos del formulario (ej. RegisterFormData)
interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>; // Esto asegura que 'name' sea una de las llaves del formulario
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: any; // O FieldError si prefieres ser estricto
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
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputField, error && styles.inputError]}>
            <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={isPassword && !showPassword}
              {...props}
            />
            {isPassword && (
              <TouchableOpacity onPress={togglePassword}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    gap: 8,
    marginBottom: 4, // Espacio entre campos
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1F71',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent', // Para que no salte el layout al mostrar el error
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#1A1F71',
    fontSize: 15,
    height: '100%',
  },
  inputError: {
    borderColor: '#E74C3C', // Borde rojo si hay error
    backgroundColor: '#FFF5F5', // Opcional: fondo ligeramente rojizo
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginLeft: 4,
  },
});