import LocalizedString from "react-native-localization";

const strings = new LocalizedString({
  en: {
    forgotPasswordTitle: "Reset your password",
    inputPrompt:
      "Enter your PLUGG username or the email address you used to create your account. We’ll email you instructions on how to reset your password.",
    inputPromptLine1: "Enter your PLUGG username or the email address",
    inputPromptLine2: "you used to create your account. We’ll email you",
    inputPromptLine3: "instructions on how to reset your password.",
    sendEmail: "Send email",
    emailOrUsername: "Email or username"
  }
});

export default strings;
