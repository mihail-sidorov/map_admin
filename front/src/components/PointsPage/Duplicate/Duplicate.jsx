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
            <div className="duplicate__add-point list__item" key={1}>
                <PointProperties point={props.duplicate.point} permission={props.permission} />
                <button className="duplicate__add-point-accept-btn list__item-btn list__item-btn_accept list__item-btn_2" onClick={() => {
                    props.addEditPoint(props.action);
                }}></button>
                <button className="duplicate__add-point-refuse-btn list__item-btn list__item-btn_refuse" onClick={() => {
                    props.cansel();
                }}></button>
            </div>
        );
    }

    if (props.duplicate.points) {
        props.duplicate.points.forEach((point, index) => {
            points.push(
                <div className="duplicate__point list__item" key={index}>
                    <PointProperties point={point} permission={props.permission} />
                </div>
            );
        });
    }

    return (
        <div className="duplicate">
            <h2 className="duplicate__title">Найдены похожие точки</h2>
            <div className="duplicate__list list">
                {point}
                
                {points}
            </div>
        </div>
    );
}

export default Duplicate;