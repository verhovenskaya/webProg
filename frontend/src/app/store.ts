import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import uiReducer from '../features/ui/uiSlice';
import registerReducer from '../features/register/registerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        ui: uiReducer,
        register: registerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;