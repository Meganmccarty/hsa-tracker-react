import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    receiptList: [],
    receipt: null,
    status: "",
    loading: true,
    errors: [],
    message: ""
}

const receiptSlice = createSlice({
    name: 'receipts',
    initialState,
    reducers: {
        addReceipts(state, action) {
            state.receiptList = action.payload
        },
        clearReceipts(state) {
            state.receiptList = [];
            state.receipt = null;
        },
        getReceipt(state, action) {
            // const id = action.payload;
            // state.receipt = state.receiptList.find(receipt => receipt.id === id);
            state.receipt = action.payload;
        },
        createReceipt(state, action) {
            state.receiptList.push(action.payload)
            state.receipt = action.payload
        },
        patchReceipt(state, action) {
            state.receiptList = state.receiptList.map(receipt => receipt.id === action.payload.id ? action.payload : receipt)
            state.receipt = action.payload;
        },
        deleteReceipt(state, action) {
            const id = action.payload;
            state.receiptList = state.receiptList.filter(receipt => receipt.id !== id);
            state.receipt = null;
        },
        toggleLoading(state, action) {
            state.loading = action.payload
        },
        setErrors(state, action) {
            state.errors = action.payload;
        },
        setMessage(state, action) {
            state.message = action.payload;
        }
    }
})

export const receiptActions = receiptSlice.actions;

export default receiptSlice