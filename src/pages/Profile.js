import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/userSlice';

import styles from './Profile.module.css';

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
        <section className={styles.profile}>
            <h1>Profile Page for {user.first_name} {user.last_name}</h1>
            {message ? <div className={styles.message}>{message}</div> : null}
            <div className={styles.details}>
                <span className={styles.bold}>Name: </span>
                <span>{user.first_name} {user.last_name}</span>
            </div>
            <div className={styles.details}>
                <span className={styles.bold}>Email address: </span>
                <span>{user.email}</span>
            </div>
            <div className={styles.details}>
                <span className={styles.bold}>Password: </span>
                <span>********</span>
            </div>
            <div className={styles.buttons}>
                <Link className={styles.blue} to={`/profile/${user.id}/edit`}>Edit Profile</Link>
                <Link className={styles.blue} to={`/profile/${user.id}/change-password`}>Change Password</Link>
            </div>
        </section>
    )
};

export default Profile;