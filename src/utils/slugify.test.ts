import { slugify, unslugify } from './slugify';

describe('Slugify Utils', () => {
  describe('slugify', () => {
    it('debería convertir texto a slug correctamente', () => {
      expect(slugify('Acer Liquid Z6 Plus')).toBe('acer-liquid-z6-plus');
    });

    it('debería manejar espacios múltiples', () => {
      expect(slugify('Test   Phone')).toBe('test-phone');
    });

    it('debería manejar caracteres especiales', () => {
      expect(slugify('Test! Phone@2025')).toBe('test-phone2025');
    });

    it('debería manejar texto vacío', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('unslugify', () => {
    it('debería convertir slug de vuelta a texto legible', () => {
      expect(unslugify('acer-liquid-z6-plus')).toBe('Acer Liquid Z6 Plus');
    });

    it('debería manejar slug simple', () => {
      expect(unslugify('test')).toBe('Test');
    });

    it('debería manejar texto vacío', () => {
      expect(unslugify('')).toBe('');
    });
  });
});