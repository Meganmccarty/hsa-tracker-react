import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import CSRFToken from './cookies';

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
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": CSRFToken(document.cookie)
            },
            body: JSON.stringify(formData)
        };
        fetch("/login", configObj)
            .then(response => {
                if (response.ok) {
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
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleFormChange} placeholder="Email address" />
            <input type="password" name="password" onChange={handleFormChange} placeholder="Password" />
            <input type="submit" />
        </form>
    );
};

export default Login;