import { renderHook } from '@testing-library/react-native';
import { notificationService } from '@/services/notificationService';
import { useNotifications } from '@/hooks/useNotifications';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn((opts: any) => ({
    isLoading: false,
    isRefetching: false,
    data: [],
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock('@/services/notificationService', () => ({
  notificationService: {
    getActivities: jest.fn(),
    markAllAsRead: jest.fn(),
  },
}));

const mockedService = notificationService as jest.Mocked<typeof notificationService>;
const mockedReactQuery = jest.requireMock('@tanstack/react-query');

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns notifications from query data', () => {
    const mockData = [
      { id: '1', title: 'Test', message: 'Hello', isRead: false, category: 'SYSTEM', metadata: {}, createdAt: new Date().toISOString() },
    ];
    mockedReactQuery.useQuery.mockReturnValue({
      isLoading: false,
      data: mockData,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useNotifications('ALL'));
    expect(result.current.notifications).toEqual(mockData);
  });

  it('returns empty array when no data', () => {
    mockedReactQuery.useQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useNotifications('ALL'));
    expect(result.current.notifications).toEqual([]);
  });

  it('provides markAllRead function', () => {
    const mockMutate = jest.fn();
    mockedReactQuery.useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    const { result } = renderHook(() => useNotifications('ALL'));
    result.current.markAllRead();
    expect(mockMutate).toHaveBeenCalled();
  });

  it('exposes loading state', () => {
    mockedReactQuery.useQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useNotifications('ALL'));
    expect(result.current.isLoading).toBe(true);
  });
});
