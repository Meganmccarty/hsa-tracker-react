import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { receiptActions } from '../store/receiptSlice';
import getAPIurl from '../functions/url';

import styles from './Header.module.css';

function Header() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);

    function handleLogout() {
        toggleNavBar();
        fetch(`${getAPIurl()}/logout`, {
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

    function toggleNavBar() {
        const nav = document.querySelector("nav");
        if (nav.className === styles.navbar) {
            nav.classList.add(styles.responsive)
        } else {
            nav.className = styles.navbar
        }
    }

    return (
        <nav className={styles.navbar}>
            <Link className={styles.home} onClick={toggleNavBar} to="/">HSA Tracker</Link>
            <div className={styles.mainLinks}>
                <Link onClick={toggleNavBar} to="/about-hsas">About HSAs</Link>
                {user ?
                    <>
                        <Link onClick={toggleNavBar} to="/receipt-records">My Receipts</Link>
                        <Link onClick={toggleNavBar} to="/receipt-records/new">Add Receipt</Link>
                        <Link onClick={toggleNavBar} to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                    :
                    <>
                        <Link onClick={toggleNavBar} to="/login">Login</Link>
                        <Link onClick={toggleNavBar} to="/signup">Sign Up</Link>
                    </>
                }
            </div>
            <Link to="#" className={styles.icon} aria-label="Open the menu" onClick={toggleNavBar}>
                <i className="fa fa-bars" aria-hidden={true}></i>
            </Link>
        </nav>
    );
};

export default Header;