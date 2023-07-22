import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  PermissionsAndroid,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageService from './LanguageService';
import { useNavigation } from '@react-navigation/native';
import { getMessagesByLanguage } from './TextTranslations';

export default function Welcome({ navigation }) {
  const languages = LanguageService.getLanguages();
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('');
  const nav = useNavigation();
  console.log(`Welcome.js: Languages: ${JSON.stringify(languages)}`); // check if languages array is valid
  console.log(`Welcome.js: Current Language: ${language}`); 
  useEffect(() => {
    const storeDefaultLanguage = async () => {
      if (language && language !== "Select your language") {
        await AsyncStorage.setItem('@language', language);
        console.log(`Welcome.js: Default language stored: ${language}`);
      }
    };
  
    const getStoredData = async () => {
      const storedApiKey = await AsyncStorage.getItem('@openAIKey');
      const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedApiKey && storedLanguage) {
        navigation.replace('LanguageSelection');
      } else {
        getStoredLanguage();
      }
    };
  
    const getStoredLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
        console.log(`Welcome.js: Stored language retrieved: ${storedLanguage}`);
      }
    };
  
    storeDefaultLanguage();
    getStoredData();
  }, [language, apiKey, navigation]);


  const requestPermissions = async () => {
    try {
      const grantedMicrophone = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'AnySpeak needs access to your microphone to record audio for translation.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );

      if (grantedMicrophone === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Microphone permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const saveApiKeyAndNavigate = async () => {
    // Check if language is selected
    if (language === "Select your language") {
      Alert.alert(
        'Language Required',
        'Please select your language.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
      return;
    }

    const permissionsGranted = await requestPermissions();
    if (permissionsGranted) {
      await AsyncStorage.setItem('@openAIKey', apiKey);
      console.log(`Welcome.js: API Key saved: ${apiKey}`); // check if values are saved correctly
      navigation.replace('LanguageSelection');
    } else {
      Alert.alert(
        'Permission required',
        'AnySpeak needs access to your microphone to record audio for translation.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };


  const translations = getMessagesByLanguage(language);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{translations.welcome}</Text>
      <TextInput style={styles.input} onChangeText={text => setApiKey(text)} value={apiKey} />
      <Text style={styles.text}>{translations.selectLanguage}</Text>
      <Picker selectedValue={language} onValueChange={async (value) => {
        console.log(`Welcome.js: Picker value changed to: ${value}`); // Check if Picker value is changed
        setLanguage(value);
        await AsyncStorage.setItem('@language', value);
        console.log(`Welcome.js: Language saved: ${value}`);
      }} style={styles.picker}>
        {languages.map((lang, index) => (
          <Picker.Item key={index} label={lang} value={lang} color="#fff" />
        ))}
      </Picker>
      <Button color="#00a2ff" onPress={saveApiKeyAndNavigate} title='Next' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    color: '#fff',
  },
  picker: {
    color: '#fff',
    marginBottom: 30,
  },
});