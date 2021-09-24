import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CSRFToken from '../components/cookies';

export const createReceipt = createAsyncThunk("receipts/createReceipt", async (formData) => {
    const response = await fetch("/receipt-records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie)
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    return data;
});


const initialState = {
    receiptList: [],
    receipt: null,
    status: "",
    loading: true,
    errors: []
}

const receiptsSlice = createSlice({
    name: 'receipts',
    initialState,
    reducers: {
        addUserReceipts(state, action) {
            state.receiptList = action.payload
        },
        clearUserReceipts(state) {
            state.receiptList = [];
            state.receipt = null;
        },
        getReceipt(state, action) {
            const id = action.payload;
            state.receipt = state.receiptList.find(receipt => receipt.id === id);
        },
        deleteReceipt(state, action) {
            const id = action.payload;
            state.receiptList = state.receiptList.filter(receipt => receipt.id !== id);
            state.receipt = null;
        },
        toggleLoading(state, action) {
            state.loading = action.payload
        }
    },
    extraReducers: {
        [createReceipt.pending](state) {
            state.status = "loading";
        },
        [createReceipt.fulfilled](state, action) {
            state.status = "completed";
            if (action.payload.errors) {
                state.errors = action.payload.errors;
            } else {
                state.receiptList.push(action.payload);
                state.errors = [];
            }
        },
        [createReceipt.rejected](state, action) {
            state.status = "rejected";
            if (action.payload) {
                state.errors = action.payload.errorMessages;
            } else {
                state.errors = action.error.message;
            }
        }
    }
})

export const receiptsActions = receiptsSlice.actions;

export default receiptsSlice