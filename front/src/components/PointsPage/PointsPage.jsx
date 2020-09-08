import React from 'react';
import SearchPointsContainer from './SearchPoints/SearchPointsContainer';
import PointsContainer from './Points/PointsContainer';
import PaginationContainer from './Pagination/PaginationContainer';
import AddEditPointFormContainer from './AddEditPointForm/AddEditPointFormContainer';
import DuplicateContainer from './Duplicate/DuplicateContainer';
import { Route, Redirect } from 'react-router-dom';

let PointsPage = (props) => {
    if (props.permission !== 'moder' && props.permission !== 'user') return <Redirect to="/" />

    return (
        <div className="points-page">
            <Route exact path="/points" render={() => <SearchPointsContainer />} />
            <Route exact path="/points" render={() => <PointsContainer permission={props.permission} />} />
            <Route exact path="/points/duplicate" render={() => <DuplicateContainer permission={props.permission} />} />
            <Route exact path="/points" render={() => <AddEditPointFormContainer permission={props.permission} />} />
            <Route exact path="/points" render={() => <PaginationContainer />} />
        </div>
    );
}

export default PointsPage;