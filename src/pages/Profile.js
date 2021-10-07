import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/userSlice';

import './Profile.css';

function Profile() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const message = useSelector(state => state.user.message);

    useEffect(() => {
        return function cleanup() {
            dispatch(userActions.setMessage(""));
        };
    }, [dispatch]);

    return (
        <main id="profile">
            <section>
                <h1>Profile Page for {user.first_name} {user.last_name}</h1>
                {message ? <div id="message">{message}</div> : null}
                <div className="details">
                    <span>Name: </span>
                    <span>{user.first_name} {user.last_name}</span>
                </div>
                <div className="details">
                    <span>Email address: </span>
                    <span>{user.email}</span>
                </div>
                <div className="details">
                    <span>Password: </span>
                    <span>********</span>
                </div>
                <div className="buttons">
                    <button><Link to={`/profile/${user.id}/edit`}>Edit Profile</Link></button>
                    <button><Link to={`/profile/${user.id}/change-password`}>Change Password</Link></button>
                </div>
            </section>
        </main>
    )
};

export default Profile;