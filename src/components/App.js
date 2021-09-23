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
import Footer from './Footer';

import loadingGIF from '../loading.gif';

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
                    dispatch(userActions.toggleLoading(false));
                }
            })
    }, [dispatch])

    console.log("User: ", user)

    return (
        <Router>
            <Header />
            {loading ?
                <img src={loadingGIF} alt="Loading..." width="25%" />
                :
                <Switch>
                    <Route exact path="/"><Home /></Route>
                    <Route exact path="/login">
                        { !user ? <Login /> : <Redirect to="/receipt-records" />}
                    </Route>
                    <Route exact path="/signup">
                        { !user ? <Signup /> : <Redirect to="/receipt-records" />}
                    </Route>
                    <Route exact path="/profile">
                        { user ? <Profile /> : <Redirect to="/login" />}
                    </Route>
                    <Route exact path="/receipt-records">
                        { user ? <ReceiptRecordsList /> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            }
            <Footer />
        </Router>
    );
};

export default App;
