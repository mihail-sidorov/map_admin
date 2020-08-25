import React from 'react';
import LoginContainer from './Login/LoginContainer';
import { Route } from 'react-router-dom';
import PointsContainer from './pointsPage/Points/PointsContainer';
import AddEditFormContainer from './pointsPage/AddEditForm/AddEditFormContainer';
import PaginationContainer from './pointsPage/Pagination/PaginationContainer';
import SearchPointsContainer from './pointsPage/SearchPoints/SearchPointsContainer';
import PointsPage from './pointsPage/PointsPage';
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
