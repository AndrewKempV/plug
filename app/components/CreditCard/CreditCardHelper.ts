import _, { isArray } from "lodash";
import {
  CreditCardSearchDescriptor,
  CreditCardSearchResult,
  CreditCardVerificationResult,
  ExpirationDateVerificationResult,
  VerificationResult
} from "./types";

export const cardSearchDescriptors: CreditCardSearchDescriptor[] = [
  {
    issuerDisplayName: "Visa",
    issuer: "visa",
    patterns: [4],
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
      name: "CVV",
      size: 3
    }
  },
  {
    issuerDisplayName: "Mastercard",
    issuer: "mastercard",
    patterns: [[51, 55], [2221, 2229], [223, 229], [23, 26], [270, 271], 2720],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVC",
      size: 3
    }
  },
  {
    issuerDisplayName: "American Express",
    issuer: "american-express",
    patterns: [34, 37],
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: "CID",
      size: 4
    }
  },
  {
    issuerDisplayName: "Diners Club",
    issuer: "diners-club",
    patterns: [[300, 305], 36, 38, 39],
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: {
      name: "CVV",
      size: 3
    }
  },
  {
    issuerDisplayName: "Discover",
    issuer: "discover",
    patterns: [6011, [644, 649], 65],
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: {
      name: "CID",
      size: 3
    }
  },
  {
    issuerDisplayName: "JCB",
    issuer: "jcb",
    patterns: [2131, 1800, [3528, 3589]],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: "CVV",
      size: 3
    }
  },
  {
    issuerDisplayName: "UnionPay",
    issuer: "unionpay",
    patterns: [
      620,
      [624, 626],
      [62100, 62182],
      [62184, 62187],
      [62185, 62197],
      [62200, 62205],
      [622010, 622999],
      622018,
      [622019, 622999],
      [62207, 62209],
      [622126, 622925],
      [623, 626],
      6270,
      6272,
      6276,
      [627700, 627779],
      [627781, 627799],
      [6282, 6289],
      6291,
      6292
    ],
    gaps: [4, 8, 12],
    lengths: [14, 15, 16, 17, 18, 19],
    code: {
      name: "CVN",
      size: 3
    }
  },
  {
    issuerDisplayName: "Maestro",
    issuer: "maestro",
    patterns: [493698, [500000, 506698], [506779, 508999], [56, 59], 63, 67, 6],
    gaps: [4, 8, 12],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: {
      name: "CVC",
      size: 3
    }
  },
  {
    issuerDisplayName: "Elo",
    issuer: "elo",
    patterns: [
      401178,
      401179,
      438935,
      457631,
      457632,
      431274,
      451416,
      457393,
      504175,
      [506699, 506778],
      [509000, 509999],
      627780,
      636297,
      636368,
      [650031, 650033],
      [650035, 650051],
      [650405, 650439],
      [650485, 650538],
      [650541, 650598],
      [650700, 650718],
      [650720, 650727],
      [650901, 650978],
      [651652, 651679],
      [655000, 655019],
      [655021, 655058]
    ],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVE",
      size: 3
    }
  },
  {
    issuerDisplayName: "Mir",
    issuer: "mir",
    patterns: [[2200, 2204]],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: "CVP2",
      size: 3
    }
  },
  {
    issuerDisplayName: "Hiper",
    issuer: "hiper",
    patterns: [637095, 637568, 637599, 637609, 637612],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVC",
      size: 3
    }
  },
  {
    issuerDisplayName: "Hipercard",
    issuer: "hipercard",
    patterns: [606282],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: "CVC",
      size: 3
    }
  }
];

function hasEnoughResultsToDetermineBestMatch(
  results: CreditCardSearchResult[]
) {
  const numberOfResultsWithMaxStrengthProperty = results.filter(
    (result: CreditCardSearchResult) => {
      return result.matchStrength;
    }
  ).length;

  // if all possible results have a maxStrength property
  // that means the card number is sufficiently long
  // enough to determine conclusively what the type is
  return (
    numberOfResultsWithMaxStrengthProperty > 0 &&
    numberOfResultsWithMaxStrengthProperty === results.length
  );
}

