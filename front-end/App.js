import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('access_token');

      if (token) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Login');
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0D0F14',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0D0F14' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />

        <Stack.Screen
            name="Expenses"
            component={ExpensesScreen}
            options={{ gestureEnabled: false }}
        />

        <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
        />

        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />

        {/* Rutas simuladas temporalmente */}
        <Stack.Screen name="ChangePassword" component={HomeScreen} />
        <Stack.Screen name="SecuritySettings" component={HomeScreen} />
        <Stack.Screen name="CurrencySettings" component={HomeScreen} />
        <Stack.Screen name="LanguageSettings" component={HomeScreen} />
        <Stack.Screen name="NotificationSettings" component={HomeScreen} />
        <Stack.Screen name="ExportData" component={HomeScreen} />
        <Stack.Screen name="HelpCenter" component={HomeScreen} />
        <Stack.Screen name="ReportProblem" component={HomeScreen} />
        <Stack.Screen name="AboutSpendly" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}