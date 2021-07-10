import LocalizedStrings from "react-native-localization";

const strings = new LocalizedStrings({
  en: {
    nameTooltip:
      "Add the name as it appears on your card to make it easy to identify.",
    cvvTooltip:
      "The cvv code is the three digits printed on the back of your card.",
    saveLabel: "Save",
    addCardActionLabel: "Adding Your Card…",
    addCardActionSubLabel: "It might take a few seconds.",
    cardAddedLabel: "Card Added",
    cardAddedSubLabel: "Your card has been successfully added."
  }
});

export default strings;
