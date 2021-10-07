import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice';

import '../user-forms.css';

function EditProfile() {
    const history = useHistory();

    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.user);
    const errors = useSelector(state => state.user.errors);

    const [profileForm, setProfileForm] = useState({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email
    })

    function handleProfileChange(e) {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault();
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileForm)
        };
        fetch("/profile", configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        dispatch(userActions.updateUser(user.user));
                        dispatch(userActions.setMessage(user.status.message))
                        history.push("/profile")
                    });
                } else {
                    response.json().then(errors => {
                        console.log(errors.status.errors)
                        dispatch(userActions.setErrors(errors.status.errors));
                    });
                };
            });
    };

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setErrors([]))
        }
    }, [dispatch])

    return (
        <main>
            <section className="user-form" id="edit-profile">
                <h1>Edit Profile</h1>
                {errors.length > 0 ? <div id="errors">{errors}</div> : null}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="first_name"
                        aria-label="First name"
                        onChange={handleProfileChange}
                        value={profileForm.first_name}
                        placeholder="First name"
                        required={true}
                    />
                    <input
                        type="text"
                        name="last_name"
                        aria-label="Last name"
                        onChange={handleProfileChange}
                        value={profileForm.last_name}
                        placeholder="Last name"
                        required={true}
                    />
                    <input
                        type="email"
                        name="email"
                        aria-label="Email address"
                        onChange={handleProfileChange}
                        value={profileForm.email}
                        placeholder="Email address"
                        required={true}
                    />
                    <input type="submit" aria-label="Submit button" />
                    <Link to="/profile" className="cancel">Cancel</Link>
                </form>
            </section>
        </main>
    );
};

export default EditProfile;