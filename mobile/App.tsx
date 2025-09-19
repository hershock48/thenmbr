// Main App Component for NMBR Mobile App

import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './src/navigation/AppNavigator';
import { User, Organization } from './src/types';
import { Colors } from './src/constants/Colors';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data from AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      const orgData = await AsyncStorage.getItem('organization_data');

      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (orgData) {
        setOrganization(JSON.parse(orgData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.primary}
        />
        <AppNavigator user={user} organization={organization} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
