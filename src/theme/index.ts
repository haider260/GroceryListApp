import { useColorScheme } from 'react-native';
export const light = {
  bg: '#F7F9F5',
  card: '#FFFFFF',
  text: '#172B20',
  muted: '#748077',
  border: '#E5EBE4',
  primary: '#16A34A',
  soft: '#EAF6EB',
  danger: '#C44949',
  field: '#F2F5F0',
};
export const dark: typeof light = {
  bg: '#111A15',
  card: '#1D2921',
  text: '#F1F7F0',
  muted: '#A0B0A3',
  border: '#314236',
  primary: '#4ADE80',
  soft: '#233E2B',
  danger: '#FF9292',
  field: '#26332A',
};
export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return { ...(isDark ? dark : light), isDark };
}
