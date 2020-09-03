import React from 'react';
import LoginContainer from './Login/LoginContainer';
import { Route, Redirect, Switch } from 'react-router-dom';
import PointsPage from './PointsPage/PointsPage';
import HeaderContainer from './Header/HeaderContainer';

function App() {
    return (
        <div className="container">
            <HeaderContainer />
            <Switch>
                <Redirect exact from="/" to="/login" />
                <Route path="/login" render={() => <LoginContainer />} />
                <Route path="/points" render={() => <PointsPage />} />
            </Switch>
        </div>
    );
}

export default App;