function findBestMatch(results: CreditCardSearchResult[]) {
  if (!hasEnoughResultsToDetermineBestMatch(results)) {
    return;
  }

  return results.reduce((bestMatch, result) => {
    // eslint-disable-line consistent-return
    if (!bestMatch) {
      return result;
    }

    // if the current best match pattern is less specific
    // than this result, set the result as the new best match
    if (bestMatch.matchStrength! < result.matchStrength!) {
      return result;
    }

    return bestMatch;
  });
}

function clone<T>(original: T): T | null {
  if (!original) {
    return null;
  }
  const dupe = JSON.parse(JSON.stringify(original));
  return dupe as T;
}

// Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
// tslint:disable-next-line:no-shadowed-variable
function matchesRange(cardNumber: string, min: number, max: number) {
  const maxLengthToCheck = String(min).length;
  const substr = cardNumber.substr(0, maxLengthToCheck);
  const integerRepresentationOfCardNumber = parseInt(substr, 10);
  min = parseInt(String(min).substr(0, substr.length), 10);
  max = parseInt(String(max).substr(0, substr.length), 10);
  return (
    integerRepresentationOfCardNumber >= min &&
    integerRepresentationOfCardNumber <= max
  );
}

function matchesPattern(cardNumber: string, pattern: number | string) {
  pattern = String(pattern);
  return (
    pattern.substring(0, cardNumber.length) ===
    cardNumber.substring(0, pattern.length)
  );
}

function matches(cardNumber: string, pattern: number | number[]) {
  if (Array.isArray(pattern)) {
    return matchesRange(cardNumber, pattern[0], pattern[1]);
  }
  return matchesPattern(cardNumber, pattern);
}

function addMatchingCardsToResults(
  cardNumber: string,
  cardConfiguration: CreditCardSearchResult,
  results: CreditCardSearchResult[]
) {
  let i;

  let patternLength;

  for (i = 0; i < cardConfiguration.patterns.length; i++) {
    const pattern = cardConfiguration.patterns[i];

    if (!matches(cardNumber, pattern)) {
      continue;
    }

    const clonedCardConfiguration = clone(cardConfiguration)!;

    if (Array.isArray(pattern)) {
      patternLength = String(pattern[0]).length;
    } else {
      patternLength = String(pattern).length;
    }

    if (cardNumber.length >= patternLength) {
      clonedCardConfiguration.matchStrength = patternLength;
    }

    results.push(clonedCardConfiguration);
    break;
  }
}

let testOrder: string[];

const cardNames = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  AMERICAN_EXPRESS: "american-express",
  DINERS_CLUB: "diners-club",
  DISCOVER: "discover",
  JCB: "jcb",
  UNIONPAY: "unionpay",
  MAESTRO: "maestro",
  ELO: "elo",
  MIR: "mir",
  HIPER: "hiper",
  HIPERCARD: "hipercard"
};

const ORIGINAL_TEST_ORDER = [
  cardNames.VISA,
  cardNames.MASTERCARD,
  cardNames.AMERICAN_EXPRESS,
  cardNames.DINERS_CLUB,
  cardNames.DISCOVER,
  cardNames.JCB,
  cardNames.UNIONPAY,
  cardNames.MAESTRO,
  cardNames.ELO,
  cardNames.MIR,
  cardNames.HIPER,
  cardNames.HIPERCARD
];

testOrder = clone(ORIGINAL_TEST_ORDER)!;

function findCardDescriptor(type: string) {
  return cardSearchDescriptors.find(card => card.issuer === type);
}

function getAllCardDescriptors() {
  return testOrder.map((type: string) => {
    return clone(findCardDescriptor(type)!)!;
  });
}

