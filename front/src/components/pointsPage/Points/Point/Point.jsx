import React from 'react';

let Point = (props) => {
    console.log('Point>>>');

    let onDelPoint = () => {
        if (window.confirm('Вы действительно хотите удалить точку?')) {
            props.delPoint(props.point.id);
        }
    }

    let moderStatus = '';

    if (props.point.moder_status === 'moderated') moderStatus = 'На модерации';
    if (props.point.moder_status === 'refuse') moderStatus = 'Отклонено модератором';

    return (
        <div point-id={props.point.id} className="point">
            <div className="point__inform">
                <span className="point__isActive">{props.point.isActive ? 'Активна' : 'Не активна'}</span>***
                <span className="point__moder-status">{moderStatus}</span>
            </div>
            <span className="point__lng">{props.point.lng}</span>
            <span className="point__lat">{props.point.lat}</span>
            <span className="point__apartment">{props.point.apartment}</span>
            <span className="point__title">{props.point.title}</span>
            <span className="point__hours">{props.point.hours}</span>
            <span className="point__phone">{props.point.phone}</span>
            <span className="point__site">{props.point.site}</span>
            <button className="point__edit-button" onClick={() => {
                props.showAddEditPointForm('edit', props.point.id);
            }}>Редактировать</button>
            <button className="point__del-button" onClick={onDelPoint}>Удалить</button>
            <div className="point__description">
                {props.point.description}
            </div>
            <hr />
        </div>
    );
}

export default Point;