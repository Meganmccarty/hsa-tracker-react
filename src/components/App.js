import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../store/userSlice';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Footer from './Footer';

function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    
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
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/login"><Login /></Route>
                <Route exact path="/signup"><Signup /></Route>
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
