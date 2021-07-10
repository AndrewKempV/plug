import LocalizedString from "react-native-localization";

const strings = new LocalizedString({
  en: {
    notificationInfoA: "We’ve sent an email to you at  ",
    notificationInfoB: ". It has instructions ",
    notificationInfoC: "on how to reset your PLUGG password.",
    callToAction: "Check your mail",
    screenTitle: "You’ve got mail!",
    sendEmail: "Send Email"
  }
});

export default strings;