function getCardPosition(name: string, ignoreErrorForNotExisting?: boolean) {
  const position = testOrder.indexOf(name);

  if (!ignoreErrorForNotExisting && position === -1) {
    throw new Error('"' + name + '" is not a supported card type.');
  }

  return position;
}

export function findCard(cardNumber: string) {
  let bestMatch;
  const results: CreditCardSearchResult[] = [];

  if (!_.isString(cardNumber)) {
    return [];
  }

  if (cardNumber.length === 0) {
    return getAllCardDescriptors();
  }

  testOrder.forEach(issuer => {
    const cardConfiguration = findCardDescriptor(issuer);
    if (!_.isNil(cardConfiguration)) {
      addMatchingCardsToResults(cardNumber, cardConfiguration, results);
    }
  });

  bestMatch = findBestMatch(results);

  if (bestMatch) {
    return [bestMatch];
  }

  return results;
}

export const getCardDescriptor = (issuer: string) => {
  return clone(findCardDescriptor(issuer));
};

export const removeCard = (name: string) => {
  const position = getCardPosition(name);

  testOrder.splice(position, 1);
};

export function prettyCardNumber(cardNumber: string, cardType: string) {
  const card = getCardDescriptor(cardType);

  if (card) {
    const offsets = [0, ...card.gaps, cardNumber.length];
    const components: string[] = [];

    for (let i = 0; offsets[i] < cardNumber.length; i++) {
      const start = offsets[i];
      const end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(" ");
  }

  return cardNumber;
}

/*
 * Luhn algorithm implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function luhn10(identifier: string) {
  let sum = 0;
  let alt = false;
  let i = identifier.length - 1;
  let num;

  while (i >= 0) {
    num = parseInt(identifier.charAt(i), 10);

    if (alt) {
      num *= 2;
      if (num > 9) {
        num = (num % 10) + 1; // eslint-disable-line no-extra-parens
      }
    }

    alt = !alt;

    sum += num;

    i--;
  }

  return sum % 10 === 0;
}

function createNumberVerificationResult(
  isPotentiallyValid: boolean,
  isValid: boolean,
  card?: CreditCardSearchDescriptor
): CreditCardVerificationResult {
  return { card, isPotentiallyValid, isValid };
}

function verifyCCV(
  isValid: boolean,
  isPotentiallyValid: boolean
): VerificationResult {
  return { isValid, isPotentiallyValid };
}

export function verifyCreditCardNumber(
  value: string | number,
  options: { maxLength: number }
) {
  let cardType: CreditCardSearchDescriptor;
  let isPotentiallyValid: boolean;
  let isValid: boolean;
  let i: number;
  let maxLength: number;

  if (typeof value === "number") {
    value = String(value);
  }

  if (typeof value !== "string") {
    return createNumberVerificationResult(false, false);
  }

  value = value.replace(/\-|\s/g, "");
  if (!/^\d*$/.test(value)) {
    return createNumberVerificationResult(false, false);
  }

  const potentialTypes = creditCardType(value);
  if (potentialTypes.length === 0) {
    return createNumberVerificationResult(false, false);
  } else if (potentialTypes.length !== 1) {
    return createNumberVerificationResult(true, false);
  }

  cardType = potentialTypes[0];

  if (options.maxLength && value.length > options.maxLength) {
    return createNumberVerificationResult(false, false);
  }

  if (
    cardType.issuer ===
    cardNames.UNIONPAY /*&&options.luhnValidateUnionPay !== true*/
  ) {
    isValid = true;
  } else {
    isValid = luhn10(value);
  }

  maxLength = Math.max.apply(null, cardType.lengths);
  if (options.maxLength) {
    maxLength = Math.min(options.maxLength, maxLength);
  }

  for (i = 0; i < cardType.lengths.length; i++) {
    if (cardType.lengths[i] === value.length) {
      isPotentiallyValid = value.length < maxLength || isValid;
      return createNumberVerificationResult(
        isPotentiallyValid,
        isValid,
        cardType
      );
    }
  }

  return createNumberVerificationResult(
    value.length < maxLength,
    false,
    cardType
  );
}

