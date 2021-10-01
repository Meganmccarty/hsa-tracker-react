import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';

function Login() {
    const dispatch = useDispatch();
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
                        dispatch(userActions.userLogin(user));
                        dispatch(userActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors));
                        dispatch(userActions.toggleLoading(false));
                    });
                };
            });
    };

    return (
        <>
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