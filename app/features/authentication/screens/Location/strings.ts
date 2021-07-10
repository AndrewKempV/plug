import LocalizedString from "react-native-localization";

const strings = new LocalizedString({
  en: {
    screenTitle: "Pick a city",
    headerTitle: `Let's show you...`,
    headerSubtitle: `what's happening around you.`,
    currentLocation: "Use my current location",
    suggestedLocations: "Suggested locations",
    foundLocations: "Found locations",
    inputPlaceholder: "Where?"
  }
});

export default strings;