const DEFAULT_LENGTH = 3;

function max(array: number[]) {
  let maximum = DEFAULT_LENGTH;
  for (let i = 0; i < array.length; i++) {
    maximum = array[i] > maximum ? array[i] : maximum;
  }

  return maximum;
}

function cvv(value: string, maxLength: number | number[]) {
  maxLength = maxLength || DEFAULT_LENGTH;
  maxLength = maxLength instanceof Array ? maxLength : [maxLength];

  if (typeof value !== "string") {
    return verifyCCV(false, false);
  }
  if (!/^\d*$/.test(value)) {
    return verifyCCV(false, false);
  }
  if (maxLength.includes(value.length)) {
    return verifyCCV(true, true);
  }
  if (value.length < Math.min.apply(null, maxLength)) {
    return verifyCCV(false, true);
  }
  if (value.length > max(maxLength)) {
    return verifyCCV(false, false);
  }

  return verifyCCV(true, true);
}

function verifyExpirationMonth(
  isValid: boolean,
  isPotentiallyValid: boolean,
  isValidForThisYear?: boolean
) {
  return {
    isValid,
    isPotentiallyValid,
    isValidForThisYear: isValidForThisYear || false
  };
}

function expirationMonth(value: string) {
  const currentMonth = new Date().getMonth() + 1;

  if (typeof value !== "string") {
    return verifyExpirationMonth(false, false);
  }
  if (value.replace(/\s/g, "") === "" || value === "0") {
    return verifyExpirationMonth(false, true);
  }
  if (!/^\d*$/.test(value)) {
    return verifyExpirationMonth(false, false);
  }

  const month = parseInt(value, 10);
  if (_.isNaN(value)) {
    return verifyExpirationMonth(false, false);
  }
  const result = month > 0 && month < 13;
  return verifyExpirationMonth(result, result, result && month >= currentMonth);
}

const DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE = 19;

function verifyExpirationYear(
  isValid: boolean,
  isPotentiallyValid: boolean,
  isCurrentYear?: boolean
) {
  return {
    isValid,
    isPotentiallyValid,
    isCurrentYear: isCurrentYear || false
  };
}

function expirationYear(value: string | number, maxElapsedYear?: number) {
  maxElapsedYear =
    maxElapsedYear || DEFAULT_VALID_NUMBER_OF_YEARS_IN_THE_FUTURE;

  if (typeof value !== "string") {
    return verifyExpirationYear(false, false);
  }
  if (value.replace(/\s/g, "") === "") {
    return verifyExpirationYear(false, true);
  }
  if (!/^\d*$/.test(value)) {
    return verifyExpirationYear(false, false);
  }

  const len = value.length;

  if (len < 2) {
    return verifyExpirationYear(false, true);
  }

  const currentYear = new Date().getFullYear();

  if (len === 3) {
    // 20x === 20x
    const firstTwo = value.slice(0, 2);
    const currentFirstTwo = String(currentYear).slice(0, 2);

    return verifyExpirationYear(false, firstTwo === currentFirstTwo);
  }

  if (len > 4) {
    return verifyExpirationYear(false, false);
  }

  value = parseInt(value, 10);
  const twoDigitYear = Number(String(currentYear).substr(2, 2));
  let valid: boolean;
  let isCurrentYear: boolean;
  if (len === 2) {
    isCurrentYear = twoDigitYear === value;
    valid = value >= twoDigitYear && value <= twoDigitYear + maxElapsedYear;
  } else if (len === 4) {
    isCurrentYear = currentYear === value;
    valid = value >= currentYear && value <= currentYear + maxElapsedYear;
  }

  return verifyExpirationYear(valid!, valid!, isCurrentYear!);
}

