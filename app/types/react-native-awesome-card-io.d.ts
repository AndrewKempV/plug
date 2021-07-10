declare module "react-native-awesome-card-io" {
  interface ScanConfig {
    detectionMode: "AUTOMATIC";
  }

  export interface CreditCard {
    /** Localized card type. */
    cardType: string;
    cardNumber: string;
    /** Card number with all but the last four digits obfuscated. */
    redactedCardNumber: string;
    /** Expiry month with january as 1 (may be 0 if expiry information was not requested). */
    expiryMonth: number;
    /** Expiry year (may be 0 if expiry information was not requested). */
    expiryYear: number;
    /** Security code. */
    cvv: string;
    /** Postal code. Format is country dependent. */
    postalCode: string;
    /**  (iOS only) - Was the card number scanned (as opposed to entered manually)? */
    scanned: boolean;
    /** Card holder name */
    cardholderName: string;
  }

  interface CardIOModule {
    scanCard: ({ detectionMode }: ScanConfig) => CreditCard;
  }

  interface CardIOUtilities {
    preload: () => void;
  }

  export const CardIOModule: CardIOModule;
  export const CardIOUtilities: CardIOUtilities;
}
