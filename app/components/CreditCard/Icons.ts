import _ from "lodash";
import { ImageSourcePropType } from "react-native";
import { Issuer } from "./types";
import Images from "../../assets/images";

type CreditCardIcons = Pick<
  {
    cvc: ImageSourcePropType;
    cvc_amex: ImageSourcePropType;
    "american-express": ImageSourcePropType;
    "diners-club": ImageSourcePropType;
    mastercard: ImageSourcePropType;
    discover: ImageSourcePropType;
    jcb: ImageSourcePropType;
    placeholder: ImageSourcePropType;
    visa: ImageSourcePropType;
  },
  Issuer
>;

const Icons: CreditCardIcons = {
  cvc: require("./icons/stp_card_cvc.png") as ImageSourcePropType,
  cvc_amex: require("./icons/stp_card_cvc_amex.png") as ImageSourcePropType,
  "american-express": Images.amex,
  "diners-club": require("./icons/stp_card_diners.png") as ImageSourcePropType,
  mastercard: Images.mastercard,
  discover: require("./icons/stp_card_discover.png") as ImageSourcePropType,
  jcb: require("./icons/stp_card_jcb.png") as ImageSourcePropType,
  placeholder: require("./icons/stp_card_unknown.png") as ImageSourcePropType,
  visa: require("./icons/stp_card_visa.png") as ImageSourcePropType
};

export const getIcon = (issuer: string): ImageSourcePropType => {
  if (Issuer.guard(issuer)) {
    return Icons[issuer];
  }
  return Icons["placeholder"];
};

export default Icons;
