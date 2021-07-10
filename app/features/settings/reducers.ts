import { PaymentItem } from "../../components/SavedPaymentList/SavedPaymentList";
import { SettingsActions } from "./actions";
import { Customer } from "../../api/profile";
import { createPaymentItemFromCard } from "../../components/CreditCard/types";
import _ from "lodash";
import { APIActionStatus } from "../../models/ApiActionStatus";

interface SettingsState {
  customer?: Customer;
  defaultId: string;
  paymentMethods: PaymentItem[];
  lastAction: string;
  status: APIActionStatus;
}

const initialState: SettingsState = {
  paymentMethods: [],
  defaultId: "",
  lastAction: "",
  status: APIActionStatus.STARTED
};

export function settingReducer(
  state: SettingsState = initialState,
  action: SettingsActions
): SettingsState {
  switch (action.type) {
    case "ADD_PAYMENT":
      return {
        ...state,
        ...createStarted(action)
      };
    case "ADD_PAYMENT_SUCCESS":
      const response = action.payload.res.data;
      if (response.data) {
        const card = response.data.pop();
        if (card) {
          const item = createPaymentItemFromCard(card);
          if (item) {
            const paymentMethods = [...state.paymentMethods, item];
            console.log(paymentMethods);
            return {
              ...state,
              ...createSuccess(action),
              paymentMethods
            };
          }
        }
      }

      return {
        ...state,
        ...createSuccess(action)
      };
    case "ADD_PAYMENT_FAIL":
      return {
        ...state,
        ...createFailure(action)
      };
    case "DELETE_PAYMENT":
      return {
        ...state,
        ...createStarted(action)
      };
    case "DELETE_PAYMENT_SUCCESS":
      const toDelete = action.payload.req as string;
      return {
        ...state,
        ...createSuccess(action),
        paymentMethods: [
          ...state.paymentMethods.filter(item => item.id !== toDelete)
        ]
      };
    case "DELETE_PAYMENT_FAIL":
      return {
        ...state,
        ...createFailure(action)
      };
    case "GET_PAYMENT_METHODS":
      return {
        ...state,
        ...createStarted(action)
      };
    case "GET_PAYMENT_METHODS_SUCCESS":
      const cards = action.payload.res;
      const paymentMethods = cards
        .map(card => createPaymentItemFromCard(card, state.defaultId))
        .filter(notEmpty);
      return {
        ...state,
        ...createSuccess(action),
        paymentMethods
      };
    case "GET_PAYMENT_METHODS_FAIL":
      return {
        ...state,
        ...createFailure(action)
      };

    case "CREATE_CUSTOMER_WITH_DEFAULT_CARD":
      return {
        ...state,
        ...createStarted(action)
      };
    case "CREATE_CUSTOMER_WITH_DEFAULT_CARD_SUCCESS":
      console.log(action);

      // const result = firstOrDefault(action.payload.res);
      // const cust = result.data!.pop();
      return {
        ...state,
        ...createSuccess(action)
      };
    case "CHANGE_DEFAULT_PAYMENT":
      return {
        ...state,
        ...createStarted(action)
      };
    case "CHANGE_DEFAULT_PAYMENT_SUCCESS":
      const id = action.payload.req as string;
      const index = state.paymentMethods.findIndex(i => i.default);
      if (index !== -1) {
        const payment = state.paymentMethods[index];
        state.paymentMethods[index] = { ...payment, default: false };
      }
      const idx = state.paymentMethods.findIndex(item => item.id === id);
      const defaultPayment = state.paymentMethods[idx];
      state.paymentMethods[idx] = { ...defaultPayment, default: true };

      return {
        ...state,
        ...createSuccess(action),
        paymentMethods: [...state.paymentMethods]
      };
    case "CHANGE_DEFAULT_PAYMENT_FAIL":
      return {
        ...state,
        ...createFailure(action)
      };
    case "GET_CUSTOMER":
      return {
        ...state,
        ...createStarted(action)
      };
    case "GET_CUSTOMER_SUCCESS":
      const customer = action.payload.res;
      return {
        ...state,
        ...createSuccess(action),
        customer,
        defaultId: customer.defaultSource || ""
      };
    default:
      return {
        ...state
      };
  }
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

function createSuccess(action: SettingsActions) {
  return {
    lastAction: action.type,
    status: APIActionStatus.SUCCEEDED
  };
}

function createFailure(action: SettingsActions) {
  return {
    lastAction: action.type,
    status: APIActionStatus.FAILED
  };
}

function createStarted(action: SettingsActions) {
  return {
    lastAction: action.type,
    status: APIActionStatus.STARTED
  };
}
