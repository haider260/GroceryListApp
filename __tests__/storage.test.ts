import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../src/services/storageService';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn().mockResolvedValue(undefined),
}));
beforeEach(() => jest.clearAllMocks());
test('rejects malformed persisted data', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce('{broken');
  await expect(storageService.load()).rejects.toThrow();
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce('[{"id":"x"}]');
  await expect(storageService.load()).rejects.toThrow();
});
test('empty storage starts with no lists', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
  await expect(storageService.load()).resolves.toEqual([]);
});
test('queued writes recover after failure and preserve order', async () => {
  jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('full'));
  const first = storageService.save([]);
  const next = storageService.save([
    { id: '1', name: 'Latest', items: [], createdAt: '', updatedAt: '' },
  ]);
  await expect(first).rejects.toThrow('full');
  await expect(next).resolves.toBeUndefined();
  expect(
    JSON.parse(jest.mocked(AsyncStorage.setItem).mock.calls[1][1])[0].name,
  ).toBe('Latest');
});
