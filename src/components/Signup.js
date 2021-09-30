import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';

function Signup() {
    const dispatch = useDispatch();
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
        const user = {
            user: {...formData}
        }
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        };
        fetch("/signup", configObj)
            .then(response => {
                if (response.ok) {
                    localStorage.setItem("token", response.headers.get("Authorization"));
                    response.json().then(user => {
                        dispatch(userActions.userLogin(user));
                        dispatch(userActions.toggleLoading(false));
                    })
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors));
                        dispatch(userActions.toggleLoading(false));
                    })
                }
            })
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