import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateReviewDto, reviewService } from '@/services/reviewServices';
import Toast from 'react-native-toast-message';

export function useReviews(locationId?: string) {
  const queryClient = useQueryClient();

  // Obtener todas las reseñas de un local
  const reviewsQuery = useQuery({
    queryKey: ['reviews', locationId],
    queryFn: () => (locationId ? reviewService.getByLocation(locationId) : []),
    enabled: !!locationId,
  });

  // Obtener el promedio de un local
  const averageQuery = useQuery({
    queryKey: ['average-rating', locationId],
    queryFn: () => (locationId ? reviewService.getAverageRating(locationId) : 0),
    enabled: !!locationId,
  });

  // Mutación para crear una reseña
  const createReviewMutation = useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewService.create(dto),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Review Shared!',
        text2: 'Thank you for your feedback.',
      });
      // Invalidar queries para refrescar la data
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['average-rating'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Could not post review',
      });
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoadingReviews: reviewsQuery.isLoading,
    averageRating: averageQuery.data || 0,
    createReview: createReviewMutation.mutate,
    isPostingReview: createReviewMutation.isPending,
  };
}
