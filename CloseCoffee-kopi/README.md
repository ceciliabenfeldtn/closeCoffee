## Kom godt i gang

### Forudsætninger

- Node.js 18 eller nyere og npm (følger med Node).
- En Android-emulator, iOS-simulator eller Expo Go-appen på en fysisk enhed til test.

### Installation

```bash
npm install

npx expo start

### Kodestrukur
.
├── App.js              # Rodkomponent der opsætter bottom tab navigation
├── app.json            # Expo projektkonfiguration
├── assets/             # App-ikoner og splash-billeder
├── components/         # Fælles UI-komponenter
├── screens/            # Skærmkomponenter der vises i hver tab
├── styles/             # Fælles styles (farver, layout, typografi)
├── index.js            # Expo entry point
├── package.json        # Afhængigheder og npm scripts
└── README.md

Fejlfinding
	•	Hvis Metro bundleren ikke starter, så sørg for at køre den nyeste Expo-version ved at køre npm install expo@^54.x.x.
	•	Seneste version pr. 23. september: 54.0.10