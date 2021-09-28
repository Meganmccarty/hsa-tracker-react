import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import receiptSlice from './receiptSlice';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        receipts: receiptSlice.reducer
    },
})

export default store;