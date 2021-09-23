import { useSelector, useDispatch } from 'react-redux';
import { onLogout } from '../store/userSlice';

import { Link } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    function handleLogout() {
        dispatch(onLogout());
    };
    
    return (
        <nav>
            <Link to="/">HSA Tracker</Link>
            {user ? 
                <button onClick={handleLogout}>Log Out</button>
            : <>
                <button>
                    <Link to="/login">Login</Link>
                </button>
                <button>
                    <Link to="/signup">Signup</Link>
                </button></>
            }
        </nav>
    );
};

export default Header;