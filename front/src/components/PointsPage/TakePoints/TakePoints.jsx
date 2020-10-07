import React from 'react';
import modalWindowHOC from '../../../HOC/modalWindowHOC';

let TakePoints = (props) => {
    return(
        <div className="take-points">
            Взять точки
        </div>
    );
}

let TakePointsModalWindow = (props) => {
    return (
        modalWindowHOC(TakePoints, props, props.takePoints.open, props.onCloseTakePoints, true, 'Взять точки')
    );
}

export default TakePointsModalWindow;