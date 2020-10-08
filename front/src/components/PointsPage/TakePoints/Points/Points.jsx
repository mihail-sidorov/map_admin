import React from 'react';
import PointContainer from './Point/PointContainer';

let Points = (props) => {
    let pointsArr = [];

    for (let id in props.points) {
        let Point = PointContainer(id);
        pointsArr.push(<Point key={id} permission={props.permission} />);
    }

    return (
        <div className="points list">
            {pointsArr}
        </div>
    );
}

export default Points;