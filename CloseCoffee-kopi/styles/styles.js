// anton
import { StyleSheet } from 'react-native';

export const colors = {
  background: '#d7c0ae',
  cardBackground: '#f4ede3',
  accent: '#c8ad90',
  primaryText: '#4a2f21',
  secondaryText: '#6f5241',
  mutedText: '#8b6f5a',
  inputBackground: '#fff9f2',
  placeholderText: 'rgba(74, 47, 33, 0.5)',
};

export const spacings = {
  screenHorizontal: 20,
  screenTop: 10,
  section: 24,
  cardPadding: 20,
  inputVertical: 12,
};

// Fælles layout
export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacings.screenHorizontal,
    paddingTop: spacings.screenTop,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: spacings.cardPadding,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
});

// Fælles typografi
export const text = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: '700', color: colors.primaryText, marginBottom: 20 },
  h2: { fontSize: 20, fontWeight: '700', color: colors.primaryText, marginBottom: 16 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.primaryText, marginBottom: 6 },
  body: { fontSize: 16, color: colors.secondaryText },
  bodySmall: { fontSize: 14, color: colors.secondaryText },
  small: { fontSize: 13, color: colors.mutedText },
});

// Fælles formular
export const form = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: spacings.inputVertical,
    fontSize: 16,
    color: colors.primaryText,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const shadows = StyleSheet.create({
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
});

// Skærme: kun små forskelle
export const home = StyleSheet.create({
  name: { marginBottom: 4 },
  address: { marginBottom: 6 },
});

export const favorites = StyleSheet.create({
  inputCard: { marginBottom: spacings.section },
  nameInput: { marginBottom: 12 },
  placeholder: { textAlign: 'center', marginTop: 40, lineHeight: 24 },
});