import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LanguageService from './LanguageService';
import { Picker } from '@react-native-picker/picker';
import { getMessagesByLanguage } from './TextTranslations';
import RNRestart from 'react-native-restart';

export default function Settings() {
    const [apiKey, setApiKey] = useState('');
    const nav = useNavigation();

    const languages = LanguageService.getLanguages();
    const [language, setLanguage] = useState(''); // Initialize language to the first in the list or to an empty string

    const changeLanguage = async () => {
        try {
            await AsyncStorage.setItem('@language', language);
            Alert.alert('Language updated successfully');
            RNRestart.Restart();
        } catch (error) {
            Alert.alert('Error updating language', error.message);
        }
    };

    useEffect(() => {
        const getApiKey = async () => {
            const storedApiKey = await AsyncStorage.getItem('@openAIKey');
            if (storedApiKey) setApiKey(storedApiKey);
        };

        getApiKey();
    }, []);

    const handleSaveApiKey = async () => {
        await AsyncStorage.setItem('@openAIKey', apiKey);
        Alert.alert('API Key has been updated');
        nav.goBack();
    };

    const handleDeleteApiKey = async () => {
        await AsyncStorage.removeItem('@openAIKey');
        Alert.alert('API Key has been deleted');
        nav.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    const translations = getMessagesByLanguage(language);
    const saveAPITitle = translations.saveKey;
    const deleteAPITitle = translations.delKey;
    const changeLanguageTitle = translations.change;

    return (
        <View style={styles.container}>
            <Picker selectedValue={language} onValueChange={(itemValue) => setLanguage(itemValue)} style={styles.picker}>
                {languages.map((language, index) => (
                    <Picker.Item key={index} label={language} value={language} color="#fff" />
                ))}
            </Picker>
            <Button color="#00a2ff" title={translations.change} onPress={changeLanguage} />
            <Text style={styles.text}>{translations.updateKey}</Text>
            <TextInput style={styles.input} onChangeText={setApiKey} />
            <Button color="#00a2ff" title={saveAPITitle} onPress={handleSaveApiKey} />
            <Button color="#ff0000" title={deleteAPITitle} onPress={handleDeleteApiKey} />
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
});