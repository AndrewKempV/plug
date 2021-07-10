import { ApiClient } from "../../api/client";
import {
  InferActionTypes,
  createAsyncAction
} from "../../store/ActionCreators";
import * as types from "./types";

const settingsActions = {
  addPaymentMethod: createAsyncAction(
    [types.ADD_PAYMENT, types.ADD_PAYMENT_SUCCESS, types.ADD_PAYMENT_FAIL],
    ApiClient.instance.addCardToCustomer
  ),
  deletePaymentMethod: createAsyncAction(
    [
      types.DELETE_PAYMENT,
      types.DELETE_PAYMENT_SUCCESS,
      types.DELETE_PAYMENT_FAIL
    ],
    ApiClient.instance.deleteCardFromCustomer
  ),
  changeDefaultPaymentMethod: createAsyncAction(
    [
      types.CHANGE_DEFAULT_PAYMENT,
      types.CHANGE_DEFAULT_PAYMENT_SUCCESS,
      types.CHANGE_DEFAULT_PAYMENT_FAIL
    ],
    ApiClient.instance.changeDefaultCardForCustomer
  ),
  getPaymentMethods: createAsyncAction(
    [
      types.GET_PAYMENT_METHODS,
      types.GET_PAYMENT_METHODS_SUCCESS,
      types.GET_PAYMENT_METHODS_FAIL
    ],
    ApiClient.instance.listCustomerCards
  ),
  createCustomerWithDefaultCard: createAsyncAction(
    [
      types.CREATE_CUSTOMER_WITH_DEFAULT_CARD,
      types.CREATE_CUSTOMER_WITH_DEFAULT_CARD_SUCCESS,
      types.CREATE_CUSTOMER_WITH_DEFAULT_CARD_FAIL
    ],
    ApiClient.instance.createCustomerWithDefaultCard
  ),
  getCustomer: createAsyncAction(
    [types.GET_CUSTOMER, types.GET_CUSTOMER_SUCCESS, types.GET_CUSTOMER_FAIL],
    ApiClient.instance.getCustomer
  )
};

export default settingsActions;
export type SettingsActions = InferActionTypes<typeof settingsActions>;
