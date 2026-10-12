import {
  progress,
  selectItems,
  shareText,
  validateItem,
} from '../src/utils/grocery';
import { GroceryItem, ItemInput } from '../src/types';
const input: ItemInput = {
  name: 'Apples',
  quantity: 2,
  unit: 'kg',
  category: 'Fruits & Vegetables',
};
const items: GroceryItem[] = [
  { ...input, id: '1', isPurchased: false, createdAt: '2026-01-01' },
  {
    ...input,
    id: '2',
    name: 'Milk',
    isPurchased: true,
    createdAt: '2026-01-01',
  },
];
test('progress handles empty and mixed lists', () => {
  expect(progress([])).toEqual({ done: 0, total: 0, percent: 0 });
  expect(progress(items)).toEqual({ done: 1, total: 2, percent: 50 });
});
test('search and purchased filters compose', () => {
  expect(selectItems(items, 'Pending', ' APP ')).toEqual([items[0]]);
  expect(selectItems(items, 'Purchased', 'apple')).toEqual([]);
  expect(selectItems(items, 'Purchased', '')).toEqual([items[1]]);
});
test('validation rejects invalid names, quantity and price', () => {
  expect(validateItem(input)).toBeNull();
  expect(validateItem({ ...input, name: '  ' })).toBeTruthy();
  for (const quantity of [0, -1, NaN, Infinity]) {
    expect(validateItem({ ...input, quantity })).toBeTruthy();
  }
  expect(validateItem({ ...input, price: -1 })).toBeTruthy();
  expect(validateItem({ ...input, price: 0 })).toBeNull();
});
test('sharing preserves quantities and purchased status', () => {
  const text = shareText({
    id: 'l',
    name: 'Weekly',
    items,
    createdAt: '',
    updatedAt: '',
  });
  expect(text).toContain('☐ Apples — 2 kg');
  expect(text).toContain('✓ Milk — 2 kg');
  expect(text).toContain('1/2 purchased');
});
