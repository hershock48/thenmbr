// Main App Navigator for NMBR Mobile App

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import StoriesScreen from '../screens/stories/StoriesScreen';
import RevenueScreen from '../screens/revenue/RevenueScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Types
import { User, Organization } from '../types';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

interface AppNavigatorProps {
  user: User | null;
  organization: Organization | null;
}

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Marketplace':
              iconName = 'store';
              break;
            case 'Community':
              iconName = 'people';
              break;
            case 'Stories':
              iconName = 'article';
              break;
            case 'Revenue':
              iconName = 'trending-up';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{ title: 'Marketplace' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Stories" 
        component={StoriesScreen}
        options={{ title: 'Stories' }}
      />
      <Tab.Screen 
        name="Revenue" 
        component={RevenueScreen}
        options={{ title: 'Revenue' }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#ffffff',
        },
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#64748b',
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ 
          title: 'NMBR Platform',
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC<AppNavigatorProps> = ({ user, organization }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Authenticated user - show main app
          <Stack.Screen 
            name="MainApp" 
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Not authenticated - show auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                title: 'Welcome to NMBR',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                title: 'Create Account',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
