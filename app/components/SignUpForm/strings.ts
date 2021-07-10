import LocalizedStrings from "react-native-localization";

const strings = new LocalizedStrings({
  en: {
    emailPrompt: "What’s your email?",
    emailSubText: "You’ll need to confirm this email later.",
    signUpScreenTitle: "Create account",
    emailRequired: "An email address is required.",
    emailAddress: "Email address",
    nextButtonText: "Next",
    password: "Password",
    passwordPrompt: "Create a password",
    passwordDetailText: "Use at least 8 characters.",
    nameRequired: "Both first and last name are required.",
    showPassword: "Show",
    hidePassword: "Hide"
  }
});

export default strings;
