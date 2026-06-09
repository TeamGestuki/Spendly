/**
 * App.js
 * Punto de entrada de Spendly, define la navegación entre pantallas usando React Navigation.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen    from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen     from './src/screens/HomeScreen';
import ProfileScreen  from './src/screens/ProfileScreen'; // ← nueva

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0D0F14' },
        }}
      >
        {/* Auth */}
        <Stack.Screen name="Login"    component={LoginScreen}    />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* App — gestureEnabled: false evita volver al flujo de auth */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Perfil — accesible desde el bottom nav de Home */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}