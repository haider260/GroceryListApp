import { create } from 'zustand';
import { Filter, GroceryList, ItemInput } from '../types';
import { storageService } from '../services/storageService';
import { createId, validateItem } from '../utils/grocery';
interface State {
  lists: GroceryList[];
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  filter: Filter;
  search: string;
  hydrate: () => Promise<void>;
  retrySave: () => Promise<void>;
  setFilter: (filter: Filter) => void;
  setSearch: (search: string) => void;
  createList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  saveItem: (listId: string, input: ItemInput, itemId?: string) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItem: (listId: string, itemId: string) => void;
}
export const useGroceryStore = create<State>((set, get) => {
  const persist = async (lists: GroceryList[]) => {
    try {
      await storageService.save(lists);
      set({ error: null });
    } catch {
      set({
        error:
          'Changes are on this screen but could not be saved. Please retry.',
      });
    }
  };
  const commit = (lists: GroceryList[]) => {
    if (!get().hydrated) {
      return;
    }
    set({ lists });
    void persist(lists);
  };
  const update = (id: string, fn: (list: GroceryList) => GroceryList) =>
    commit(
      get().lists.map(l =>
        l.id === id ? { ...fn(l), updatedAt: new Date().toISOString() } : l,
      ),
    );
  return {
    lists: [],
    hydrated: false,
    loading: false,
    error: null,
    filter: 'All',
    search: '',
    hydrate: async () => {
      if (get().loading || get().hydrated) {
        return;
      }
      set({ loading: true, error: null });
      try {
        set({ lists: await storageService.load(), hydrated: true });
      } catch {
        set({
          error:
            'Your saved lists could not be opened. Retry to keep your data safe.',
        });
      } finally {
        set({ loading: false });
      }
    },
    retrySave: async () => {
      await persist(get().lists);
    },
    setFilter: filter => set({ filter }),
    setSearch: search => set({ search }),
    createList: name => {
      const id = createId();
      if (!name.trim()) {
        return '';
      }
      const now = new Date().toISOString();
      commit([
        { id, name: name.trim(), createdAt: now, updatedAt: now, items: [] },
        ...get().lists,
      ]);
      return id;
    },
    renameList: (id, name) => {
      if (name.trim()) {
        update(id, l => ({ ...l, name: name.trim() }));
      }
    },
    deleteList: id => commit(get().lists.filter(l => l.id !== id)),
    saveItem: (listId, input, itemId) => {
      const error = validateItem(input);
      if (error) {
        throw new Error(error);
      }
      update(listId, l => ({
        ...l,
        items: itemId
          ? l.items.map(i =>
              i.id === itemId ? { ...i, ...input, name: input.name.trim() } : i,
            )
          : [
              ...l.items,
              {
                ...input,
                name: input.name.trim(),
                id: createId(),
                createdAt: new Date().toISOString(),
                isPurchased: false,
              },
            ],
      }));
    },
    deleteItem: (listId, itemId) =>
      update(listId, l => ({
        ...l,
        items: l.items.filter(i => i.id !== itemId),
      })),
    toggleItem: (listId, itemId) =>
      update(listId, l => ({
        ...l,
        items: l.items.map(i =>
          i.id === itemId ? { ...i, isPurchased: !i.isPurchased } : i,
        ),
      })),
  };
});
