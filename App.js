import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './Welcome';
import Settings from './Settings';
import Chat from './Chat';
import LanguageSelection from './LanguageSelection';
import { getMessagesByLanguage } from './TextTranslations';

const Stack = createStackNavigator();

export default function App() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    (async () => {
      const apiKey = await AsyncStorage.getItem('@openAIKey');
      if (apiKey) {
        setHasApiKey(true);
      }
      const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    })();
  }, []);

  const translations = getMessagesByLanguage(language);
  const getScreenName = (screenName) => {
    if (translations[screenName]) {
      return translations[screenName];
    }
    return screenName;
  };
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Welcome" component={Welcome} options={{
          title: translations.welcomeTitle
        }} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} options={{
          title: translations.languageSelectionTitle
        }} />
        <Stack.Screen name="Chat" component={Chat} options={{
          title: translations.chatTitle
        }} />
        <Stack.Screen name="Settings" component={Settings} options={{
          title: translations.settings
        }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
