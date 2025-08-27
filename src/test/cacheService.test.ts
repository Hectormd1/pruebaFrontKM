import { cacheService } from '../services/cacheService';

describe('cacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('guarda y obtiene datos', () => {
    cacheService.set('test', 'valor');
    expect(cacheService.get('test')).toBe('valor');
  });

  it('devuelve null si no existe', () => {
    expect(cacheService.get('no-existe')).toBeNull();
  });

  it('borra datos', () => {
    cacheService.set('test', 'valor');
    cacheService.delete('test');
    expect(cacheService.get('test')).toBeNull();
  });
});
