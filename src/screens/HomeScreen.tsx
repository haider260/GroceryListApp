import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowUpRight,
  Check,
  Leaf,
  Plus,
  ShoppingBag,
} from 'lucide-react-native';
import { RootStackParamList, GroceryList } from '../types';
import { useTheme } from '../theme';
import { useGroceryStore } from '../store/useGroceryStore';
import { GroceryCard } from '../components/GroceryCard';
import { ListNameModal } from '../components/ListNameModal';
import { EmptyState, s } from '../components/UI';
export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const lists = useGroceryStore(v => v.lists);
  const createList = useGroceryStore(v => v.createList);
  const renameList = useGroceryStore(v => v.renameList);
  const deleteList = useGroceryStore(v => v.deleteList);
  const [dialog, setDialog] = useState<{ list?: GroceryList } | null>(null);
  const pending = useMemo(
    () =>
      lists.reduce(
        (sum, l) => sum + l.items.filter(i => !i.isPurchased).length,
        0,
      ),
    [lists],
  );
  const menu = (list: GroceryList) =>
    Alert.alert(list.name, 'Manage your grocery list', [
      { text: 'Rename list', onPress: () => setDialog({ list }) },
      {
        text: 'Delete list',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Delete this list?',
            `“${list.name}” and all its items will be permanently removed.`,
            [
              { text: 'Keep list', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteList(list.id),
              },
            ],
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  return (
    <SafeAreaView
      style={[s.page, { backgroundColor: t.bg }]}
      edges={['top', 'left', 'right']}
    >
      <FlatList
        data={lists}
        keyExtractor={l => l.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        ListHeaderComponent={
          <>
            <View style={[s.between, { paddingTop: 19, paddingBottom: 33 }]}>
              <View style={[s.row, { gap: 8 }]}>
                <Leaf size={25} color={t.primary} strokeWidth={2.2} />
                <Text
                  style={{
                    fontSize: 23,
                    fontWeight: '800',
                    letterSpacing: -0.8,
                    color: t.text,
                  }}
                >
                  freshlist<Text style={{ color: t.primary }}>.</Text>
                </Text>
              </View>
              <View
                style={[
                  s.row,
                  {
                    gap: 5,
                    backgroundColor: t.soft,
                    paddingHorizontal: 11,
                    paddingVertical: 7,
                    borderRadius: 20,
                  },
                ]}
              >
                <Check size={12} color={t.primary} />
                <Text
                  style={{ fontSize: 10, fontWeight: '700', color: t.primary }}
                >
                  ON YOUR DEVICE
                </Text>
              </View>
            </View>
            <Text style={[s.eyebrow, { color: t.muted, marginBottom: 9 }]}>
              LESS PLANNING. MORE LIVING.
            </Text>
            <Text style={[s.title, { color: t.text }]}>
              A fresh kind of{'\n'}shopping.
            </Text>
            <Text
              style={[
                s.subtitle,
                { color: t.muted, marginTop: 10, marginBottom: 25 },
              ]}
            >
              Welcome back. Let’s get the good stuff.
            </Text>
            <View
              style={{
                backgroundColor: '#173E2B',
                borderRadius: 23,
                padding: 23,
                marginBottom: 30,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: 170,
                  height: 170,
                  borderRadius: 85,
                  borderWidth: 28,
                  borderColor: '#244B36',
                  right: -60,
                  top: -65,
                }}
              />
              <View style={[s.row, { gap: 7, marginBottom: 23 }]}>
                <ShoppingBag size={17} color="#C6EAB4" />
                <Text
                  style={[s.eyebrow, { color: '#C6EAB4', letterSpacing: 1.5 }]}
                >
                  YOUR SHOPPING, SIMPLIFIED
                </Text>
              </View>
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: '700',
                      color: '#FFFFFF',
                      letterSpacing: -1,
                    }}
                  >
                    {String(lists.length).padStart(2, '0')}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: '#BCD0C1', marginTop: 3 }}
                  >
                    Grocery lists
                  </Text>
                </View>
                <View
                  style={{
                    height: 43,
                    width: 1,
                    backgroundColor: '#FFFFFF25',
                    marginRight: 28,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: '700',
                      color: '#FFFFFF',
                      letterSpacing: -1,
                    }}
                  >
                    {String(pending).padStart(2, '0')}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: '#BCD0C1', marginTop: 3 }}
                  >
                    Items to pick up
                  </Text>
                </View>
                <ArrowUpRight size={23} color="#C6EAB4" />
              </View>
            </View>
            <View style={[s.between, { marginBottom: 18 }]}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  letterSpacing: -0.5,
                  color: t.text,
                }}
              >
                My grocery lists
              </Text>
              <View
                style={{
                  backgroundColor: t.border,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 9,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: '700', color: t.muted }}
                >
                  {lists.length}
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <GroceryCard
            list={item}
            index={index}
            onPress={() => navigation.navigate('List', { listId: item.id })}
            onMenu={() => menu(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Good things start with a list"
            description="Your weekly essentials, dinner plans, or a little something for home. Keep it all here."
            action="Make your first list"
            onPress={() => setDialog({})}
          />
        }
        ListFooterComponent={
          lists.length ? (
            <Text
              style={{
                textAlign: 'center',
                color: t.muted,
                fontSize: 12,
                marginTop: 15,
              }}
            >
              A little list. A lighter day.
            </Text>
          ) : undefined
        }
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create grocery list"
        onPress={() => setDialog({})}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 24,
          bottom: Math.max(insets.bottom, 20) + 14,
          width: 62,
          height: 62,
          borderRadius: 22,
          backgroundColor: '#16A34A',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
          shadowColor: '#16A34A',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
      >
        <Plus color="#FFF" size={29} />
      </Pressable>
      <ListNameModal
        visible={dialog !== null}
        initialName={dialog?.list?.name}
        onClose={() => setDialog(null)}
        onSave={name => {
          if (dialog?.list) {
            renameList(dialog.list.id, name);
            setDialog(null);
          } else {
            const id = createList(name);
            setDialog(null);
            navigation.navigate('List', { listId: id });
          }
        }}
      />
    </SafeAreaView>
  );
}
