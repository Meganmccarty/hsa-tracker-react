import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';

import '../user-forms.css';

function ChangePassword() {
    const history = useHistory();

    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors);

    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        password: "",
        password_confirmation: ""
    })

    function handlePasswordChange(e) {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault();
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify(passwordForm)
        };
        fetch("/change-password", configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        dispatch(userActions.updateUser(user.user));
                        dispatch(userActions.setMessage(user.status.message));
                        history.push("/profile")
                    });
                } else {
                    response.json().then(errors => {
                        console.log(errors)
                        dispatch(userActions.setErrors(errors.status.errors));
                    });
                };
            })
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]))
        }
    }, [dispatch])

    return (
        <main>
            <section className="user-form" id="change-password">
                <h1>Change Password</h1>
                {errors.length > 0 ? <div id="errors">{errors}</div> : null}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="old_password"
                        aria-label="Old password"
                        onChange={handlePasswordChange}
                        value={passwordForm.old_password}
                        placeholder="Old password"
                        required={true}
                    />
                    <input
                        type="password"
                        name="password"
                        aria-label="New password"
                        onChange={handlePasswordChange}
                        value={passwordForm.password}
                        placeholder="New password"
                        required={true}
                    />
                    <input
                        type="password"
                        name="password_confirmation"
                        aria-label="Confirm new password"
                        onChange={handlePasswordChange}
                        value={passwordForm.password_confirmation}
                        placeholder="Confirm new password"
                        required={true}
                    />
                    <input type="submit" aria-label="Submit button" />
                </form>
            </section>
        </main>
    );
};

export default ChangePassword;