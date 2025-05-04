import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import Navigation from './src/Navigation';

export default function App(): JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadFonts = async (): Promise<void> => {
      await Font.loadAsync({
        ...Ionicons.font,
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ba8b" />
      </View>
    );
  }

  return <Navigation />;
}
