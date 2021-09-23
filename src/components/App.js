import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Footer from './Footer';

function App() {
    useEffect(() => {
        fetch("/profile")
            .then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        setUser(user);
                    });
                }
            })
    }, [])

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
