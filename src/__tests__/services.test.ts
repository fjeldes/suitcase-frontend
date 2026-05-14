import { paymentService } from '@/services/paymentServices';
import { notificationService } from '@/services/notificationService';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('paymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getSavedCards calls GET /payments/methods', async () => {
    const mockCards = [
      { id: 'pm_1', brand: 'visa', last4: '4242' },
    ];
    (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockCards });

    const result = await paymentService.getSavedCards();
    expect(mockedApi.get).toHaveBeenCalledWith('/payments/methods');
    expect(result).toEqual(mockCards);
  });

  it('fetchPaymentSheetParams calls POST /payments/create-payment-sheet', async () => {
    const mockResponse = {
      paymentIntent: 'pi_secret',
      customer: 'cus_123',
      ephemeralKey: 'ek_123',
      publishableKey: 'pk_test',
    };
    (mockedApi.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await paymentService.fetchPaymentSheetParams(5000, 'clp');
    expect(mockedApi.post).toHaveBeenCalledWith('/payments/create-payment-sheet', {
      amount: 5000,
      currency: 'clp',
    });
    expect(result).toEqual(mockResponse);
  });

  it('fetchSetupIntentParams calls POST /payments/create-setup-intent', async () => {
    (mockedApi.post as jest.Mock).mockResolvedValue({
      data: { clientSecret: 'seti_secret', customer: 'cus_123', ephemeralKey: 'ek_123', publishableKey: 'pk_test' },
    });

    const result = await paymentService.fetchSetupIntentParams();
    expect(mockedApi.post).toHaveBeenCalledWith('/payments/create-setup-intent');
    expect(result.clientSecret).toBe('seti_secret');
  });

  it('confirmWithSavedCard calls POST /payments/confirm-payment', async () => {
    (mockedApi.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await paymentService.confirmWithSavedCard(1000, 'usd', 'pm_123');
    expect(mockedApi.post).toHaveBeenCalledWith('/payments/confirm-payment', {
      amount: 1000,
      currency: 'usd',
      paymentMethodId: 'pm_123',
    });
    expect(result.success).toBe(true);
  });
});

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getActivities calls GET /notifications with category', async () => {
    (mockedApi.get as jest.Mock).mockResolvedValue({ data: [] });

    await notificationService.getActivities('BOOKINGS');
    expect(mockedApi.get).toHaveBeenCalledWith('/notifications', {
      params: { category: 'BOOKINGS' },
    });
  });

  it('getActivities omits category for ALL', async () => {
    (mockedApi.get as jest.Mock).mockResolvedValue({ data: [] });

    await notificationService.getActivities('All Notifications');
    expect(mockedApi.get).toHaveBeenCalledWith('/notifications', {
      params: { category: undefined },
    });
  });

  it('markAsRead calls PATCH /notifications/{id}/read', async () => {
    (mockedApi.patch as jest.Mock).mockResolvedValue({ data: {} });

    await notificationService.markAsRead('notif_123');
    expect(mockedApi.patch).toHaveBeenCalledWith('/notifications/notif_123/read');
  });

  it('markAllAsRead calls POST /notifications/mark-all-read', async () => {
    (mockedApi.post as jest.Mock).mockResolvedValue({ data: {} });

    await notificationService.markAllAsRead();
    expect(mockedApi.post).toHaveBeenCalledWith('/notifications/mark-all-read');
  });

  it('getUnreadCount calls GET /notifications/unread-count', async () => {
    (mockedApi.get as jest.Mock).mockResolvedValue({ data: { count: 3 } });

    const result = await notificationService.getUnreadCount();
    expect(mockedApi.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(result.count).toBe(3);
  });

  it('registerToken calls POST /notifications/register-token', async () => {
    const payload = { token: 'expo_token', provider: 'expo' as const };
    (mockedApi.post as jest.Mock).mockResolvedValue({ data: {} });

    await notificationService.registerToken(payload);
    expect(mockedApi.post).toHaveBeenCalledWith('/notifications/register-token', payload);
  });
});
