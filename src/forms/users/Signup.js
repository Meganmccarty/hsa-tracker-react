import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/userSlice';

function Signup() {
    const history = useHistory();
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors)
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
            user: { ...formData }
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
                        console.log(user)
                        dispatch(userActions.userLogin(user.user));
                        dispatch(userActions.setMessage(user.status.message));
                        dispatch(userActions.toggleLoading(false));
                        history.push("/receipt-records")
                    })
                } else {
                    response.json().then(errors => {
                        console.log(errors);
                        dispatch(userActions.setErrors(errors.status.errors));
                        dispatch(userActions.toggleLoading(false));
                    })
                }
            })
    }

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors(""))
        }
    }, [])

    return (
        <>
            {errors ? <div id="errors">{errors}</div> : null}
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" onChange={handleFormChange} placeholder="First name" required={true}/>
                <input type="text" name="last_name" onChange={handleFormChange} placeholder="Last name" required={true}/>
                <input type="email" name="email" onChange={handleFormChange} placeholder="Email address" required={true}/>
                <input type="password" name="password" onChange={handleFormChange} placeholder="Password" required={true}/>
                <input type="password" name="password_confirmation" onChange={handleFormChange} placeholder="Confirm password" required={true}/>
                <input type="submit" />
            </form>
        </>
    );
};

export default Signup;