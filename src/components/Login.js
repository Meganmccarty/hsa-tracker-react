import { useState } from 'react';
import CSRFToken from './cookies';

function Login({ onLogin }) {
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
            .then(response => response.json())
            .then(data => onLogin(data))
            .catch(errors => console.log(errors))
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