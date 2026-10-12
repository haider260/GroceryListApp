import {
  Apple,
  Milk,
  Fish,
  Croissant,
  Coffee,
  Cookie,
  SprayCan,
  ShoppingBasket,
} from 'lucide-react-native';
import { Category } from '../types';
export const categoryMeta: Record<
  Category,
  { icon: typeof Apple; color: string; background: string }
> = {
  'Fruits & Vegetables': {
    icon: Apple,
    color: '#469748',
    background: '#EDF5DA',
  },
  'Dairy & Eggs': { icon: Milk, color: '#588BBA', background: '#EAF2FC' },
  'Meat & Seafood': { icon: Fish, color: '#CD7770', background: '#FDEDE9' },
  Bakery: { icon: Croissant, color: '#B38843', background: '#FCF1DB' },
  Beverages: { icon: Coffee, color: '#9479B6', background: '#F1EBFA' },
  Snacks: { icon: Cookie, color: '#CF9256', background: '#FFF0E2' },
  Household: { icon: SprayCan, color: '#4B9898', background: '#E3F3F1' },
  Others: { icon: ShoppingBasket, color: '#7B8490', background: '#EEF0F3' },
};
