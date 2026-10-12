import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  ArrowUpRight,
  MoreHorizontal,
  ShoppingBasket,
} from 'lucide-react-native';
import { GroceryList } from '../types';
import { useTheme } from '../theme';
import { progress } from '../utils/grocery';
import { ProgressBar } from './ProgressBar';
import { s } from './UI';
export const GroceryCard = memo(function GroceryCard({
  list,
  onPress,
  onMenu,
  index,
}: {
  list: GroceryList;
  onPress: () => void;
  onMenu: () => void;
  index: number;
}) {
  const t = useTheme();
  const p = progress(list.items);
  const colors = ['#EAF3DC', '#F9EDDD', '#E6EFF8', '#EEE7F5'];
  return (
    <View
      style={{
        backgroundColor: t.card,
        borderRadius: 22,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: t.border,
        shadowColor: '#163A20',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.025,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${list.name}, ${p.done} of ${p.total} purchased`}
        onPress={onPress}
        style={({ pressed }) => ({ padding: 20, opacity: pressed ? 0.65 : 1 })}
      >
        <View style={s.between}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: colors[index % colors.length],
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ShoppingBasket size={24} color="#456449" strokeWidth={1.6} />
          </View>
          <ArrowUpRight size={20} color={t.muted} style={{ marginRight: 38 }} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: t.text,
            marginTop: 18,
            letterSpacing: -0.4,
          }}
        >
          {list.name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: t.muted,
            marginTop: 5,
            marginBottom: 20,
          }}
        >
          {p.total} {p.total === 1 ? 'item' : 'items'} ·{' '}
          {p.total === 0
            ? 'Ready for your next shop'
            : p.done === p.total
            ? 'Everything is in the bag!'
            : `${p.total - p.done} left to pick up`}
        </Text>
        <View style={[s.between, { marginBottom: 10 }]}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: t.muted }}>
            SHOPPING PROGRESS
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: t.primary }}>
            {p.percent}%
          </Text>
        </View>
        <ProgressBar percent={p.percent} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Options for ${list.name}`}
        onPress={onMenu}
        style={{
          position: 'absolute',
          right: 10,
          top: 20,
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MoreHorizontal size={22} color={t.muted} />
      </Pressable>
    </View>
  );
});
