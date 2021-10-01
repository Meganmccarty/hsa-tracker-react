import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';

function ChangePassword() {
    const history = useHistory();
    const dispatch = useDispatch();
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
                        console.log("Fetching user after patch to /change-password: ", user)
                        dispatch(userActions.updateUser(user));
                        history.push("/profile")
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors));
                    });
                };
            })
    }

    return (
        <>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="old_password"
                    onChange={handlePasswordChange}
                    value={passwordForm.old_password}
                    placeholder="Old password"
                />
                <input
                    type="password"
                    name="password"
                    onChange={handlePasswordChange}
                    value={passwordForm.password}
                    placeholder="New password"
                />
                <input
                    type="password"
                    name="password_confirmation"
                    onChange={handlePasswordChange}
                    value={passwordForm.password_confirmation}
                    placeholder="Confirm new password"
                />
                <input type="submit" />
            </form>
        </>
    );
};

export default ChangePassword;