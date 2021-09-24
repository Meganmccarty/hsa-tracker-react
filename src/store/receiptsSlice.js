import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CSRFToken from '../components/cookies';

// export const retrieveReceipts = createAsyncThunk("receipts/retrieveReceipts", async () => {
//     const response = await fetch("/receipt-records");
//     const data = await response.json();
//     return data;
// })

// export const retrieveOneReceipt = createAsyncThunk("receipts/retrieveOneReceipt", async (id) => {
//     const response = await fetch(`/receipt-records/${id}`);
//     const data = await response.json();
//     return data;
// })


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
        toggleLoading(state, action) {
            state.loading = action.payload
        }
    },
    extraReducers: {
        // [retrieveReceipts.pending](state) {
        //     state.status = "loading";
        // },
        // [retrieveReceipts.fulfilled](state, action) {
        //     state.status = "fulfilled";
        //     if (action.payload.errors) {
        //         state.errors = action.payload.errors;
        //     } else {
        //         state.receiptList = action.payload;
        //         state.errors = [];
        //     }
        // },
        // [retrieveReceipts.rejected](state, action) {
        //     state.status = "rejected";
        //     if (action.payload) {
        //         state.errors = action.payload.errorMessages;
        //     } else {
        //         state.errors = action.error.message;
        //     }
        // },
        // [retrieveOneReceipt.pending](state) {
        //     state.status = "loading";
        // },
        // [retrieveOneReceipt.fulfilled](state, action) {
        //     state.status = "fulfilled";
        //     if (action.payload.errors) {
        //         state.errors = action.payload.errors;
        //     } else {
        //         state.receipt = action.payload;
        //         state.errors = [];
        //     }
        // },
        // [retrieveOneReceipt.rejected](state, action) {
        //     state.status = "rejected";
        //     if (action.payload) {
        //         state.errors = action.payload.errorMessages;
        //     } else {
        //         state.errors = action.error.message;
        //     }
        // }
    }
})

export const receiptsActions = receiptsSlice.actions;

export default receiptsSlice