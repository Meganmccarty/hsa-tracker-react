import { useSelector } from 'react-redux';

function Profile() {
    const user = useSelector(state => state.user.user);

    return <h1>Profile Page for {user.first_name} {user.last_name}</h1>
};

export default Profile;