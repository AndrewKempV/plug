import * as React from "react-native";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { AppActionObjectTypes } from "./AppActions";
import reducers, { StateStore } from "./AppReducer";

const persistConfig: PersistConfig = {
  debug: __DEV__,
  key: "root",
  storage,
  whitelist: ["StateStore"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  composeWithDevTools(
    applyMiddleware(thunk as ThunkMiddleware<StateStore, AppActionObjectTypes>)
  )
);
const persistedStore = persistStore(store);
export default store;

export { persistedStore };
