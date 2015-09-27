rem cordova plugin rm org.apache.cordova.console

cd "platforms\android\build\outputs\apk"
del android-release-unsigned.apk
del JavaQApp.apk
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore abcsmobileapps.keystore -storepass Public@123 android-release-unsigned.apk abcsmobileapps
zipalign -v 4 android-release-unsigned.apk JavaQApp.apk
