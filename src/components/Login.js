import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onLogin } from '../store/userSlice';

function Login() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function handleFormChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(onLogin(formData));
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