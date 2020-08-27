import React from 'react';
import authHOC from '../../HOC/authHOC';
import SearchPointsContainer from './SearchPoints/SearchPointsContainer';
import PointsContainer from './Points/PointsContainer';
import PaginationContainer from './Pagination/PaginationContainer';

let PointsPage = (props) => {
    return (
        <div className="points-page">
            <SearchPointsContainer />
            <PointsContainer />
            <PaginationContainer />
        </div>
    );
}

//PointsPage = authHOC(PointsPage);

export default PointsPage;