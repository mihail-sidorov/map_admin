import React from 'react';
import PointContainer from './Point/PointContainer';
import { Redirect } from 'react-router-dom';

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

class PointsClassComponent extends React.Component {
    componentDidMount() {
        if (!this.props.duplicate.point) {
            this.props.getPoints();
        }
    }

    render() {
        if (this.props.duplicate.point) {
            return (
                <Redirect to="/points/duplicate" />
            );
        }
        
        return (
            <Points {...this.props} />
        );
    }
}

export default PointsClassComponent;