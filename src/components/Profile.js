import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Profile() {
    const user = useSelector(state => state.user.user);

    return (
        <>
            <h1>Profile Page for {user.first_name} {user.last_name}</h1>
            <table>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{user.first_name} {user.last_name}</td>
                    </tr>
                    <tr>
                        <td>Email Address</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td>********</td>
                    </tr>
                </tbody>
            </table>
            <button><Link to={`/profile/${user.id}/edit`}>Edit Profile</Link></button>
            <button><Link to={`/profile/${user.id}/change-password`}>Change Password</Link></button>
        </>
    )
};

export default Profile;