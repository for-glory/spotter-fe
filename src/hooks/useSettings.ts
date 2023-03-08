import { ProfileSettings } from "@/ts/enums/user";

export function useSettings() {
  const userSettings = localStorage.getItem(ProfileSettings.UserSettings);

  if (userSettings && userSettings !== "null") {
    const {
      isOnboardingDone,
      isRoleSelected,
      isQuizzDone,
      isAddressSelected,
      isIdentityVerified,
      isFacilitySetUp,
    } = JSON.parse(userSettings);

    return {
      isOnboardingDone,
      isRoleSelected,
      isQuizzDone,
      isAddressSelected,
      isIdentityVerified,
      isFacilitySetUp,
    };
  } else {
    return {
      isOnboardingDone: false,
    };
  }
}

export function getSettings(settings: string) {
  localStorage.setItem(ProfileSettings.UserSettings, settings);
}

export function setSettings(settings: any[]) {
  const userSettings = JSON.parse(
    localStorage.getItem(ProfileSettings.UserSettings) || "{}"
  );

  settings.map((option) => {
    userSettings[Object.keys(option)[0]] = option[Object.keys(option)[0]];
  });

  localStorage.setItem(
    ProfileSettings.UserSettings,
    JSON.stringify(userSettings)
  );
}
