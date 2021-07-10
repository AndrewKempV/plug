import LocalizedStrings from "react-native-localization";

const strings = new LocalizedStrings({
  en: {
    screenTitle: "Edit Profile",
    doneButton: "Done",
    privateDetailsTitle: "Private Details",
    firstNameInputPlaceholder: "First name",
    lastNameInputPlaceholder: "Last name",
    usernameInputPlaceholder: "Username",
    bioInputPlaceholder: "Bio",
    websiteInputPlaceholder: "Website",
    genderInputPlaceholder: "Gender",
    phoneInputPlaceholder: "Phone",
    modalTitle: "You have unsaved changes",
    modalSubTitle: "If you leave now, you will loose your changes.",
    saveChangesLabel: "Save Changes",
    leaveLabel: "Leave"
  }
});

export default strings;
