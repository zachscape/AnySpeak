import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LanguageService from './LanguageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import gearImage from './gear.jpg';
import { getMessagesByLanguage } from './TextTranslations';

export default function LanguageSelection({ navigation }) {
  const [theirLanguage, setTheirLanguage] = useState('');
  const [language, setLanguage] = useState('english');
  const languages = LanguageService.getLanguages();
  const nav = useNavigation();

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('@theirLanguage');
      if (storedLanguage) {
        setTheirLanguage(storedLanguage);
      }
    };

    const checkApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('@openAIKey');
      if (!storedApiKey) {
        nav.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    };
    const getStoredLanguage = async () => {
    const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSettingsClick} style={{ marginRight: 10 }}>
          <Image
            source={gearImage}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      ),
    });

    fetchLanguage();
    checkApiKey();
    getStoredLanguage();
  }, [nav]);

  const handleSettingsClick = () => {
    navigation.navigate('Settings');
  };
  const translations = getMessagesByLanguage(language); 
  const handleLanguageSelection = async () => {
    if (theirLanguage === '') {
      Alert.alert(translations.selectTheirLanguage);
      return;
    }

    await AsyncStorage.setItem('@theirLanguage', theirLanguage);

    navigation.navigate('Chat', { theirLanguage });
  };

  

  return (
    <View style={styles.container}>
      <Text>{translations.selectTheirLanguage}</Text>
      <Picker selectedValue={theirLanguage} onValueChange={setTheirLanguage} style={styles.picker}>
        {languages.map((language, index) => (
          <Picker.Item key={index} label={language} value={language} color="#fff" />
        ))}
      </Picker>
      <Button color="#00a2ff" title={translations.chatTitle} onPress={handleLanguageSelection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  text: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
  },
});