function getNumberOfMonthDigitsInDateString(dateString: string) {
  const firstCharacter = Number(dateString[0]);
  let assumedYear;

  /*
    if the first character in the string starts with `0`,
    we know that the month will be 2 digits.
    '0122' => {month: '01', year: '22'}
  */
  if (firstCharacter === 0) {
    return 2;
  }

  /*
    if the first character in the string starts with
    number greater than 1, it must be a 1 digit month
    '322' => {month: '3', year: '22'}
  */
  if (firstCharacter > 1) {
    return 1;
  }

  /*
    if the first 2 characters make up a number between
    13-19, we know that the month portion must be 1
    '139' => {month: '1', year: '39'}
  */
  if (firstCharacter === 1 && Number(dateString[1]) > 2) {
    return 1;
  }

  /*
    if the first 2 characters make up a number between
    10-12, we check if the year portion would be considered
    valid if we assumed that the month was 1. If it is
    not potentially valid, we assume the month must have
    2 digits.
    '109' => {month: '10', year: '9'}
    '120' => {month: '1', year: '20'} // when checked in the year 2019
    '120' => {month: '12', year: '0'} // when checked in the year 2021
  */
  if (firstCharacter === 1) {
    assumedYear = dateString.substr(1);

    return expirationYear(assumedYear).isPotentiallyValid ? 1 : 2;
  }

  /*
    If the length of the value is exactly 5 characters,
    we assume a full year was passed in, meaning the remaining
    single leading digit must be the month value.
    '12202' => {month: '1', year: '2202'}
  */
  if (dateString.length === 5) {
    return 1;
  }

  /*
    If the length of the value is more than five characters,
    we assume a full year was passed in addition to the month
    and therefore the month portion must be 2 digits.
    '112020' => {month: '11', year: '2020'}
  */
  if (dateString.length > 5) {
    return 2;
  }

  /*
    By default, the month value is the first value
  */
  return 1;
}

function parseDate(date: string) {
  let processed: string[] | string = [];
  if (/^\d{4}-\d{1,2}$/.test(date)) {
    processed = date.split("-").reverse();
  } else if (/\//.test(date)) {
    processed = date.split(/\s*\/\s*/g);
  } else if (/\s/.test(date)) {
    processed = date.split(/ +/g);
  }

  if (!_.isNil(processed) && !_.isEmpty(processed) && isArray(processed)) {
    return {
      month: processed[0] || "",
      year: processed.slice(1).join()
    };
  }

  const numberOfDigitsInMonth = getNumberOfMonthDigitsInDateString(date);
  const month = date.substr(0, numberOfDigitsInMonth);

  return {
    month,
    year: date.substr(month.length)
  };
}

function verifyExpirationDate(
  isValid: boolean,
  isPotentiallyValid: boolean,
  month?: string,
  year?: string
): ExpirationDateVerificationResult {
  return {
    isValid,
    isPotentiallyValid,
    month,
    year
  };
}

function expirationDate(
  value: { month: string | number; year: string | number } | string,
  maxElapsedYear?: number
) {
  let date;
  let monthValid;
  let yearValid;
  let isValidForThisYear;

  if (typeof value === "string") {
    value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2");
    date = parseDate(value);
  } else if (value !== null && typeof value === "object") {
    date = {
      month: String(value.month),
      year: String(value.year)
    };
  } else {
    return verifyExpirationDate(false, false);
  }

  monthValid = expirationMonth(date.month);
  yearValid = expirationYear(date.year, maxElapsedYear);

  if (monthValid.isValid) {
    if (yearValid.isCurrentYear) {
      isValidForThisYear = monthValid.isValidForThisYear;

      return verifyExpirationDate(
        isValidForThisYear,
        isValidForThisYear,
        date.month,
        date.year
      );
    }

    if (yearValid.isValid) {
      return verifyExpirationDate(true, true, date.month, date.year);
    }
  }

  if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
    return verifyExpirationDate(false, true);
  }

  return verifyExpirationDate(false, false);
}

