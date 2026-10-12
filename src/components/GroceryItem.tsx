import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Pencil, Trash2 } from 'lucide-react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { GroceryItem as Item } from '../types';
import { useTheme } from '../theme';
export const GroceryItem = memo(function GroceryItem({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: Item;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (item: Item) => void;
}) {
  const t = useTheme();
  const remove = () => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Delete ${item.name}`}
      onPress={() => onDelete(item)}
      style={{
        backgroundColor: t.danger,
        width: 76,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 9,
      }}
    >
      <Trash2 color="#FFF" size={22} />
    </Pressable>
  );
  return (
    <ReanimatedSwipeable renderRightActions={remove} overshootRight={false}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: t.card,
          borderRadius: 17,
          paddingVertical: 12,
          paddingHorizontal: 10,
          marginBottom: 9,
          borderWidth: 1,
          borderColor: t.border,
        }}
      >
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.isPurchased }}
          accessibilityLabel={`Mark ${item.name} ${
            item.isPurchased ? 'pending' : 'purchased'
          }`}
          onPress={() => {
            ReactNativeHapticFeedback.trigger('selection', {
              enableVibrateFallback: false,
              ignoreAndroidSystemSettings: false,
            });
            onToggle(item.id);
          }}
          style={{
            width: 46,
            height: 46,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 8,
              borderWidth: item.isPurchased ? 0 : 1.5,
              borderColor: t.border,
              backgroundColor: item.isPurchased ? '#16A34A' : t.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.isPurchased && (
              <Check size={17} color="#FFF" strokeWidth={3} />
            )}
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
          onPress={() => onEdit(item.id)}
          style={{ flex: 1, paddingVertical: 5, paddingLeft: 7 }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: item.isPurchased ? t.muted : t.text,
              textDecorationLine: item.isPurchased ? 'line-through' : 'none',
            }}
          >
            {item.name}
          </Text>
          <Text style={{ fontSize: 13, color: t.muted, marginTop: 5 }}>
            {item.quantity} {item.unit}
            {item.price === undefined
              ? ''
              : ` · Price ${item.price.toFixed(2)}`}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
          onPress={() => onEdit(item.id)}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pencil size={16} color={t.muted} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.name}`}
          onPress={() => onDelete(item)}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={16} color={t.muted} />
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
});
