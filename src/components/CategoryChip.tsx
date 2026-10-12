import React from 'react';
import { Pressable, Text } from 'react-native';
import { Category } from '../types';
import { categoryMeta } from '../constants/categories';
import { useTheme } from '../theme';
export function CategoryChip({
  category,
  selected,
  onPress,
}: {
  category: Category;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  const meta = categoryMeta[category];
  const Icon = meta.icon;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 13,
        borderWidth: 1.5,
        borderColor: selected ? t.primary : t.border,
        backgroundColor: selected ? t.soft : t.card,
      }}
    >
      <Icon size={18} color={selected ? t.primary : meta.color} />
      <Text
        style={{
          color: selected ? t.primary : t.text,
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {category}
      </Text>
    </Pressable>
  );
}
