import { apiService } from '../services/apiService';

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('getProducts devuelve productos', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', brand: 'Acer', model: 'Test', price: '100', options: { colors: [], storages: [] } }
        ])
      })
    ) as jest.Mock;
    const products = await apiService.getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it('getProduct devuelve un producto', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', brand: 'Acer', model: 'Test', price: '100', options: { colors: [], storages: [] } })
      })
    ) as jest.Mock;
    const product = await apiService.getProduct('1');
    expect(product).toHaveProperty('id', '1');
  });

  it('addToCart devuelve count', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 2 })
      })
    ) as jest.Mock;
    const res = await apiService.addToCart({ id: '1', colorCode: 1, storageCode: 1 });
    expect(res.count).toBe(2);
  });

  it('maneja error en getProducts', async () => {
    // Limpia el caché antes del test
    const { cacheService } = await import('../services/cacheService');
    cacheService.clear();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve([]) })
    ) as jest.Mock;
    await expect(apiService.getProducts()).rejects.toThrow();
  });
});
