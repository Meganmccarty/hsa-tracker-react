import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Footer from './Footer';

function App() {
    const [user, setUser] = useState(null);

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

    function handleLogin(user) {
        setUser(user);
    };
    
    function handleLogout() {
        setUser(null);
    };

    console.log(user)

    return (
        <Router>
            <Header user={user} onLogout={handleLogout}/>
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route exact path="/login"><Login onLogin={handleLogin}/></Route>
                <Route exact path="/signup"><Signup /></Route>
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
