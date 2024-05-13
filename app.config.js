import { withPlugins } from "@expo/config-plugins";

import {
  withAndroidExpoSSEPatch,
  withAndroidReactNativeSSEPatch,
} from "./plugins";

const baseConfig = {
  name: "expo-dev-fetch-delay-repro",
  slug: "expo-dev-fetch-delay-repro",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.vetted.expodevfetchdelayrepro",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "3af5099a-d77f-4ed8-a2c0-44bee2a185aa",
    },
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          // allow connecting to local http server while in release mode.
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
};

export default function setupConfig({ config }) {
  const expoConfig = {
    ...config,
    ...baseConfig,
  };

  if (process.env.SSE_NO_FIX === "true") {
    return expoConfig;
  }

  withPlugins(expoConfig, [
    withAndroidReactNativeSSEPatch,
    withAndroidExpoSSEPatch,
  ]);

  return expoConfig;
}
