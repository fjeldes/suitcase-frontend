import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native';

interface BottomSheetModalProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
}

export const BottomSheetModal = ({ visible, onClose, children, style, ...props }: BottomSheetModalProps) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
          <View style={[styles.content, { backgroundColor: colors.surfaceModal }]} {...props}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1 },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
