import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';

import styles from '../auth-forms.module.css';

function ForgotPassword() {
    const dispatch = useDispatch();
    const message = useSelector(state => state.user.message)
    const [email, setEmail] = useState("");

    function handleEmailChange(e) {
        setEmail({ [e.target.name]: e.target.value })
    };

    function handleSubmit(e) {
        e.preventDefault();
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(email)
        };
        fetch("/forgot-password", configObj)
            .then(response => {
                if (response.ok) {
                    localStorage.setItem("token", response.headers.get("Authorization"));
                    response.json().then(data => {
                        dispatch(userActions.setMessage(data.status.message))
                    });
                }
            });

    };

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setMessage(""))
        }
    }, [dispatch])

    return (
        <section className={styles.authForm}>
            <h1>Forgot Password</h1>
            {message ? <div className={styles.message}>{message}</div> : null}
            <p>Enter the email address you used when creating your account</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    aria-label="Email address"
                    onChange={handleEmailChange}
                    placeholder="Email address"
                    required={true}
                />
                <input type="submit" aria-label="Submit button" />
            </form>
        </section>
    )
};

export default ForgotPassword;