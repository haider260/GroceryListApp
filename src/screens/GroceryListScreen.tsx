import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SectionList,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreHorizontal, Plus, Search, Share2, X } from 'lucide-react-native';
import {
  categories,
  Filter,
  GroceryItem as Item,
  RootStackParamList,
} from '../types';
import { useTheme } from '../theme';
import { useGroceryStore } from '../store/useGroceryStore';
import { progress, selectItems, shareText } from '../utils/grocery';
import { categoryMeta } from '../constants/categories';
import {
  BackButton,
  Button,
  EmptyState,
  IconButton,
  s,
} from '../components/UI';
import { ProgressBar } from '../components/ProgressBar';
import { GroceryItem } from '../components/GroceryItem';
import { ListNameModal } from '../components/ListNameModal';
export function GroceryListScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'List'>) {
  const { listId } = route.params;
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const list = useGroceryStore(v => v.lists.find(l => l.id === listId));
  const filter = useGroceryStore(v => v.filter);
  const search = useGroceryStore(v => v.search);
  const setFilter = useGroceryStore(v => v.setFilter);
  const setSearch = useGroceryStore(v => v.setSearch);
  const toggleItem = useGroceryStore(v => v.toggleItem);
  const deleteItem = useGroceryStore(v => v.deleteItem);
  const renameList = useGroceryStore(v => v.renameList);
  const deleteList = useGroceryStore(v => v.deleteList);
  const [rename, setRename] = useState(false);
  useEffect(() => {
    setFilter('All');
    setSearch('');
  }, [listId, setFilter, setSearch]);
  const sections = useMemo(() => {
    const items = selectItems(list?.items ?? [], filter, search);
    return categories
      .map(category => ({
        title: category,
        data: items.filter(i => i.category === category),
      }))
      .filter(section => section.data.length);
  }, [list, filter, search]);
  const handleToggle = useCallback(
    (itemId: string) => toggleItem(listId, itemId),
    [listId, toggleItem],
  );
  const handleEdit = useCallback(
    (itemId: string) => navigation.navigate('Item', { listId, itemId }),
    [listId, navigation],
  );
  const handleDelete = useCallback(
    (item: Item) =>
      Alert.alert('Remove item?', `Remove “${item.name}” from this list?`, [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteItem(listId, item.id),
        },
      ]),
    [listId, deleteItem],
  );
  if (!list) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <EmptyState
          title="List no longer exists"
          description="Head back to your lists to start a new one."
          action="My lists"
          onPress={() => navigation.popToTop()}
        />
      </SafeAreaView>
    );
  }
  const p = progress(list.items);
  const add = () => navigation.navigate('Item', { listId });
  const menu = () =>
    Alert.alert(list.name, 'Make this list yours', [
      { text: 'Rename', onPress: () => setRename(true) },
      {
        text: 'Delete list',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Delete this list?',
            'This permanently removes the list and all its items.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  deleteList(listId);
                  navigation.popToTop();
                },
              },
            ],
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[s.page, { backgroundColor: t.bg }]}
    >
      <SectionList
        sections={sections}
        keyExtractor={i => i.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={[s.between, { paddingVertical: 16 }]}>
              <BackButton onPress={() => navigation.goBack()} />
              <Text
                style={[
                  s.eyebrow,
                  {
                    color: t.muted,
                    flexShrink: 1,
                    textAlign: 'center',
                    marginHorizontal: 8,
                  },
                ]}
              >
                YOUR GROCERY LIST
              </Text>
              <View style={[s.row, { gap: 6 }]}>
                <IconButton
                  label="Share grocery list"
                  onPress={() => {
                    Share.share({ message: shareText(list) }).catch(() =>
                      Alert.alert('Could not share', 'Please try again.'),
                    );
                  }}
                >
                  <Share2 size={19} color={t.text} />
                </IconButton>
                <IconButton label="List options" onPress={menu}>
                  <MoreHorizontal size={22} color={t.text} />
                </IconButton>
              </View>
            </View>
            <Text style={[s.title, { color: t.text, marginTop: 14 }]}>
              {list.name}
            </Text>
            <Text
              style={[
                s.subtitle,
                { color: t.muted, marginTop: 8, marginBottom: 25 },
              ]}
            >
              {p.total === 0
                ? 'Your next great shop starts here.'
                : p.done === p.total
                ? 'All done. Enjoy the good stuff!'
                : 'One check closer to a stocked kitchen.'}
            </Text>
            <View
              style={{
                padding: 22,
                backgroundColor: t.soft,
                borderRadius: 22,
                marginBottom: 25,
              }}
            >
              <View style={[s.between, { marginBottom: 20 }]}>
                <View>
                  <Text
                    style={[s.eyebrow, { color: t.primary, letterSpacing: 1 }]}
                  >
                    IN THE BAG
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: '800',
                      color: t.text,
                      marginTop: 8,
                    }}
                  >
                    {p.done}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: t.muted,
                      }}
                    >
                      {' '}
                      / {p.total} items
                    </Text>
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '800',
                    color: t.primary,
                    letterSpacing: -1,
                  }}
                >
                  {p.percent}%
                </Text>
              </View>
              <ProgressBar percent={p.percent} />
            </View>
            <View
              style={[
                s.row,
                {
                  backgroundColor: t.card,
                  borderRadius: 15,
                  paddingLeft: 15,
                  borderWidth: 1,
                  borderColor: t.border,
                },
              ]}
            >
              <Search size={19} color={t.muted} />
              <TextInput
                accessibilityLabel="Search grocery items"
                value={search}
                onChangeText={setSearch}
                placeholder="Find an item…"
                placeholderTextColor={t.muted}
                style={{
                  flex: 1,
                  minHeight: 51,
                  paddingHorizontal: 12,
                  fontSize: 15,
                  color: t.text,
                }}
              />
              {search.length > 0 && (
                <IconButton label="Clear search" onPress={() => setSearch('')}>
                  <X size={17} color={t.muted} />
                </IconButton>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: t.field,
                borderRadius: 13,
                padding: 4,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              {(['All', 'Pending', 'Purchased'] as Filter[]).map(f => (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected: filter === f }}
                  key={f}
                  onPress={() => setFilter(f)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 11,
                    borderRadius: 10,
                    backgroundColor: f === filter ? t.card : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: f === filter ? t.primary : t.muted,
                    }}
                  >
                    {f}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        }
        renderSectionHeader={({ section }) => {
          const meta = categoryMeta[section.title];
          const Icon = meta.icon;
          return (
            <View
              style={[s.row, { gap: 9, paddingTop: 20, paddingBottom: 12 }]}
            >
              <View
                style={{
                  backgroundColor: meta.background,
                  padding: 7,
                  borderRadius: 10,
                }}
              >
                <Icon size={16} color={meta.color} />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: '700',
                  color: t.text,
                }}
              >
                {section.title}
              </Text>
              <Text style={{ fontSize: 12, color: t.muted }}>
                {section.data.length}
              </Text>
            </View>
          );
        }}
        renderItem={({ item }) => (
          <GroceryItem
            item={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={
              list.items.length
                ? 'Nothing here just yet'
                : 'What’s on your list?'
            }
            description={
              list.items.length
                ? 'Try another filter or search for something else.'
                : 'Add the essentials, the treats, and everything in between.'
            }
            action={list.items.length ? 'Reset filters' : 'Add your first item'}
            onPress={
              list.items.length
                ? () => {
                    setSearch('');
                    setFilter('All');
                  }
                : add
            }
          />
        }
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          backgroundColor: t.bg,
        }}
      >
        <Button
          title="Add item"
          onPress={add}
          icon={<Plus size={20} color="#FFF" />}
        />
      </View>
      <ListNameModal
        visible={rename}
        initialName={list.name}
        onClose={() => setRename(false)}
        onSave={name => {
          renameList(listId, name);
          setRename(false);
        }}
      />
    </SafeAreaView>
  );
}
