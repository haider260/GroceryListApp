module.exports = {
  preset: '@react-native/jest-preset',
  transform: { '^.+\\.(js|jsx|mjs|ts|tsx)$': 'babel-jest' },
  transformIgnorePatterns: [
    'node_modules/(?!((@)?react-native|@react-native(-community)?|lucide-react-native)/)',
  ],
};
