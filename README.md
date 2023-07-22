Building the APK
To build an APK for Android, you'll need to generate a signing key and then set up gradle variables.

Generating a signing key
You can generate a private signing key using keytool. Here is how to do it:

Open the Terminal.
Change the directory to the location where you want to store your key.
Once you’re in the directory, run the following command:
sh
Copy code
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
This command prompts you for passwords for the keystore and key, and to provide the Distinguished Name fields for your key.

Setting up gradle variables
Place the my-upload-key.keystore file under the android/app directory in your project folder.

Edit the android/gradle.properties or ~/.gradle/gradle.properties and add the following lines:

properties
Copy code
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
Replace ***** with your actual passwords.

Adding signing config to your app's gradle config
Edit the android/app/build.gradle file in your project folder, and add the signing config:
gradle
Copy code
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
Generating the release APK
Run the following in a terminal:

sh
Copy code
cd android
./gradlew assembleRelease
The generated APK can be found under android/app/build/outputs/apk/release/app-release.apk.

Uploading to Google Play
To upload the APK to Google Play:

Go to the Google Play Console.
Select your app.
On the left menu, click on "Release management", then "App releases".
Click on "MANAGE PRODUCTION" then "CREATE RELEASE".
Under "APKs to add", click on "BROWSE FILES", and upload your app-release.apk file.
Fill out the rest of the form as instructed.
Click on "Review", then "Start rollout to production".