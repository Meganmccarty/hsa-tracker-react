import { useState } from 'react';
import CSRFToken from './cookies';

function Signup({ onLogin }) {
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
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": CSRFToken(document.cookie)
            },
            body: JSON.stringify(formData)
        };
        fetch("/signup", configObj)
            .then(response => response.json())
            .then(data => onLogin(data))
            .catch(errors => console.log(errors))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="first_name" onChange={handleFormChange} placeholder="First name" />
            <input type="text" name="last_name" onChange={handleFormChange} placeholder="Last name" />
            <input type="email" name="email" onChange={handleFormChange} placeholder="Email address" />
            <input type="password" name="password" onChange={handleFormChange} placeholder="Password" />
            <input type="password" name="password_confirmation" onChange={handleFormChange} placeholder="Confirm password" />
            <input type="submit" />
        </form>
    );
};

export default Signup;