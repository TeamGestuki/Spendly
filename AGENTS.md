# Spendly (front-end)

Expo SDK 54 · React Native 0.81.5 · React 19.1 · JavaScript (no TypeScript)

## Commands

Run everything from `front-end/`:

```sh
pnpm start        # Expo dev server
pnpm web          # Expo dev server → web target
pnpm ios          # Expo dev server → iOS simulator
pnpm android      # Expo dev server → Android emulator
```

No lint, typecheck, formatter, or test infrastructure exists.

## Structure

- `front-end/index.js` — app entry, delegates to `registerRootComponent(App)`
- `front-end/App.js` — React Navigation stack container (native-stack), screens `Login` | `Register`
- `front-end/src/screens/` — each screen is a self-contained JS file with inline `StyleSheet`

## Conventions

- UI language: Spanish (strings, comments, navigation labels)
- Dark fintech palette (green accent `#4ADE80`, bg `#0D0F14`). Color constants are duplicated across every screen — **do not add a third copy**; extract shared constants to a module instead.
- Backend calls are simulated (`setTimeout` stubs). No real API integration yet.
- Navigation: `@react-navigation/native-stack` with `headerShown: false`. Screens receive `{ navigation }` prop.
- Avoid Expo Router — this project uses imperative `navigation.navigate()`.
- Package manager: **pnpm** (lockfile `front-end/pnpm-lock.yaml`).

## Gotchas

- When reading Expo docs, use the **Expo SDK 54** versioned docs: https://docs.expo.dev/versions/v54.0.0/
- `Ionicons` and `MaterialCommunityIcons` are from `@expo/vector-icons` (no separate install needed).
