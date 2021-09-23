import { Link } from 'react-router-dom';
import CSRFToken from './cookies';

function Header({ user, onLogout }) {
    function handleLogout() {
        fetch("/logout", { method: "DELETE", headers: { "X-CSRF-Token": CSRFToken(document.cookie) } })
            .then(() => {
                onLogout()
            });
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