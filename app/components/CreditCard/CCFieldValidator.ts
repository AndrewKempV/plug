import _, { every, pick, values } from "lodash";
import { removeNonNumber } from "../../utils/helpers";
import { Verify } from "./CreditCardHelper";
import {
  CreditCardFields,
  CreditCardFieldType,
  ValidationStatus,
  VerificationResult
} from "./types";

export default class CCFieldValidator {
  public displayedFields: CreditCardFieldType[] = [];

  constructor(displayedFields: CreditCardFieldType[]) {
    this.displayedFields = displayedFields;
  }

  public validateValues = (formValues: CreditCardFields) => {
    const numberValidation = Verify.number(formValues.number);
    const expiryValidation = Verify.expiry(formValues.expiry);
    const maxCVCLength = (numberValidation.card || FALLBACK_CARD).code.size;
    const cvcValidation = Verify.cvv(formValues.cvc, maxCVCLength);
    const postalValidation = this.validatePostalCode(formValues.postalCode);

    const validationStatuses = pick(
      {
        number: getStatus(numberValidation),
        expiry: getStatus(expiryValidation),
        cvc: getStatus(cvcValidation),
        name: formValues.name ? "valid" : ("incomplete" as ValidationStatus),
        postalCode: postalValidation,
        issuer: "valid" as ValidationStatus
      },
      this.displayedFields
    );

    return {
      valid: every(values(validationStatuses), status => status === "valid"),
      status: validationStatuses
    };
  };

  private validatePostalCode = (postalCode: string): ValidationStatus => {
    const sanitized = removeNonNumber(postalCode);
    return sanitized.match(/^[0-9]{5}([- /]?[0-9]{4})?$/)
      ? "valid"
      : sanitized.length !== 5 && sanitized.length !== 9
      ? "incomplete"
      : "invalid";
  };
}

const getStatus = (validation: VerificationResult): ValidationStatus => {
  return validation.isValid
    ? "valid"
    : validation.isPotentiallyValid
    ? "incomplete"
    : "invalid";
};

const FALLBACK_CARD = {
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    size: 3
  }
};
