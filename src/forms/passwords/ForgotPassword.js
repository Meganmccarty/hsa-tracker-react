import { useState } from 'react';

function ForgotPassword() {
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
                        console.log(data)
                    });
                }
            });

    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleEmailChange} placeholder="Email address" />
            <input type="submit" />
        </form>
    )
};

export default ForgotPassword;