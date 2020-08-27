import React from 'react';

let Point = (props) => {
    console.log('Point>>>');

    let onDelPoint = () => {
        if (window.confirm('Вы действительно хотите удалить точку?')) {
            props.delPoint(props.point.id);
        }
    }

    return (
        <div point-id={props.point.id} className="point">
            <span className="point__city">{props.point.city}</span>
            <span className="point__name">{props.point.name}</span>
            <span className="point__long">{props.point.long}</span>
            <span className="point__lat">{props.point.lat}</span>
            <button className="point__edit-button">Редактировать</button>
            <button className="point__del-button" onClick={onDelPoint}>Удалить</button>
        </div>
    );
}

export default Point;