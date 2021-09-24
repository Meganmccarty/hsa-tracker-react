import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions, fetchProfile } from '../store/userSlice';
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

import loadingGIF from '../loading.gif';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const loading = useSelector(state => state.user.loading);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(userActions.toggleLoading(false));
    }, [dispatch])

    console.log("User: ", user)

    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/login">
                    {/* {!user ? <Login /> : <Redirect to="/receipt-records" />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : !user ? <Login /> : <Redirect to="/receipt-records" />}
                </Route>
                <Route exact path="/signup">
                    {/* {!user ? <Signup /> : <Redirect to="/receipt-records" />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : !user ? <Signup /> : <Redirect to="/receipt-records" />}
                </Route>
                <Route exact path="/profile">
                    {/* {user ? <Profile /> : <Redirect to="/login" />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : user ? <Profile /> : <Redirect to="/login" />}
                </Route>
                <Route path="/receipt-records/new">
                    {/* {user ? <ReceiptRecordForm /> : <Redirect to="/login" />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : user ? <ReceiptRecordForm /> : <Redirect to="/login" />}
                </Route>
                <Route path="/receipt-records/:id">
                    {/* {user ? <ReceiptRecordDetail /> : <Redirect to="/login" />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : user ? <ReceiptRecordDetail /> : <Redirect to="/login" />}
                </Route>
                <Route exact path="/receipt-records">
                    {/* {!user ? <Redirect to="/login" /> : <ReceiptRecordsList />} */}
                    {loading ? <img src={loadingGIF} alt="Loading..." width="25%" /> : !user ? <Redirect to="/login" /> : <ReceiptRecordsList />}
                </Route>
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
