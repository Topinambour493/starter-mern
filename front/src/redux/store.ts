import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Utilise localStorage

import userReducer from "./userSlice";
import dishReducer from "./dishSlice";
import orderReducer from "./orderSlice";
import cartReducer from "./cartSlice";

// Regroupe tous les reducers
const rootReducer = combineReducers({
	user: userReducer,
	dish: dishReducer,
	order: orderReducer,
	cart: cartReducer,
});

// Configuration de persist
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["user"], // Mets ici les reducers à persister
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // Évite les erreurs de sérialisation
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
