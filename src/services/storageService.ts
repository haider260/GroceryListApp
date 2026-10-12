import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories, GroceryList, units } from '../types';
const KEY = '@freshlist/lists/v1';
let queue: Promise<void> = Promise.resolve();
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
function isValid(data: unknown): data is GroceryList[] {
  return (
    Array.isArray(data) &&
    data.every((list: unknown) => {
      if (
        !isRecord(list) ||
        typeof list.id !== 'string' ||
        typeof list.name !== 'string' ||
        typeof list.createdAt !== 'string' ||
        typeof list.updatedAt !== 'string' ||
        !Array.isArray(list.items)
      ) {
        return false;
      }
      return list.items.every(
        (item: unknown) =>
          isRecord(item) &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.createdAt === 'string' &&
          typeof item.isPurchased === 'boolean' &&
          typeof item.quantity === 'number' &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0 &&
          units.some(unit => unit === item.unit) &&
          categories.some(category => category === item.category) &&
          (item.price === undefined ||
            (typeof item.price === 'number' &&
              Number.isFinite(item.price) &&
              item.price >= 0)),
      );
    })
  );
}
export const storageService = {
  async load(): Promise<GroceryList[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const data: unknown = JSON.parse(raw);
    if (!isValid(data)) {
      throw new Error('Invalid saved data');
    }
    return data;
  },
  save(lists: GroceryList[]) {
    const payload = JSON.stringify(lists);
    const next = queue
      .catch(() => {})
      .then(() => AsyncStorage.setItem(KEY, payload));
    queue = next;
    return next;
  },
};
