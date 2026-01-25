import persistStore from "redux-persist/es/persistStore";
import authReducer from "./reducer/authReducer";
import localStorage from "redux-persist/lib/storage";

const { combineReducers, configureStore } = require("@reduxjs/toolkit");
const { default: persistReducer } = require("redux-persist/es/persistReducer");

const rootReducers = combineReducers({
    authStore:authReducer
});

const persistConfig = {
    key:"root",
    storage:localStorage
};

const persistedReducer = persistReducer(persistConfig,rootReducers)

export const store = configureStore({
    reducer:persistedReducer,
    devTools:true,
    middleware:(getDefaultMiddleware)=>{
      return  getDefaultMiddleware({serializableCheck:false})
    }
});

export const persistor = persistStore(store) 