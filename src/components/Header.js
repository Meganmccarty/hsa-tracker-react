import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { receiptActions } from '../store/receiptSlice';
import './Header.css';

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

    function toggleNavBar(e) {
        const nav = document.querySelector(".navbar");
        if (nav.className === "navbar") {
            nav.classList.add("responsive")
        } else {
            nav.className = "navbar"
        }
    }

    return (
        <nav className="navbar">
            <Link className="home" to="/">HSA Tracker</Link>
            <div className="main-links">
                {user ?
                    <>
                        <Link to="/receipt-records">My Receipt Records</Link>
                        <Link to="/receipt-records/new">Add Receipt</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                    :
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                }
            </div>
            <Link to="#" className="icon" aria-label="Open the menu" onClick={toggleNavBar}>
                <i className="fa fa-bars" aria-hidden={true}></i>
            </Link>
        </nav>
    );
};

export default Header;