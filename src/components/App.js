import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">Hello, World!</Route>
                <Route exact path="/login"><Login /></Route>
                <Route exact path="/signup"><Signup /></Route>
            </Switch>
        </Router>
    );
};

export default App;
