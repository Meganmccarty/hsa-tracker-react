import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { receiptActions } from '../store/receiptSlice';
import './Header.css';

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

    function toggleNavBar(e) {
        const nav = e.target.parentElement.parentElement;
        if (nav.className === "navbar") {
            nav.classList.add("responsive")
        } else {
            nav.className = "navbar"
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to="/">HSA Tracker</Link>
                {user ?
                    <>
                        <Link to="/receipt-records">My Receipt Records</Link>
                        <Link to="/receipt-records/new">Add Receipt</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="#" onClick={handleLogout}>Log Out</Link>
                        <Link to="#" className="icon" onClick={toggleNavBar}><i className="fa fa-bars"></i></Link>
                    </>
                    :
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                        <Link to="#" className="icon" onClick={toggleNavBar}><i className="fa fa-bars"></i></Link>
                    </>
                }
            </nav>
            {handleMessages()}
        </>
    );
};

export default Header;