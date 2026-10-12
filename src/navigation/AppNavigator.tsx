import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { GroceryListScreen } from '../screens/GroceryListScreen';
import { AddEditItemScreen } from '../screens/AddEditItemScreen';
import { useTheme } from '../theme';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator() {
  const t = useTheme();
  const base = t.isDark ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer
      theme={{
        ...base,
        colors: {
          ...base.colors,
          background: t.bg,
          card: t.card,
          text: t.text,
          primary: t.primary,
          border: t.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.bg },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="List" component={GroceryListScreen} />
        <Stack.Screen
          name="Item"
          component={AddEditItemScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
