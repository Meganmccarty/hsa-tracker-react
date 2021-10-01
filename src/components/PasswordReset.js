import { useState } from 'react';
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

    console.log(passwordForm);

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

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="token" onChange={handlePasswordChange} placeholder="Reset code" />
            <input type="password" name="password" onChange={handlePasswordChange} placeholder="New password" />
            <input type="password" name="password_confirmation" onChange={handlePasswordChange} placeholder="Confirm new password" />
            <input type="submit" />
        </form>
    );
}
export default PasswordReset;