function creditCardType(cardNumber: string) {
  let bestMatch;
  const results: CreditCardSearchResult[] = [];

  if (typeof cardNumber !== "string") {
    return [];
  }

  if (cardNumber.length === 0) {
    return getAllCardDescriptors();
  }

  testOrder.forEach(type => {
    const cardConfiguration = findCardDescriptor(type);
    if (!_.isNil(cardConfiguration)) {
      addMatchingCardsToResults(cardNumber, cardConfiguration, results);
    }
  });

  bestMatch = findBestMatch(results);

  if (bestMatch) {
    return [bestMatch];
  }

  return results;
}

export class Verify {
  public static number(
    value: string | number,
    options: { maxLength: number } = { maxLength: 20 }
  ) {
    let cardType: CreditCardSearchDescriptor;
    let isPotentiallyValid: boolean;
    let isValid: boolean;
    let i: number;
    let maxLength: number;

    if (typeof value === "number") {
      value = String(value);
    }

    if (typeof value !== "string") {
      return createNumberVerificationResult(false, false);
    }

    value = value.replace(/\-|\s/g, "");
    if (!/^\d*$/.test(value)) {
      return createNumberVerificationResult(false, false);
    }

    const potentialTypes = creditCardType(value);
    if (potentialTypes.length === 0) {
      return createNumberVerificationResult(false, false);
    } else if (potentialTypes.length !== 1) {
      return createNumberVerificationResult(true, false);
    }

    cardType = potentialTypes[0];

    if (options.maxLength && value.length > options.maxLength) {
      return createNumberVerificationResult(false, false);
    }

    if (
      cardType.issuer ===
      cardNames.UNIONPAY /*&&options.luhnValidateUnionPay !== true*/
    ) {
      isValid = true;
    } else {
      isValid = luhn10(value);
    }

    maxLength = Math.max.apply(null, cardType.lengths);
    if (options.maxLength) {
      maxLength = Math.min(options.maxLength, maxLength);
    }

    for (i = 0; i < cardType.lengths.length; i++) {
      if (cardType.lengths[i] === value.length) {
        isPotentiallyValid = value.length < maxLength || isValid;
        return createNumberVerificationResult(
          isPotentiallyValid,
          isValid,
          cardType
        );
      }
    }

    return createNumberVerificationResult(
      value.length < maxLength,
      false,
      cardType
    );
  }
  public static expiry(
    value: { month: string | number; year: string | number } | string,
    maxElapsedYear?: number
  ) {
    let date;
    let monthValid;
    let yearValid;
    let isValidForThisYear;

    if (typeof value === "string") {
      value = value.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2");
      date = parseDate(value);
    } else if (value !== null && typeof value === "object") {
      date = {
        month: String(value.month),
        year: String(value.year)
      };
    } else {
      return verifyExpirationDate(false, false);
    }

    monthValid = expirationMonth(date.month);
    yearValid = expirationYear(date.year, maxElapsedYear);

    if (monthValid.isValid) {
      if (yearValid.isCurrentYear) {
        isValidForThisYear = monthValid.isValidForThisYear;

        return verifyExpirationDate(
          isValidForThisYear,
          isValidForThisYear,
          date.month,
          date.year
        );
      }

      if (yearValid.isValid) {
        return verifyExpirationDate(true, true, date.month, date.year);
      }
    }

    if (monthValid.isPotentiallyValid && yearValid.isPotentiallyValid) {
      return verifyExpirationDate(false, true);
    }

    return verifyExpirationDate(false, false);
  }
  public static cvv(value: string, maxLength: number | number[]) {
    maxLength = maxLength || DEFAULT_LENGTH;
    maxLength = maxLength instanceof Array ? maxLength : [maxLength];

    if (typeof value !== "string") {
      return verifyCCV(false, false);
    }
    if (!/^\d*$/.test(value)) {
      return verifyCCV(false, false);
    }
    if (maxLength.includes(value.length)) {
      return verifyCCV(true, true);
    }
    if (value.length < Math.min.apply(null, maxLength)) {
      return verifyCCV(false, true);
    }
    if (value.length > max(maxLength)) {
      return verifyCCV(false, false);
    }

    return verifyCCV(true, true);
  }
}
