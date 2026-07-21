import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminUserDetailScreen from '../screens/admin/AdminUserDetailScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminReportDetailScreen from '../screens/admin/AdminReportDetailScreen';
import AdminToolsScreen from '../screens/admin/AdminToolsScreen';
import AdminActivityScreen from '../screens/admin/AdminActivityScreen';

const AdminStack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <AdminStack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#0D0F14',
        },
      }}
    >
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ gestureEnabled: false }}
      />

      <AdminStack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
      />

      <AdminStack.Screen
        name="AdminUserDetail"
        component={AdminUserDetailScreen}
      />

      <AdminStack.Screen
        name="AdminReports"
        component={AdminReportsScreen}
      />

      <AdminStack.Screen
        name="AdminReportDetail"
        component={AdminReportDetailScreen}
      />

      <AdminStack.Screen
        name="AdminTools"
        component={AdminToolsScreen}
      />

      <AdminStack.Screen
        name="AdminActivity"
        component={AdminActivityScreen}
      />
    </AdminStack.Navigator>
  );
}
