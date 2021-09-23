import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { onLogin } from '../store/userSlice';

function Login() {
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors);
    const user = useSelector(state => state.user.user);

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

    console.log("User: ", user);
    console.log("Errors: ", errors);

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleFormChange} placeholder="Email address" />
            <input type="password" name="password" onChange={handleFormChange} placeholder="Password" />
            <input type="submit" />
        </form>
    );
};

export default Login;