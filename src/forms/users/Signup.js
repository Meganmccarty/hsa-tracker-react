import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';
import getAPIurl from '../../functions/url';

import styles from '../auth-forms.module.css';

function Signup() {
    const history = useHistory();
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors)
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

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
        fetch(`${getAPIurl()}/signup`, configObj)
            .then(response => {
                if (response.ok) {
                    localStorage.setItem("token", response.headers.get("Authorization"));
                    response.json().then(user => {
                        console.log(user)
                        dispatch(userActions.userLogin(user.user));
                        dispatch(userActions.setMessage(user.status.message));
                        dispatch(userActions.toggleLoading(false));
                        history.push("/receipt-records")
                    })
                } else {
                    response.json().then(errors => {
                        console.log(errors);
                        dispatch(userActions.setErrors(errors.status.errors));
                        dispatch(userActions.toggleLoading(false));
                    })
                }
            })
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]))
        }
    }, [dispatch])

    return (
        <section className={styles.authForm}>
            <h1>Sign Up</h1>
            {errors.length > 0 ? <div className={styles.errors}>{errors}</div> : null}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    aria-label="First name"
                    onChange={handleFormChange}
                    placeholder="First name"
                    required={true}
                />
                <input
                    type="text"
                    name="last_name"
                    aria-label="Last name"
                    onChange={handleFormChange}
                    placeholder="Last name"
                    required={true}
                />
                <input
                    type="email"
                    name="email"
                    aria-label="Email address"
                    onChange={handleFormChange}
                    placeholder="Email address"
                    required={true}
                />
                <input
                    type="password"
                    name="password"
                    aria-label="Password"
                    onChange={handleFormChange}
                    placeholder="Password"
                    required={true}
                />
                <input
                    type="password"
                    name="password_confirmation"
                    aria-label="Confirm password"
                    onChange={handleFormChange}
                    placeholder="Confirm password"
                    required={true}
                />
                <input type="submit" aria-label="Submit button" />
            </form>
        </section>
    );
};

export default Signup;