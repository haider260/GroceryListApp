import React from 'react';
import { Button } from '../src/components/UI';
import { Text, TextInput } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AddEditItemScreen } from '../src/screens/AddEditItemScreen';
import { useGroceryStore } from '../src/store/useGroceryStore';
jest.mock('../src/services/storageService', () => ({
  storageService: {
    load: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});
test('item form rejects empty names and saves valid items', async () => {
  useGroceryStore.setState({ lists: [], hydrated: true });
  const id = useGroceryStore.getState().createList('Weekly');
  const navigation = { goBack: jest.fn() };
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <AddEditItemScreen
        route={{ params: { listId: id } } as any}
        navigation={navigation as any}
      />,
    );
  });
  const save = () => renderer.root.findByType(Button);
  await act(async () => {
    save().props.onPress();
  });
  expect(navigation.goBack).not.toHaveBeenCalled();
  expect(
    renderer.root
      .findAllByType(Text)
      .some(t => t.props.children === 'Give your item a name.'),
  ).toBe(true);
  await act(async () => {
    renderer.root
      .findAllByType(TextInput)
      .find(p => p.props.accessibilityLabel === 'Item name')!
      .props.onChangeText('Bananas');
  });
  await act(async () => {
    save().props.onPress();
  });
  expect(useGroceryStore.getState().lists[0].items[0].name).toBe('Bananas');
  expect(navigation.goBack).toHaveBeenCalled();
  await act(async () => renderer.unmount());
});
