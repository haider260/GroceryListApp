import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { Button, Field, IconButton, s } from './UI';
export function ListNameModal({
  visible,
  initialName = '',
  onClose,
  onSave,
}: {
  visible: boolean;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const t = useTheme();
  const [name, setName] = useState(initialName);
  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#071A1480',
        }}
      >
        <Pressable
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: t.card,
            borderRadius: 25,
            padding: 24,
            gap: 18,
          }}
        >
          <View style={s.between}>
            <Text style={{ fontSize: 23, fontWeight: '800', color: t.text }}>
              {initialName ? 'Rename list' : 'A fresh start'}
            </Text>
            <IconButton label="Close" onPress={onClose}>
              <X size={21} color={t.muted} />
            </IconButton>
          </View>
          <Text style={{ color: t.muted, lineHeight: 22 }}>
            A little planning makes shopping easier.
          </Text>
          <Field
            label="List name"
            value={name}
            onChangeText={setName}
            maxLength={80}
            autoFocus
            placeholder="e.g. Weekly groceries"
            returnKeyType="done"
            onSubmitEditing={() => {
              if (name.trim()) {
                onSave(name.trim());
              }
            }}
          />
          <Button
            title={initialName ? 'Save changes' : 'Create list'}
            disabled={!name.trim()}
            onPress={() => onSave(name.trim())}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
