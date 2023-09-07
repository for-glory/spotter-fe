import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.spotterfitness.gabbymobileapp",
  appName: "Spotter",
  webDir: "dist",
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
      scopes: ["profile", "email"],
      clientId:
        "212274388127-do3mri75u9m54m0110b551tt3t1mlfci.apps.googleusercontent.com",
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
