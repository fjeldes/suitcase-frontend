import { ROUTES } from '@/constants/routes';

describe('ROUTES', () => {
  it('has auth routes', () => {
    expect(ROUTES.AUTH.LOGIN).toBe('/(auth)/login');
    expect(ROUTES.AUTH.SIGNUP).toBe('/(auth)/signup');
    expect(ROUTES.AUTH.SPLASH).toBe('/(auth)/splash');
  });

  it('has owner routes', () => {
    expect(ROUTES.OWNER.DASHBOARD).toBe('/(owner)');
    expect(ROUTES.OWNER.NOTIFICATIONS).toBe('/(owner)/notifications');
    expect(ROUTES.OWNER.PROFILE).toBe('/(owner)/profile');
  });

  it('builds dynamic booking detail route', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const route = ROUTES.OWNER.BOOKING_DETAIL(id);
    expect(route).toBe(`/(owner)/bookings/${id}`);
  });

  it('builds dynamic client store detail route', () => {
    const id = 'store-123';
    const route = ROUTES.CLIENT.STORE_DETAIL(id);
    expect(route).toBe(`/(client)/store/${id}`);
  });

  it('builds legal route', () => {
    expect(ROUTES.LEGAL('privacy')).toBe('/legal/privacy');
    expect(ROUTES.LEGAL('owner')).toBe('/legal/owner');
  });

  it('has client routes', () => {
    expect(ROUTES.CLIENT.EXPLORE).toBe('/(client)');
    expect(ROUTES.CLIENT.PROFILE).toBe('/(client)/profile');
    expect(ROUTES.CLIENT.BOOKINGS).toBe('/(client)/bookings');
  });
});
