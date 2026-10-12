export const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household',
  'Others',
] as const;
export const units = ['kg', 'g', 'liter', 'pcs', 'pack'] as const;
export type Category = (typeof categories)[number];
export type Unit = (typeof units)[number];
export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: Category;
  price?: number;
  isPurchased: boolean;
  createdAt: string;
}
export interface GroceryList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: GroceryItem[];
}
export type ItemInput = Omit<GroceryItem, 'id' | 'createdAt' | 'isPurchased'>;
export type Filter = 'All' | 'Pending' | 'Purchased';
export type RootStackParamList = {
  Home: undefined;
  List: { listId: string };
  Item: { listId: string; itemId?: string };
};
