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
            <span className="point__lng">{props.point.lng}</span>
            <span className="point__lat">{props.point.lat}</span>
            <span className="point__title">{props.point.title}</span>
            <span className="point__hours">{props.point.hours}</span>
            <span className="point__phone">{props.point.phone}</span>
            <span className="point__site">{props.point.site}</span>
            <button className="point__edit-button">Редактировать</button>
            <button className="point__del-button" onClick={onDelPoint}>Удалить</button>
            <div className="point__description">
                {props.point.description}
            </div>
        </div>
    );
}

export default Point;