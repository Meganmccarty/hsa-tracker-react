import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PasswordReset() {
    const email = useParams().email;
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
                        console.log(data)
                    });
                }
            });
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]))
            dispatch(userActions.setMessage(""))
        }
    }, [dispatch])

    return (
        <main>
            <section id="password-reset">
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="token"
                        aria-label="Reset code"
                        onChange={handlePasswordChange}
                        placeholder="Reset code"
                    />
                    <input
                        type="password"
                        name="password"
                        aria-label="New password"
                        onChange={handlePasswordChange}
                        placeholder="New password"
                    />
                    <input
                        type="password"
                        name="password_confirmation"
                        aria-label="Confirm new password"
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                    />
                    <input type="submit" aria-label="Submit button" />
                </form>
            </section>
        </main>
    );
}
export default PasswordReset;