# Spotter app

#### versions:
```
- vue: 3.2.21
- ionic/vue: 6.0.0
- capacitor: 4.0.1
- typescript: 4.3.5
```
---------------	
Run ```npm run serve``` within the app directory to see your app in the ```browser```

Run ```npm run ios``` for generate ```ios build```

Run ```npm run android``` generate ```android build```

---------------
**iOS**

> Go to the ios/App folder and run the command
``` pod install ```

---------------
**Android**

>**Update to Gradle 7**
>>Adjust your Gradle project settings in ```File > Project Structure > Project```. The Android Gradle Plugin Version should be 7.2.1 or later and the Gradle Version should be 7.4.2 or later. Apply these changes and run a gradle sync by clicking on the Elephant Icon in the top right of Android Studio

>**Ensure you are using Java 11**
>>Capacitor 4 will only support Java 11. You can change this in your project by going to the following menu in Android Studio:```Preferences > Build, Execution, Deployment > Build Tools > Gradle```
><img src="https://capacitorjs.com/docs/assets/images/android-java-11-3a689fb5f10e972db655982aa0e8c0eb.png" width="500">

---------------
**iOS**
>**@deva-community/capacitor-camera-pro**
>
> npm install may show an error due to @deva-community/capacitor-camera-pro plugin (plugin not tested to work with capacitor 4).
You can perform the installation via npm install -force iOS
>
> Also when creating an iOS build you may see an error appear (target version plugin 12.0), so to successfully create builds you need to
for @deva-community/capacitor-camera-pro plugin: go to file node_modules/@deva-community/capacitor-camera-pro/DevaCommunityCapacitorCameraPro.podspec
And in line ```s.ios.deployment_target = '12.0'``` change version to ```'13.0'```
---------------
>**capacitor-blob-writer**
> 
> The same needs to be done for capacitor-blob-writer plugin: go to node_modules/capacitor-blob-writer/CapacitorBlobWriter.podspec
And in line ```s.ios.deployment_target = '12.0'``` change the version to ```'13.0'```
>
> Check the platform iOS version in the file: node_modules/capacitor-blob-writer/ios/Podfile
```platform :ios, '13.0'```
---------------
>**capacitor-google-auth**
> 
> The same needs to be done for capacitor-google-auth plugin: go to node_modules/@codetrix-studio/capacitor-google-auth/CodetrixStudioCapacitorGoogleAuth.podspec
And in line ```s.ios.deployment_target = '12.0'``` change the version to ```'13.0'```
>

---------------

**Android**
>**@deva-community/capacitor-camera-pro** && **capacitor-blob-writer**
>
> Also for @deva-community/capacitor-camera-pro and capacitor-blob-writer plugins there may be problems with android builds
> For the capacitor-blob-writer plugin:
>
> node_modules/capacitor-blob-writer/android/build.gradle:
> - 1 comment out the lines with the jcenter() method and specify mavenCentral()
> - 2 check that ```gradle version``` was ```7.2.1``` in the line: ```'com.android.tools.build:gradle:7.2.1'```
> - 3 for the parameters: 
>  - ```compileSdkVersion``` specify version ```32```
>  - ```minSdkVersion``` specify version ```22```
>  - ```targetSdkVersion``` specify version ```32```
>
> **@deva-community/capacitor-camera-pro**
> 
> for @deva-community/capacitor-camera-pro plugin: go to node_modules/@deva-community/capacitor-camera-pro/android/build.gradle:
> - 1 check the versions: 
>  - ```junitVersion``` : ```'4.13.2' ```
>  - ```androidxAppCompatVersion``` : ```'1.2.0' ```
>  - ```androidxEspressoCoreVersion``` : ```'3.4.0'```
>  - ```androidxExifInterfaceVersion``` : ```'1.3.2'```
>  - ```androidxJunitVersion``` : ```'1.1.3'```
>  - ```androidxMaterialVersion``` : ```'1.3.0'```
> - 2 comment out the lines with the jcenter() method and specify mavenCentral()
> - 3 check that ```gradle version``` was ```7.2.1``` in the line: ```'com.android.tools.build:gradle:7.2.1'```
> - 4 for the parameters:
>  - ```compileSdkVersion``` specify version ```32```
>  - ```minSdkVersion``` specify version ```22```
>  - ```targetSdkVersion``` specify version ```32```
