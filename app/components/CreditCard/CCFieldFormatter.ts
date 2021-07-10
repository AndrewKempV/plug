import { pick } from "lodash";
import { removeLeadingSpaces, removeNonNumber } from "../../utils/helpers";
import { verifyCreditCardNumber } from "./CreditCardHelper";
import {
  CreditCardFields,
  CreditCardFieldType,
  CreditCardSearchDescriptor,
  EditableCreditCardFieldType,
  FormFieldValues,
  Issuer
} from "./types";

const limitLength = (text: string = "", maxLength: number) =>
  text.substr(0, maxLength);

const addGaps = (text: string = "", gaps: number[]) => {
  const offsets = [0].concat(gaps).concat([text.length]);
  return offsets
    .map((end, index) => {
      if (index === 0) {
        return "";
      }
      const start = offsets[index - 1];
      return text.substr(start, end - start);
    })
    .filter(part => part !== "")
    .join(" ");
};

const FALLBACK_CARD = {
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    size: 3
  }
};

export default class CCFieldFormatter {
  public displayedFields: CreditCardFieldType[];

  constructor(displayedFields: EditableCreditCardFieldType[]) {
    this.displayedFields = [...displayedFields, "issuer"];
  }

  public formatValues = (values: CreditCardFields): FormFieldValues => {
    const card =
      verifyCreditCardNumber(values.number.replace(" ", ""), { maxLength: 16 })
        .card || (FALLBACK_CARD as CreditCardSearchDescriptor);
    return pick(
      {
        issuer: card.issuer,
        number: this.formatNumber(values.number, card),
        expiry: this.formatExpiry(values.expiry),
        cvc: this.formatCVC(values.cvc, card),
        name: removeLeadingSpaces(values.name),
        postalCode: this.formatPostalCode(values.postalCode)
      },
      this.displayedFields
    );
  };

  public formatNumber = (num: string, card: CreditCardSearchDescriptor) => {
    const numberSanitized = removeNonNumber(num);
    const maxLength = card.lengths[card.lengths.length - 1];
    const lengthSanitized = limitLength(numberSanitized, maxLength);
    const formatted = addGaps(lengthSanitized, card.gaps);
    return formatted;
  };

  public formatExpiry = (expiry: string) => {
    const sanitized = limitLength(removeNonNumber(expiry), 4);
    if (sanitized.match(/^[2-9]$/)) {
      return `0${sanitized}`;
    }
    if (sanitized.length > 2) {
      return `${sanitized.substr(0, 2)}/${sanitized.substr(
        2,
        sanitized.length
      )}`;
    }
    return sanitized;
  };

  public formatCVC = (cvc: string, card: CreditCardSearchDescriptor) => {
    const maxCVCLength = card.code.size;
    return limitLength(removeNonNumber(cvc), maxCVCLength);
  };

  public formatPostalCode = (postal: string) => {
    const sanitized = limitLength(removeNonNumber(postal), 9);
    return sanitized.length < 6
      ? sanitized
      : `${sanitized.substr(0, 5)}-${sanitized.substr(5, sanitized.length)}`;
  };
}
