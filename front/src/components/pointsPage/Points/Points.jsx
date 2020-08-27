import React from 'react';
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
            <button className="points__add-point-btn" onClick={() => {
                props.showAddEditPointForm('add');
            }}>Добавить</button>
            
            {pointsArr}
        </div>
    );
}

export default Points;