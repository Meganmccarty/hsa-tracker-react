import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';

import styles from '../auth-forms.module.css';

function PasswordReset() {
    const history = useHistory();
    const email = useParams().email;

    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors);

    const [passwordForm, setPasswordForm] = useState({
        token: "",
        email: email,
        password: "",
        password_confirmation: ""
    });

    function handlePasswordChange(e) {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault();
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(passwordForm)
        };
        fetch("/reset-password", configObj)
            .then(response => {
                if (response.ok) {
                    localStorage.setItem("token", response.headers.get("Authorization"));
                    response.json().then(data => {
                        dispatch(userActions.setMessage(data.status.message));
                        history.push('/login');
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors.status.errors));
                    });
                };
            });
    };

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]));
        }
    }, [dispatch]);

    return (
        <section className={styles.authForm}>
            <h1>Reset Password</h1>
            {errors.length > 0 ? <div className={styles.errors}>{errors}</div> : null}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="token"
                    aria-label="Reset code"
                    onChange={handlePasswordChange}
                    placeholder="Reset code"
                    required={true}
                />
                <input
                    type="password"
                    name="password"
                    aria-label="New password"
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    required={true}
                />
                <input
                    type="password"
                    name="password_confirmation"
                    aria-label="Confirm new password"
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required={true}
                />
                <input type="submit" aria-label="Submit button" />
            </form>
        </section>
    );
}
export default PasswordReset;