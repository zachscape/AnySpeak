import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, StyleSheet, DeviceEventEmitter, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import gearImage from './gear.jpg';
import TranslatorService from './TranslatorService';
import { getMessagesByLanguage } from './TextTranslations'; 

const audioRecorderPlayer = new AudioRecorderPlayer();
const path = `${RNFS.CachesDirectoryPath}/input.wav`;

const Chat = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [language1, setLanguage1] = useState('');
    const [language2, setLanguage2] = useState('');
    const [openAIKey, setOpenAIKey] = useState('');
    const nav = useNavigation();

    useEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={goToSettings} style={{ marginRight: 10 }}>
                    <Image
                        source={gearImage}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            ),
        });
        const fetchAsyncStorage = async () => {
            const storedKey = await AsyncStorage.getItem('@openAIKey');
            const storedLanguage1 = await AsyncStorage.getItem('@language');
            const storedLanguage2 = await AsyncStorage.getItem('@theirLanguage');

          console.log(`Chat.js: Stored values retrieved: openAIKey=${storedKey}, language1=${storedLanguage1}, language2=${storedLanguage2}`);
            if (storedKey) setOpenAIKey(storedKey);
            if (storedLanguage1) setLanguage1(storedLanguage1);
            if (storedLanguage2) setLanguage2(storedLanguage2);
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

        checkApiKey();

        const ttsFinishEventListener = DeviceEventEmitter.addListener('tts-finish', async event => {
            // This will be executed when TTS finishes
            try {
                await RNFS.unlink(path);
                console.log('File deleted successfully');
            } catch (error) {
                console.log('File deletion error: ', error);
            }
        });

        fetchAsyncStorage();

        return () => {
            ttsFinishEventListener.remove(); // Clean up the event listener
        };
    }, [nav]);

    const goToSettings = () => {
        nav.navigate('Settings');
    };

    const startListening = async () => {
        const checkPermissions = async () => {
            const microphonePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            return microphonePermission;
        };

        const permissionsGranted = await checkPermissions();

        if (!permissionsGranted) {
            console.log('Microphone permission not granted');
            return;
        }

        setIsRecording(true);
        // Create file before starting the recorder
        await RNFS.writeFile(path, '', 'utf8');
        try {
            const result = await audioRecorderPlayer.startRecorder(path);
            console.log('startRecorder', result);
            setTimeout(() => {
                stopListening();
            }, 5000);
        } catch (e) {
            console.log('Start listening error: ', e);
        }
    };

    const handleSpeechEnd = async () => {
        try {
            const transcribedText = await TranslatorService.transcribeAudio(path, language1, language2, openAIKey);
            const translatedText = await TranslatorService.translateText(transcribedText, language1, language2, openAIKey);
    
            const sourceLanguage = transcribedText === translatedText ? language2 : language1;
            const targetLanguage = transcribedText === translatedText ? language1 : language2;
    
            setConversation(prevConversation => [
                ...prevConversation,
                {
                    label: `${sourceLanguage} Speaker`,
                    messages: [
                        { label: `${sourceLanguage}: `, text: transcribedText },
                        { label: `${targetLanguage}: `, text: translatedText }
                    ]
                }
            ]);
    
            let ttsLanguage = targetLanguage;
    
            if (targetLanguage.toLowerCase() === 'mandarin chinese') {
              ttsLanguage = 'zh-CN';
            } else if (targetLanguage.toLowerCase() === 'english') {
              ttsLanguage = 'en-US';
            } else if (targetLanguage.toLowerCase() === 'hindi') {
              ttsLanguage = 'hi-IN';
            } else if (targetLanguage.toLowerCase() === 'spanish') {
              ttsLanguage = 'es-ES';
            } else if (targetLanguage.toLowerCase() === 'french') {
              ttsLanguage = 'fr-FR';
            } else if (targetLanguage.toLowerCase() === 'standard arabic') {
              ttsLanguage = 'ar-SA';
            } else if (targetLanguage.toLowerCase() === 'bengali') {
              ttsLanguage = 'bn-BD';
            } else if (targetLanguage.toLowerCase() === 'russian') {
              ttsLanguage = 'ru-RU';
            } else if (targetLanguage.toLowerCase() === 'portuguese') {
              ttsLanguage = 'pt-BR';
            } else if (targetLanguage.toLowerCase() === 'indonesian') {
              ttsLanguage = 'id-ID';
            } else if (targetLanguage.toLowerCase() === 'urdu') {
              ttsLanguage = 'ur-PK';
            } else if (targetLanguage.toLowerCase() === 'german') {
              ttsLanguage = 'de-DE';
            } else if (targetLanguage.toLowerCase() === 'japanese') {
              ttsLanguage = 'ja-JP';
            } else if (targetLanguage.toLowerCase() === 'swahili') {
              ttsLanguage = 'sw-KE';
            } else if (targetLanguage.toLowerCase() === 'marathi') {
              ttsLanguage = 'mr-IN';
            } else if (targetLanguage.toLowerCase() === 'telugu') {
              ttsLanguage = 'te-IN';
            } else if (targetLanguage.toLowerCase() === 'turkish') {
              ttsLanguage = 'tr-TR';
            } else if (targetLanguage.toLowerCase() === 'tamil') {
              ttsLanguage = 'ta-IN';
            } else if (targetLanguage.toLowerCase() === 'vietnamese') {
              ttsLanguage = 'vi-VN';
            } else if (targetLanguage.toLowerCase() === 'korean') {
              ttsLanguage = 'ko-KR';
            } else if (targetLanguage.toLowerCase() === 'italian') {
              ttsLanguage = 'it-IT';
            } else if (targetLanguage.toLowerCase() === 'yoruba') {
              ttsLanguage = 'yo-NG';
            } else if (targetLanguage.toLowerCase() === 'cantonese') {
              ttsLanguage = 'yue-HK';
            } else if (targetLanguage.toLowerCase() === 'thai') {
              ttsLanguage = 'th-TH';
            } else if (targetLanguage.toLowerCase() === 'gujarati') {
              ttsLanguage = 'gu-IN';
            } else if (targetLanguage.toLowerCase() === 'javanese') {
              ttsLanguage = 'jv-ID';
            } else if (targetLanguage.toLowerCase() === 'iranian persian') {
              ttsLanguage = 'fa-IR';
            } else if (targetLanguage.toLowerCase() === 'polish') {
              ttsLanguage = 'pl-PL';
            } else if (targetLanguage.toLowerCase() === 'pashto') {
              ttsLanguage = 'ps-AF';
            } else if (targetLanguage.toLowerCase() === 'kannada') {
              ttsLanguage = 'kn-IN';
            } else if (targetLanguage.toLowerCase() === 'xiang chinese') {
              ttsLanguage = 'hsn-CN';
            } else if (targetLanguage.toLowerCase() === 'malayalam') {
              ttsLanguage = 'ml-IN';
            } else if (targetLanguage.toLowerCase() === 'sundanese') {
              ttsLanguage = 'su-ID';
            } else if (targetLanguage.toLowerCase() === 'dutch') {
              ttsLanguage = 'nl-NL';
            } else if (targetLanguage.toLowerCase() === 'nepali') {
              ttsLanguage = 'ne-NP';
            } else if (targetLanguage.toLowerCase() === 'sindhi') {
              ttsLanguage = 'sd-IN';
            } else if (targetLanguage.toLowerCase() === 'romanian') {
              ttsLanguage = 'ro-RO';
            } else if (targetLanguage.toLowerCase() === 'sinhala') {
              ttsLanguage = 'si-LK';
            } else if (targetLanguage.toLowerCase() === 'hausa') {
              ttsLanguage = 'ha-NG';
            } else if (targetLanguage.toLowerCase() === 'burmese') {
              ttsLanguage = 'my-MM';
            } else if (targetLanguage.toLowerCase() === 'filipino') {
              ttsLanguage = 'fil-PH';
            } else if (targetLanguage.toLowerCase() === 'ukrainian') {
              ttsLanguage = 'uk-UA';
            } else if (targetLanguage.toLowerCase() === 'amharic') {
              ttsLanguage = 'am-ET';
            } else if (targetLanguage.toLowerCase() === 'farsi') {
              ttsLanguage = 'fa-IR';
            } else if (targetLanguage.toLowerCase() === 'oromo') {
              ttsLanguage = 'om-ET';
            } else if (targetLanguage.toLowerCase() === 'maithili') {
              ttsLanguage = 'mai-IN';
            } else if (targetLanguage.toLowerCase() === 'uzbek') {
              ttsLanguage = 'uz-UZ';
            } else if (targetLanguage.toLowerCase() === 'sudanese arabic') {
              ttsLanguage = 'apd-SD';
            } else if (targetLanguage.toLowerCase() === 'azerbaijani') {
              ttsLanguage = 'az-AZ';
            } else if (targetLanguage.toLowerCase() === 'gan chinese') {
              ttsLanguage = 'gan-CN';
            } else if (targetLanguage.toLowerCase() === 'cebuano') {
              ttsLanguage = 'ceb-PH';
            }
    
            const voices = await Tts.voices();
            const supportedLanguages = voices.map(voice => voice.language);
    
            if (supportedLanguages.includes(ttsLanguage)) {
                await Tts.setDefaultLanguage(ttsLanguage);
            } else {
                console.log(`TTS language ${ttsLanguage} is not supported, defaulting to English`);
                await Tts.setDefaultLanguage('en');
            }
    
            Tts.speak(translatedText);
    
        } catch (e) {
            if (e.response) {
                console.log(e.response.data);
                console.log(e.response.status);
                console.log(e.response.headers);
            } else if (e.request) {
                console.log(e.request);
            } else {
                console.log('Error', e.message);
            }
            console.log('Full error: ', e);
        }
    };
    


    const stopListening = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            setIsRecording(false);
            console.log('stopRecorder', result);
            handleSpeechEnd();
        } catch (e) {
            console.log('Stop listening error: ', e);
        }
    };

    const endConversation = async () => {
        if (!isRecording) return;
        try {
            setIsRecording(false);
        } catch (e) {
            console.log('End conversation error: ', e);
        }
    };

    const translations = getMessagesByLanguage(language1);

    return (
        <View style={styles.container}>
            <FlatList
                data={conversation.reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={[styles.messageContainer, { backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#2c2c2c' }]}>
                        <Text style={styles.text}>{item.messages[0].label}{item.messages[0].text}</Text>
                        <Text style={styles.text}>{item.messages[1].label}{item.messages[1].text}</Text>
                    </View>
                )}
                inverted
            />
            <View style={styles.speakButtonContainer}>
                <Button
                    color="#00a2ff"
                    title={isRecording ? '..' : translations.speak}
                    onPress={isRecording ? endConversation : startListening}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 10,
        justifyContent: 'flex-end',
    },
    text: {
        color: '#fff',
        marginBottom: 10,
    },
    speakButtonContainer: {
        width: '100%',
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
});

export default Chat;