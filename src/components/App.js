import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import ReceiptRecordsList from './ReceiptRecordsList';
import ReceiptRecordDetail from './ReceiptRecordDetail';
import ReceiptRecordEdit from './ReceiptRecordEdit';
import ReceiptRecordForm from './ReceiptRecordForm';
import Footer from './Footer';

import Loading from './Loading';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const loading = useSelector(state => state.user.loading);

    useEffect(() => {
        fetch("/profile")
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        dispatch(userActions.userLogin(user));
                        dispatch(userActions.toggleLoading(false));
                    });
                } else {
                    response.json().then(errors => {
                        dispatch(userActions.setErrors(errors))
                        dispatch(userActions.toggleLoading(false));
                    });
                };   
            });
    }, [dispatch]);

    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/login">
                    {loading ? <Loading /> : !user ? <Login /> : <Redirect to="/receipt-records" />}
                </Route>
                <Route exact path="/signup">
                    {loading ? <Loading /> : !user ? <Signup /> : <Redirect to="/receipt-records" />}
                </Route>
                <Route exact path="/profile">
                    {loading ? <Loading /> : user ? <Profile /> : <Redirect to="/login" />}
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
                    {loading ? <Loading /> : !user ? <Redirect to="/login" /> : <ReceiptRecordsList />}
                </Route>
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
