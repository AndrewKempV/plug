import Images from "../../assets/images";
export type SocialIdentityProviderType =
  | "Google"
  | "Facebook"
  | "Twitter"
  | "Instagram";

/**
 * List of social icon properties for buttons on the sign up and login screens.
 */
export const SocialIcons = [
  {
    source: Images.facebookLogo,
    type: "Facebook"
  },
  {
    source: Images.googleLogo,
    type: "Google"
  },
  {
    source: Images.twitterLogo,
    type: "Twitter"
  },
  {
    source: Images.instagramLogo,
    type: "Instagram"
  }
];
