import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: 'com.spotterfitness.gabbyproducts',
  appName: 'Spotter',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '388599372628-1g5qiad0cnjugro0fgcfu6i66jdc0ob0.apps.googleusercontent.com',
      serverClientId: '869230176984-kctu8juhvoac1ahe16rar7h8pils0gv5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  cordova: {
    preferences: {
      AndroidXEnabled: "true",
      GradlePluginKotlinEnabled: "true",
    },
  },
};

export default config;
