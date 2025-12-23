import { configureStore } from '@reduxjs/toolkit'
import apiKeyReducer from './slices/apikey/key.slice'
import authReducer from "./slices/auth/auth.slice"
import serverReducer from './slices/server/server.slice'
import userReducer from './slices/user/user.slice'


export const store = configureStore({
    reducer: {
            auth: authReducer,
            server: serverReducer,
            user: userReducer,
            apikey: apiKeyReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false, // needed for SecureStore + Date
        }),
})


export type RootState = ReturnType<typeof store.getState>


export type AppDispatch = typeof store.dispatch