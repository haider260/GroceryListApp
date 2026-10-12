import { useGroceryStore } from '../src/store/useGroceryStore';
import { storageService } from '../src/services/storageService';
import { ItemInput } from '../src/types';
jest.mock('../src/services/storageService', () => ({
  storageService: {
    load: jest.fn(),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));
const input: ItemInput = {
  name: ' Apples ',
  quantity: 2,
  unit: 'kg',
  category: 'Fruits & Vegetables',
};
beforeEach(() => {
  jest.clearAllMocks();
  useGroceryStore.setState({
    lists: [],
    hydrated: true,
    loading: false,
    error: null,
    filter: 'All',
    search: '',
  });
});
test('list and item lifecycle preserves identity when editing', () => {
  const s = useGroceryStore.getState();
  const id = s.createList(' Weekly ');
  s.saveItem(id, input);
  let list = useGroceryStore.getState().lists[0];
  const itemId = list.items[0].id;
  s.toggleItem(id, itemId);
  s.saveItem(id, { ...input, name: 'Pears' }, itemId);
  s.renameList(id, 'Weekend');
  list = useGroceryStore.getState().lists[0];
  expect(list.name).toBe('Weekend');
  expect(list.items[0]).toMatchObject({
    id: itemId,
    name: 'Pears',
    isPurchased: true,
  });
  s.deleteItem(id, itemId);
  expect(useGroceryStore.getState().lists[0].items).toEqual([]);
  s.deleteList(id);
  expect(useGroceryStore.getState().lists).toEqual([]);
});
test('load failure never overwrites saved data', async () => {
  useGroceryStore.setState({ hydrated: false });
  jest.mocked(storageService.load).mockRejectedValueOnce(new Error('offline'));
  await useGroceryStore.getState().hydrate();
  useGroceryStore.getState().createList('No write');
  expect(storageService.save).not.toHaveBeenCalled();
  expect(useGroceryStore.getState().hydrated).toBe(false);
  expect(useGroceryStore.getState().error).toBeTruthy();
});
test('save failure leaves edits in memory and supports retry', async () => {
  jest.mocked(storageService.save).mockRejectedValueOnce(new Error('full'));
  useGroceryStore.getState().createList('Weekly');
  await Promise.resolve();
  await Promise.resolve();
  expect(useGroceryStore.getState().lists).toHaveLength(1);
  expect(useGroceryStore.getState().error).toBeTruthy();
  await useGroceryStore.getState().retrySave();
  expect(useGroceryStore.getState().error).toBeNull();
});
test('hydrates saved data', async () => {
  useGroceryStore.setState({ hydrated: false });
  jest
    .mocked(storageService.load)
    .mockResolvedValueOnce([
      { id: 'a', name: 'Saved', items: [], createdAt: '', updatedAt: '' },
    ]);
  await useGroceryStore.getState().hydrate();
  expect(useGroceryStore.getState().lists[0].name).toBe('Saved');
  expect(useGroceryStore.getState().hydrated).toBe(true);
});
