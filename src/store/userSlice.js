import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: "",
    loading: true,
    errors: [],
    message: ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin(state, action) {
            state.user = action.payload;
        },
        userLogout(state) {
            state.user = null;
        },
        updateUser(state, action) {
            state.user = action.payload
        },
        toggleLoading(state, action) {
            state.loading = action.payload
        },
        setErrors(state, action) {
            state.errors = action.payload
        },
        setMessage(state, action) {
            state.message = action.payload
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice