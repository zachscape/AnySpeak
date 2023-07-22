import axios from 'axios';

class TranslatorService {
  static async transcribeAudio(filePath, language1, language2, openAIKey) {
    const url = `https://api.openai.com/v1/audio/transcriptions`;

    const file = {
      uri: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
      name: 'input.wav',
      type: 'audio/wav',
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1'); // Adding the model parameter

    const config = {
      headers: {
        'Authorization': 'Bearer ' + openAIKey,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post(url, formData, config);

    const transcribedText = response.data.text;
    console.log('transcribeaudio', response.data);
    return transcribedText;
  }


  static async translateText(transcribedText, language1, language2, openAIKey) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `This text is either in ${language1} or ${language2}, if it is ${language1}, translate it to ${language2} and vice-versa. Please don't add any clarifying text, only include the translated text in your response: "${transcribedText}"` }
      ],
      temperature: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"]
    }, {
      headers: {
        'Authorization': 'Bearer ' + openAIKey,
        'Content-Type': 'application/json'
      },
    });

    const translatedText = response.data.choices[0].message.content.trim();
    return translatedText;
  }
}

export default TranslatorService;
