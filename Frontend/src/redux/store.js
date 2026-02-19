import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import electionReducer from './electionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        election: electionReducer,
    },
});
