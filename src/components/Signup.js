import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUser } from '../store/userSlice';

function Signup() {
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors);
    const user = useSelector(state => state.user.user);

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
        dispatch(createUser(formData))
    }

    console.log("User: ", user);
    console.log("Errors: ", errors);

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