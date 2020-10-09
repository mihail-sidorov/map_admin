import React from 'react';
import modalWindowHOC from '../../../HOC/modalWindowHOC';
import PaginationContainer from './Pagination/PaginationContainer';
import PointsContainer from './Points/PointsContainer';
import SearchContainer from './Search/SearchContainer';

let TakePoints = (props) => {
    return(
        <div className="take-points">
            <SearchContainer />
            <PointsContainer />
            <PaginationContainer />
        </div>
    );
}

let TakePointsModalWindow = (props) => {
    return (
        modalWindowHOC(TakePoints, props, props.takePoints.open, props.onCloseTakePoints, true, 'Взять точки')
    );
}

export default TakePointsModalWindow;