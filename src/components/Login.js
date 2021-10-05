import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/userSlice';

function Login() {
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    function handleSubmit(e) {
        e.preventDefault();
        const user = {
            user: { ...formData }
        }
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        };
        fetch("/login", configObj)
            .then(response => {
                if (response.ok) {
                    localStorage.setItem("token", response.headers.get("Authorization"));
                    response.json().then(user => {
                        console.log(user.user)
                        console.log(user.status.message)
                        dispatch(userActions.userLogin(user.user));
                        dispatch(userActions.setMessage(user.status.message))
                        dispatch(userActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        console.log(errors.error)
                        dispatch(userActions.setErrors(errors.error));
                        dispatch(userActions.toggleLoading(false));
                    });
                };
            });
    };

    function handleErrors() {
        if (errors) {
            setTimeout(() => {
                dispatch(userActions.setErrors(""));
            }, 5000)
            return <span>{errors}</span>
        }
    }

    return (
        <>
            {handleErrors()}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" onChange={handleFormChange} placeholder="Email address" />
                <input type="password" name="password" onChange={handleFormChange} placeholder="Password" />
                <input type="submit" />
            </form>
            <Link to="/forgot-password">Forgot Password</Link>
        </>
    );
};

export default Login;