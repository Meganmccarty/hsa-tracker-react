import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import receiptsSlice from './receiptsSlice';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        receipts: receiptsSlice.reducer
    },
})

export default store;