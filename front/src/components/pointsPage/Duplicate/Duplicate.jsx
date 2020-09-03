import React from 'react';
import { Redirect } from 'react-router-dom';
import { PointProperties } from '../Points/Point/Point';

let Duplicate = (props) => {
    let point = [];
    let points = [];

    if (!props.duplicate.point) {
        return (
            <Redirect to="/points" />
        );
    }

    if (props.duplicate.point) {
        point.push(
            <div className="duplicate__add-point" key={1}>
                <PointProperties point={props.duplicate.point} />
                <button className="duplicate__add-point-accept-btn">Добавить</button>
                <button className="duplicate__add-point-refuse-btn" onClick={() => {
                    props.cansel();
                }}>Отмена</button>
            </div>
        );
    }

    if (props.duplicate.points) {
        props.duplicate.points.forEach((point, index) => {
            points.push(
                <div className="duplicate__point" key={index}>
                    <PointProperties point={point} />
                </div>
            );
        });
    }

    return (
        <div className="duplicate">
            {point}
            <hr />
            <div className="duplicate__points">
                {points}
            </div>
        </div>
    );
}

export default Duplicate;