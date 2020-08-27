import React from 'react';
import authHOC from '../../HOC/authHOC';
import SearchPointsContainer from './SearchPoints/SearchPointsContainer';
import PointsContainer from './Points/PointsContainer';
import PaginationContainer from './Pagination/PaginationContainer';
import AddEditPointFormContainer from './AddEditPointForm/AddEditPointFormContainer';

let PointsPage = (props) => {
    return (
        <div className="points-page">
            <SearchPointsContainer />
            <PointsContainer />
            <AddEditPointFormContainer />
            <PaginationContainer />
        </div>
    );
}

//PointsPage = authHOC(PointsPage);

export default PointsPage;