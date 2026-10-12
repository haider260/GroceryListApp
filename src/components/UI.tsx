import React, { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { ArrowLeft, Plus, ShoppingBasket } from 'lucide-react-native';
import { useTheme } from '../theme';
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: secondary ? t.soft : '#16A34A',
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        },
      ]}
    >
      {icon}
      <Text
        style={[s.buttonText, { color: secondary ? t.primary : '#FFFFFF' }]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        s.iconButton,
        { backgroundColor: t.card, opacity: pressed ? 0.5 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}
export function BackButton({ onPress }: { onPress: () => void }) {
  const t = useTheme();
  return (
    <IconButton label="Go back" onPress={onPress}>
      <ArrowLeft size={22} color={t.text} />
    </IconButton>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const t = useTheme();
  return (
    <View style={s.fieldWrap}>
      <Text style={[s.label, { color: t.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={t.muted}
        {...props}
        style={[
          s.input,
          { backgroundColor: t.field, color: t.text, borderColor: t.border },
          props.style,
        ]}
      />
    </View>
  );
}
export function EmptyState({
  title,
  description,
  action,
  onPress,
}: {
  title: string;
  description: string;
  action?: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <View style={s.empty}>
      <View style={[s.emptyIcon, { backgroundColor: t.soft }]}>
        <ShoppingBasket size={42} strokeWidth={1.5} color={t.primary} />
      </View>
      <Text style={[s.emptyTitle, { color: t.text }]}>{title}</Text>
      <Text style={[s.emptyDescription, { color: t.muted }]}>
        {description}
      </Text>
      {action && onPress ? (
        <Button
          title={action}
          onPress={onPress}
          icon={<Plus size={19} color="#FFF" />}
        />
      ) : null}
    </View>
  );
}
export const s = StyleSheet.create({
  page: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 110 },
  row: { flexDirection: 'row', alignItems: 'center' },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1.2 },
  subtitle: { fontSize: 15, lineHeight: 23 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  button: {
    minHeight: 54,
    borderRadius: 17,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldWrap: { gap: 9, marginBottom: 23 },
  label: { fontSize: 14, fontWeight: '700' },
  input: {
    minHeight: 55,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 42,
    paddingHorizontal: 20,
    gap: 15,
  },
  emptyIcon: {
    width: 94,
    height: 94,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 8,
  },
});
