import { cacheService } from './cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    // Limpiar cache antes de cada test
    cacheService.clear();
    localStorage.clear();
  });

  afterEach(() => {
    // Limpiar después de cada test
    cacheService.clear();
    localStorage.clear();
  });

  it('debería guardar y recuperar datos del cache', () => {
    const testData = { test: 'data' };
    cacheService.set('test-key', testData);
    
    const retrieved = cacheService.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('debería retornar null para claves inexistentes', () => {
    const result = cacheService.get('non-existent-key');
    expect(result).toBeNull();
  });

  it('debería limpiar el cache correctamente', () => {
    cacheService.set('test-key', { data: 'test' });
    cacheService.clear();
    
    const result = cacheService.get('test-key');
    expect(result).toBeNull();
  });
});