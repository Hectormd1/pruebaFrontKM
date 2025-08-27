
import { cacheService } from '../services/cacheService';

describe('cacheService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('guarda y recupera un valor', () => {
    cacheService.set('foo', 'bar', 1000);
    expect(cacheService.get('foo')).toBe('bar');
  });

  it('devuelve null si la clave no existe', () => {
    expect(cacheService.get('nope')).toBeNull();
  });

  it('elimina un valor', () => {
    cacheService.set('foo', 'bar', 1000);
    cacheService.delete('foo');
    expect(cacheService.get('foo')).toBeNull();
  });

  it('expira correctamente tras el tiempo dado', () => {
    cacheService.set('foo', 'bar', 1000);
    jest.advanceTimersByTime(1001);
    expect(cacheService.get('foo')).toBeNull();
  });

  it('no expira antes del tiempo', () => {
    cacheService.set('foo', 'bar', 1000);
    jest.advanceTimersByTime(999);
    expect(cacheService.get('foo')).toBe('bar');
  });

  it('soporta valores complejos (objetos)', () => {
    const obj = { a: 1, b: 'x' };
    cacheService.set('obj', obj, 1000);
    expect(cacheService.get('obj')).toEqual(obj);
  });

  it('devuelve null si el valor está corrupto', () => {
    localStorage.setItem('cache_bad', 'not-json');
    expect(cacheService.get('bad')).toBeNull();
  });

  it('devuelve null si el valor no tiene expires', () => {
    localStorage.setItem('cache_bad2', JSON.stringify({ value: 'x' }));
    expect(cacheService.get('bad2')).toBeFalsy();
  });

  it('verifica que una clave existe', () => {
    expect(cacheService.has('nope')).toBe(false);
    cacheService.set('exists', 'value', 1000);
    expect(cacheService.has('exists')).toBe(true);
  });

  it('limpia todo el cache', () => {
    cacheService.set('key1', 'value1', 1000);
    cacheService.set('key2', 'value2', 1000);
    expect(cacheService.has('key1')).toBe(true);
    expect(cacheService.has('key2')).toBe(true);
    
    cacheService.clear();
    expect(cacheService.has('key1')).toBe(false);
    expect(cacheService.has('key2')).toBe(false);
  });
});
