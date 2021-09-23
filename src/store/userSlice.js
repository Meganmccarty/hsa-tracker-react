import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CSRFToken from '../components/cookies';

export const createUser = createAsyncThunk("user/createUser", async (formData) => {
    const response = await fetch("/signup", {
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

export const onLogin = createAsyncThunk("user/onLogin", async (formData) => {
    const response = await fetch("/login", {
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
    user: null,
    status: "",
    loading: true,
    errors: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin(state, action) {
            state.user = action.payload;
        },
        toggleLoading(state, action) {
            state.loading = action.payload
        }
    },
    extraReducers: {
        [createUser.pending](state) {
            state.status = "loading";
        },
        [createUser.fulfilled](state, action) {
            state.status = "idle";
            if (action.payload.errors) {
                state.errors = action.payload.errors;
            } else {
                state.user = action.payload;
                state.erros = [];
            }
        },
        [createUser.rejected](state, action) {
            state.status = "rejected";
            if (action.payload) {
                state.errors = action.payload.errorMessages;
            } else {
                state.errors = action.error.message;
            }
        },
        [onLogin.pending](state) {
            state.status = "loading";
        },
        [onLogin.fulfilled](state, action) {
            state.status = "completed";
            if (action.payload.errors) {
                state.errors = action.payload.errors;
            } else {
                state.user = action.payload;
                state.errors = [];
            }
        },
        [onLogin.rejected](state, action) {
            state.status = "rejected";
            if (action.payload) {
                state.errors = action.payload.errorMessages;
            } else {
                state.errors = action.error.message;
            }
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice