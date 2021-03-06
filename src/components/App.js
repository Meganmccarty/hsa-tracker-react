import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import getAPIurl from '../functions/url';

import Header from './Header';
import Home from '../pages/Home';
import AboutHSAs from '../pages/AboutHSAs';
import Login from '../forms/users/Login';
import ForgotPassword from '../forms/passwords/ForgotPassword';
import PasswordReset from '../forms/passwords/PasswordReset';
import Signup from '../forms/users/Signup';
import Profile from '../pages/Profile';
import EditProfile from '../forms/users/EditProfile';
import ChangePassword from '../forms/passwords/ChangePassword';
import ReceiptRecordList from '../pages/ReceiptRecordList';
import ReceiptRecordDetail from '../pages/ReceiptRecordDetail';
import ReceiptRecordEdit from '../forms/receipts/ReceiptRecordEdit';
import ReceiptRecordForm from '../forms/receipts/ReceiptRecordForm';
import Footer from './Footer';

import Loading from './Loading';

import styles from './App.module.css';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const loading = useSelector(state => state.user.loading);

    useEffect(() => {
        fetch(`${getAPIurl()}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        dispatch(userActions.userLogin(user.user));
                        dispatch(userActions.toggleLoading(false));
                    });
                } else {
                    dispatch(userActions.toggleLoading(false));
                };
            });
    }, [dispatch]);

    return (
        <Router>
            <Header />
            <main className={styles.mainContainer}>
                <Switch>
                    <Route exact path="/"><Home /></Route>
                    <Route exact path="/about-hsas"><AboutHSAs /></Route>
                    <Route exact path="/login">
                        {loading ? <Loading /> : !user ? <Login /> : <Redirect to="/receipt-records" />}
                    </Route>
                    <Route exact path="/forgot-password">
                        {loading ? <Loading /> : !user ? <ForgotPassword /> : <Redirect to="/profile" />}
                    </Route>
                    <Route exact path="/reset-password/email=:email">
                        {loading ? <Loading /> : !user ? <PasswordReset /> : <Redirect to="/profile" />}
                    </Route>
                    <Route exact path="/signup">
                        {loading ? <Loading /> : !user ? <Signup /> : <Redirect to="/receipt-records" />}
                    </Route>
                    <Route exact path="/profile">
                        {loading ? <Loading /> : user ? <Profile /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/profile/:id/edit">
                        {loading ? <Loading /> : user ? <EditProfile /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/profile/:id/change-password">
                        {loading ? <Loading /> : user ? <ChangePassword /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/receipt-records/new">
                        {loading ? <Loading /> : user ? <ReceiptRecordForm /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/receipt-records/:id/edit">
                        {loading ? <Loading /> : user ? <ReceiptRecordEdit /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/receipt-records/:id">
                        {loading ? <Loading /> : user ? <ReceiptRecordDetail /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/receipt-records">
                        {loading ? <Loading /> : !user ? <Redirect to="/login" /> : <ReceiptRecordList />}
                    </Route>
                </Switch>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
