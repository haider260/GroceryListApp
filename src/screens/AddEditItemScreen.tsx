import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ShoppingBasket } from 'lucide-react-native';
import {
  categories,
  Category,
  RootStackParamList,
  Unit,
  units,
} from '../types';
import { useTheme } from '../theme';
import { useGroceryStore } from '../store/useGroceryStore';
import { validateItem } from '../utils/grocery';
import { BackButton, Button, EmptyState, Field, s } from '../components/UI';
import { CategoryChip } from '../components/CategoryChip';
export function AddEditItemScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Item'>) {
  const { listId, itemId } = route.params;
  const t = useTheme();
  const list = useGroceryStore(v => v.lists.find(l => l.id === listId));
  const item = list?.items.find(i => i.id === itemId);
  const saveItem = useGroceryStore(v => v.saveItem);
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1));
  const [unit, setUnit] = useState<Unit>(item?.unit ?? 'pcs');
  const [category, setCategory] = useState<Category>(
    item?.category ?? 'Others',
  );
  const [price, setPrice] = useState(
    item?.price === undefined ? '' : String(item.price),
  );
  const [error, setError] = useState<string | null>(null);
  const save = () => {
    const input = {
      name,
      quantity: Number(quantity.replace(',', '.')),
      unit,
      category,
      price: price.trim() ? Number(price.replace(',', '.')) : undefined,
    };
    const problem = validateItem(input);
    setError(problem);
    if (!problem) {
      saveItem(listId, input, itemId);
      navigation.goBack();
    }
  };
  if (!list || (itemId && !item)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <EmptyState
          title="This item is no longer available"
          description="Go back to your grocery lists."
          action="My lists"
          onPress={() => navigation.popToTop()}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[s.page, { backgroundColor: t.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.between, { paddingVertical: 16 }]}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={[s.eyebrow, { color: t.muted }]}>
              {item ? 'A LITTLE UPDATE' : 'SOMETHING GOOD'}
            </Text>
            <ShoppingBasket size={23} color={t.primary} />
          </View>
          <Text style={[s.title, { color: t.text, marginTop: 16 }]}>
            {item ? 'Edit item' : 'Add to your list'}
          </Text>
          <Text
            style={[
              s.subtitle,
              { color: t.muted, marginTop: 8, marginBottom: 30 },
            ]}
          >
            {list.name} · Every little thing, remembered.
          </Text>
          <Field
            label="Item name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Fresh strawberries"
            maxLength={120}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          <View style={s.row}>
            <View style={{ width: 115, marginRight: 18 }}>
              <Field
                label="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 23, gap: 9 }}>
              <Text style={[s.label, { color: t.text }]}>Unit</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6 }}
              >
                {units.map(u => (
                  <Pressable
                    key={u}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: unit === u }}
                    accessibilityLabel={`Unit ${u}`}
                    onPress={() => setUnit(u)}
                    style={{
                      minHeight: 55,
                      minWidth: 48,
                      paddingHorizontal: 13,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: unit === u ? t.soft : t.field,
                      borderWidth: 1,
                      borderColor: unit === u ? t.primary : t.border,
                      borderRadius: 14,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: unit === u ? t.primary : t.muted,
                      }}
                    >
                      {u}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
          <Text style={[s.label, { color: t.text, marginBottom: 13 }]}>
            Category
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 9,
              marginBottom: 28,
            }}
          >
            {categories.map(c => (
              <CategoryChip
                key={c}
                category={c}
                selected={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
          <Field
            label="Price · optional"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            maxLength={12}
          />
          <Text
            style={{
              fontSize: 12,
              lineHeight: 19,
              color: t.muted,
              marginTop: -12,
              marginBottom: 24,
            }}
          >
            Total price for this item, in your preferred currency.
          </Text>
          {error && (
            <Text
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={{ color: t.danger, marginBottom: 18 }}
            >
              {error}
            </Text>
          )}
          <Button
            title={item ? 'Save changes' : 'Add item'}
            onPress={save}
            icon={<Check size={20} color="#FFF" />}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: t.muted,
              marginTop: 17,
            }}
          >
            Saved on your device. Ready whenever you are.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
