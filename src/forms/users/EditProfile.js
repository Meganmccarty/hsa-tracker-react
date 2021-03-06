import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice';
import getAPIurl from '../../functions/url';

import styles from '../auth-forms.module.css';

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
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify(profileForm)
        };
        fetch(`${getAPIurl()}/profile`, configObj)
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        dispatch(userActions.updateUser(user.user));
                        dispatch(userActions.setMessage(user.status.message))
                        history.push("/profile")
                    });
                } else {
                    response.json().then(errors => {
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
        <section className={styles.authForm}>
            <h1>Edit Profile</h1>
            {errors.length > 0 ? <div className={styles.errors}>{errors}</div> : null}
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
                <Link className={styles.cancel} to="/profile">Cancel</Link>
            </form>
        </section>
    );
};

export default EditProfile;