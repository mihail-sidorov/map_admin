import React from 'react';
import authHOC from '../../HOC/authHOC';
import SearchPointsContainer from './SearchPoints/SearchPointsContainer';
import PointsContainer from './Points/PointsContainer';
import PaginationContainer from './Pagination/PaginationContainer';
import AddEditPointFormContainer from './AddEditPointForm/AddEditPointFormContainer';
import DuplicateContainer from './Duplicate/DuplicateContainer';
import { Route } from 'react-router-dom';

let PointsPage = (props) => {
    return (
        <div className="points-page">
            <Route exact path="/points" render={() => <SearchPointsContainer />} />
            <Route exact path="/points" render={() => <PointsContainer />} />
            <Route exact path="/points/duplicate" render={() => <DuplicateContainer />} />
            <Route exact path="/points" render={() => <AddEditPointFormContainer />} />
            <Route exact path="/points" render={() => <PaginationContainer />} />
        </div>
    );
}

PointsPage = authHOC(PointsPage);

export default PointsPage;