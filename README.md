# README for AnySpeak

## Features
- Easily speak to anyone in 50 languages
- Input your language at first-time setup, then select their language
and hit SPEAK. No changing directions, one simple tap per conversation piece.
- Detects input voice language then speaks in the other language
while displaying each line in both languages in text-message style.
Currently limited to 5 second voice inputs.
- Your OpenAi API key is saved locally to your phone, but not
anywhere else.
- Get your OpenAi API key here: https://openai.com/blog/openai-api
- If your device gets compromised for some nonrelated reason, be
sure to disable your api key in OpenAi, and generate a new one in
case the perpetrator stole your key. Update your key in the app by tapping the cogwheel in the top right.

<a href='https://play.google.com/store/apps/details?id=com.anyspeak'>Download on Google Play</a>

Android and IOS manual build instructions

## Prerequisites
- Node.js
- npm
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Git

## Download & Extract Repo

# Android

## Build the Android APK 
1. Run the following command to install all the required node modules in the root directory
```npm install```
2. Run the following command to start the Metro Bundler.
```
npx react-native start
```
3. Open a new terminal window and navigate to the same directory.
4. Run the following command to build the APK.
```
npx react-native run-android
```
5. Once the build is successful, the app will be automatically installed on the emulator. Building is required. You can use the emulator or your phone.

## Move the App on Android Phone
1. Connect your Android device to your computer.
2. Copy the APK file from the `android/app/build/outputs/apk/debug` directory in your project folder.
3. Paste the APK file anywhere in your Android device.
4. On your Android device, navigate to the location of the APK file.
5. Tap on the APK file and install the app.

# IOS Instructions (Must build manually, for now, to keep AnySpeak completely free)

## Build the App
1. Navigate to the iOS directory in your project folder.
```
cd ios
```
2. Install the required CocoaPods.
```
pod install
```
3. Return to the main project directory.
```
cd ..
```
4. Run the following command to start the Metro Bundler.
```
npx react-native start
```
5. Open a new terminal window and navigate to your project directory.
6. Run the following command to build the app.
```
npx react-native run-ios
```
7. Once the build is successful, the app will be automatically installed on the iOS simulator. Building is required. You can use the emulator or your phone.

## Move the App on iOS Phone
1. Open Xcode and navigate to Window > Devices and Simulators.
2. Connect your iOS device to your computer.
3. Select your device from the list and click on the '+' button under 'Installed Apps'.
4. Navigate to the location of your `.app` file in the `ios/build/Build/Products/Debug-iphonesimulator` directory in
your project folder.
5. Select the `.app` file and click on 'Open'.
6. The app will be installed on your iOS device.
