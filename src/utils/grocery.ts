import { Filter, GroceryItem, GroceryList, ItemInput } from '../types';
let sequence = 0;
export const createId = () =>
  `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
export const progress = (items: GroceryItem[]) => {
  const done = items.filter(i => i.isPurchased).length;
  return {
    done,
    total: items.length,
    percent: items.length ? Math.round((done / items.length) * 100) : 0,
  };
};
export const selectItems = (
  items: GroceryItem[],
  filter: Filter,
  search: string,
) =>
  items.filter(
    i =>
      (filter === 'All' || i.isPurchased === (filter === 'Purchased')) &&
      i.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
export function validateItem(input: ItemInput) {
  if (!input.name.trim()) {
    return 'Give your item a name.';
  }
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return 'Quantity must be greater than zero.';
  }
  if (
    input.price !== undefined &&
    (!Number.isFinite(input.price) || input.price < 0)
  ) {
    return 'Enter a valid price of zero or more.';
  }
  return null;
}
export const shareText = (list: GroceryList) =>
  `${list.name}\n${progress(list.items).done}/${
    list.items.length
  } purchased\n\n${list.items
    .map(
      i => `${i.isPurchased ? '✓' : '☐'} ${i.name} — ${i.quantity} ${i.unit}`,
    )
    .join('\n')}\n\nMade with Freshlist`;
