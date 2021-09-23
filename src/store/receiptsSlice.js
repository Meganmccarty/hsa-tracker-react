import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CSRFToken from '../components/cookies';

export const retrieveReceipts = createAsyncThunk("receipts/retrieveReceipts", async () => {
    const response = await fetch("/receipt-records");
    const data = await response.json();
    return data;
})


const initialState = {
    receipts: [],
    status: "",
    loading: true,
    errors: []
}

const receiptsSlice = createSlice({
    name: 'receipts',
    initialState,
    reducers: {
        toggleLoading(state, action) {
            state.loading = action.payload
        }
    },
    extraReducers: {
        [retrieveReceipts.pending](state) {
            state.status = "loading";
        },
        [retrieveReceipts.fulfilled](state, action) {
            state.status = "fulfilled";
            if (action.payload.errors) {
                state.errors = action.payload.errors;
            } else {
                state.receipts = action.payload;
                state.errors = [];
            }
        },
        [retrieveReceipts.rejected](state, action) {
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