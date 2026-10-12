import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTheme } from './src/theme';
import { useGroceryStore } from './src/store/useGroceryStore';
import { Button, EmptyState } from './src/components/UI';
function Application() {
  const theme = useTheme();
  const hydrated = useGroceryStore(s => s.hydrated);
  const loading = useGroceryStore(s => s.loading);
  const error = useGroceryStore(s => s.error);
  const hydrate = useGroceryStore(s => s.hydrate);
  const retrySave = useGroceryStore(s => s.retrySave);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      {!hydrated ? (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          {loading || !error ? (
            <ActivityIndicator
              accessibilityLabel="Loading grocery lists"
              size="large"
              color={theme.primary}
            />
          ) : (
            <EmptyState
              title="Let’s get your lists back"
              description={error}
              action="Retry"
              onPress={() => {
                void hydrate();
              }}
            />
          )}
        </SafeAreaView>
      ) : (
        <>
          <AppNavigator />
          {error && (
            <SafeAreaView
              edges={['bottom']}
              style={{ padding: 16, backgroundColor: theme.card }}
            >
              <Text
                accessibilityRole="alert"
                style={{ color: theme.danger, marginBottom: 8 }}
              >
                {error}
              </Text>
              <Button
                title="Retry saving"
                secondary
                onPress={() => {
                  void retrySave();
                }}
              />
            </SafeAreaView>
          )}
        </>
      )}
    </View>
  );
}
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Application />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
