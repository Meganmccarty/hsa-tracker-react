import { useSelector, useDispatch } from 'react-redux';
import { onLogout } from '../store/userSlice';

import { Link } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch();
    const errors = useSelector(state => state.user.errors);
    const user = useSelector(state => state.user.user);

    function handleLogout() {
        dispatch(onLogout());
    };

    console.log("user: ", user);
    console.log("errors: ", errors);
    
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