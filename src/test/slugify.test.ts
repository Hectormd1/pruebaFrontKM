import { slugify } from '../utils/slugify';

describe('slugify', () => {
  it('convierte texto a slug', () => {
    expect(slugify('Acer Liquid Z6 Plus')).toBe('acer-liquid-z6-plus');
  });
  it('maneja espacios múltiples', () => {
    expect(slugify('Test   Phone')).toBe('test-phone');
  });
  it('maneja caracteres especiales', () => {
    expect(slugify('Test! Phone@2025')).toBe('test-phone2025');
  });
});
