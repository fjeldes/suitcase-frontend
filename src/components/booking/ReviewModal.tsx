import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BookingData } from '@/types/booking.types';
import { useReviews } from '@/hooks/useReviews';

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  booking: BookingData;
  onSuccess?: () => void;
}

export const ReviewModal = ({ isVisible, onClose, booking, onSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { createReview, isPostingReview } = useReviews();

  const handleSubmit = () => {
    createReview({
      bookingId: booking.id,
      rating,
      comment,
    }, {
      onSuccess: () => {
        onClose();
        setComment('');
        setRating(5);
        onSuccess?.();
      }
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Rate your experience</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close review modal" accessibilityRole="button">
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              How was your storage at {booking?.location?.name}?
            </Text>

            {/* Stars Selector */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  accessibilityLabel={`Rate ${star} stars`}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={42}
                    color={star <= rating ? "#FFD700" : "#E2E8F0"}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Input */}
            <TextInput
              style={styles.input}
              placeholder="Tell us about your experience (optional)..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              accessibilityLabel="Review comment input"
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isPostingReview && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={isPostingReview}
              accessibilityLabel="Submit review"
              accessibilityRole="button"
            >
              {isPostingReview ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 94, 0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '80%',
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0E5E',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  closeBtn: {
    padding: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  star: {
    marginHorizontal: 2,
  },
  input: {
    backgroundColor: '#F8F9FE',
    borderRadius: 20,
    padding: 16,
    height: 120,
    fontSize: 15,
    color: '#0A0E5E',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#0A0E5E',
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
});
