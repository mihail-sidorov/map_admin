import React from 'react';
import AddEditFormContainer from '../AddEditForm/AddEditFormContainer';
import PointContainer from './Point/PointContainer';


let Points = (props) => {
    console.log('Points>>>');

    let pointsArr = [];

    for (let id in props.points) {
        let Point = PointContainer(id);
        pointsArr.push(<Point key={id}/>);
    }

    return (
        <div className="points">
            {pointsArr}
        </div>
    );
}

export default Points;