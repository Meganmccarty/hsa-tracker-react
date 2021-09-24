import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../store/userSlice';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import ReceiptRecordsList from './ReceiptRecordsList';
import ReceiptRecordDetail from './ReceiptRecordDetail';
import ReceiptRecordForm from './ReceiptRecordForm';
import Footer from './Footer';

import Loading from './Loading';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const loading = useSelector(state => state.user.loading);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch])

    console.log("User: ", user)

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
