import { Brand, Colors, DarkColors } from '@/styles/colors';

describe('Brand', () => {
  it('has required brand tokens', () => {
    expect(Brand.primaryStart).toBe('#000666');
    expect(Brand.secondary).toBe('#fd6c00');
    expect(Brand.surface).toBe('#f9f9f9');
  });
});

describe('Colors (light)', () => {
  it('has all required fields', () => {
    expect(Colors.primary).toBeTruthy();
    expect(Colors.background).toBeTruthy();
    expect(Colors.textPrimary).toBeTruthy();
    expect(Colors.surfaceCard).toBeTruthy();
    expect(Colors.tabBarBg).toBeTruthy();
    expect(Colors.iconColor).toBeTruthy();
  });

  it('uses brand tokens correctly', () => {
    expect(Colors.primary).toBe(Brand.primaryStart);
    expect(Colors.background).toBe(Brand.surface);
    expect(Colors.white).toBe(Brand.surfaceContainer);
  });
});

describe('DarkColors', () => {
  it('has same keys as Colors', () => {
    const lightKeys = Object.keys(Colors).sort();
    const darkKeys = Object.keys(DarkColors).sort();
    expect(darkKeys).toEqual(lightKeys);
  });

  it('has different values from light mode', () => {
    expect(DarkColors.background).not.toBe(Colors.background);
    expect(DarkColors.textPrimary).not.toBe(Colors.textPrimary);
  });

  it('uses dark palette values', () => {
    expect(DarkColors.background).toBe('#0F0F23');
    expect(DarkColors.textPrimary).toBe('#ECEDEE');
    expect(DarkColors.surfaceCard).toBe('#1A1A2E');
  });
});
