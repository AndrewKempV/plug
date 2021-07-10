import CreditCardInput from "./CreditCardInput";
import { StringUnion } from "../../utils/helpers";
import { Card } from "../../api/profile/api";
import { PaymentItem } from "../SavedPaymentList/SavedPaymentList";

export const Issuer = StringUnion(
  "cvc",
  "cvc_amex",
  "american-express",
  "diners-club",
  "mastercard",
  "discover",
  "jcb",
  "visa",
  "placeholder"
);

export type Issuer = typeof Issuer.type;

export interface CreditCardFields {
  number: string;
  cvc: string;
  expiry: string;
  name: string;
  postalCode: string;
  issuer: string;
}

export const CreditCardFieldType = StringUnion(
  "issuer",
  "cvc",
  "expiry",
  "name",
  "postalCode",
  "number"
);

export type CreditCardFieldType = typeof CreditCardFieldType.type;

export type EditableCreditCardFieldType = Exclude<
  CreditCardFieldType,
  "issuer"
>;

export interface CreditCardCVC {
  name: string;
  size: number;
}

export interface CreditCardSearchDescriptor {
  issuerDisplayName: string;
  issuer: string;
  patterns: (number | number[])[];
  gaps: number[];
  lengths: number[];
  code: CreditCardCVC;
}

export type CreditCardSearchResult = CreditCardSearchDescriptor &
  Partial<{ matchStrength: number }>;

export interface VerificationResult {
  isValid: boolean;
  isPotentiallyValid: boolean;
}

export type CreditCardVerificationResult = VerificationResult &
  Partial<{ card: CreditCardSearchDescriptor }>;

export type ExpirationDateVerificationResult = VerificationResult &
  Partial<{
    month: string;
    year: string;
  }>;

export const ValidationStatus = StringUnion("incomplete", "valid", "invalid");

export type ValidationStatus = typeof ValidationStatus.type;

export type FormFieldStatus = Pick<
  {
    number: ValidationStatus;
    expiry: ValidationStatus;
    cvc: ValidationStatus;
    name: ValidationStatus;
    postalCode: ValidationStatus;
    issuer: ValidationStatus;
  },
  CreditCardFieldType
>;

export type FormFieldValues = Pick<
  {
    issuer: string;
    number: string;
    expiry: string;
    cvc: string;
    name: string;
    postalCode: string;
  },
  CreditCardFieldType
>;

export type FormFieldPlaceholders = Pick<
  {
    issuer: string;
    number: string;
    expiry: string;
    cvc: string;
    name: string;
    postalCode: string;
  },
  CreditCardFieldType
>;

export type FormFieldInputs = Pick<
  {
    number: CreditCardInput;
    expiry: CreditCardInput;
    cvc: CreditCardInput;
    name: CreditCardInput;
    postalCode: CreditCardInput;
  },
  EditableCreditCardFieldType
>;

export type FieldTransition = {
  [x in CreditCardFieldType]: string;
};

export const Brand = StringUnion(
  "American Express",
  "Diners Club",
  "Discover",
  "JCB",
  "MasterCard",
  "UnionPay",
  "Visa",
  "Unknown"
);
export type Brand = typeof Brand.type;

export const issuerFromBrand = (brand: Brand): Issuer => {
  switch (brand) {
    case "American Express":
      return "american-express";
    case "Diners Club":
      return "diners-club";
    case "Discover":
      return "discover";
    case "JCB":
      return "jcb";
    case "MasterCard":
      return "mastercard";
    case "Visa":
      return "visa";
    case "Unknown":
      return "placeholder";
    default:
      return "placeholder";
  }
};

export const createPaymentItemFromCard = (
  card: Card,
  defaultPaymentId?: string
): PaymentItem | null => {
  const { brand, last4, id } = card;
  if (last4 && brand && id && Brand.guard(brand)) {
    const issuer = issuerFromBrand(brand);
    return {
      id,
      last4,
      issuer,
      default: id === defaultPaymentId
    };
  }
  return null;
};
