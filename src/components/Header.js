import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { receiptActions } from '../store/receiptSlice';

import { Link, useHistory } from 'react-router-dom';

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    function handleLogout() {
        fetch("/logout", {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem("token");
            dispatch(receiptActions.clearReceipts())
            dispatch(userActions.setMessage(data.status.message))
            dispatch(userActions.userLogout())
            history.push("/login")
        })
    };

    return (
        <nav>
            <Link to="/">HSA Tracker</Link>
            {user ?
                <>
                    <button>
                        <Link to="/receipt-records">My Receipt Records</Link>
                    </button>
                    <button>
                        <Link to="/receipt-records/new">Add Receipt</Link>
                    </button>
                    <button>
                        <Link to="/profile">Profile</Link>
                    </button>
                    <button onClick={handleLogout}>Log Out</button>
                </>
                :
                <>
                    <button>
                        <Link to="/login">Login</Link>
                    </button>
                    <button>
                        <Link to="/signup">Signup</Link>
                    </button>
                </>
            }
        </nav>
    );
};

export default Header;