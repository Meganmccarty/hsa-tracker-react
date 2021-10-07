import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';

import './Login.css';

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

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]))
        }
    }, [dispatch])

    return (
        <main>
            <section>
                <h1>Login</h1>
                {errors.length > 0 ? <div id="errors">{errors}</div> : null}
                <div>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            aria-label="Email address"
                            onChange={handleFormChange}
                            placeholder="Email address"
                        />
                        <input
                            type="password"
                            name="password"
                            aria-label="Password"
                            onChange={handleFormChange}
                            placeholder="Password"
                        />
                        <input type="submit" aria-label="Submit button" />
                    </form>
                    <Link to="/forgot-password">Forgot Password</Link>
                </div>
            </section>
        </main>
    );
};

export default Login;