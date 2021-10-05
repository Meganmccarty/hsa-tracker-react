import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { receiptActions } from '../store/receiptSlice';

import { Link, useHistory } from 'react-router-dom';

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const userMessage = useSelector(state => state.user.message);
    const receiptMessage = useSelector(state => state.receipts.message);

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

    function handleMessages() {
        if (userMessage || receiptMessage) {
            setTimeout(() => {
                dispatch(userActions.setMessage(""));
                dispatch(receiptActions.setMessage(""));
            }, 3000)
            return (
                <div>
                    {userMessage ? <span>{userMessage}</span> : null}
                    {receiptMessage ? <span>{receiptMessage}</span> : null}
                </div>
            )
        }
    }

    return (
        <nav>
            {handleMessages()}
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