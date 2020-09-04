import React from 'react';
import LoginContainer from './Login/LoginContainer';
import { Route, Redirect, Switch } from 'react-router-dom';
import HeaderContainer from './Header/HeaderContainer';
import AdminPageContainer from './AdminPage/AdminPageContainer';
import PointsPageContainer from './PointsPage/PointsPageContainer';

function App() {
    return (
        <div className="container">
            <HeaderContainer />
            <Switch>
                <Redirect exact from="/" to="/login" />
                <Route path="/login" render={() => <LoginContainer />} />
                <Route path="/points" render={() => <PointsPageContainer />} />
                <Route path="/admin" render={() => <AdminPageContainer />} />
            </Switch>
        </div>
    );
}

export default App;
