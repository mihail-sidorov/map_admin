import React from 'react';
import LoginContainer from './Login/LoginContainer';
import { Route } from 'react-router-dom';
import PointsPage from './PointsPage/PointsPage';
import HeaderContainer from './Header/HeaderContainer';

function App() {
    return (
        <div className="container">
            <HeaderContainer />
            <Route path="/login" render={() => <LoginContainer />} />
            <Route path="/points" render={
                () => {
                    return (
                        <PointsPage />
                    );
                }
            } />
        </div>
    );
}

export default App;
