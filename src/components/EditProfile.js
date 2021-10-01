import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';

function EditProfile() {
    const history = useHistory();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.user)
    const [profileForm, setProfileForm] = useState({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email
    })

    function handleProfileChange(e) {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value})
    }

    console.log(profileForm);

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
                        console.log("Fetching user after patch to /profile: ", user)
                        dispatch(userActions.updateUser(user));
                        history.push("/profile")
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors));
                    });
                };
            });
    };

    return (
        <>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    onChange={handleProfileChange}
                    value={profileForm.first_name}
                    placeholder="First name"
                />
                <input
                    type="text"
                    name="last_name"
                    onChange={handleProfileChange}
                    value={profileForm.last_name}
                    placeholder="Last name"
                
                />
                <input
                    type="email"
                    name="email"
                    onChange={handleProfileChange}
                    value={profileForm.email}
                    placeholder="Email address"
                />
                <input type="submit" />
            </form>
        </>
    );
};

export default EditProfile;