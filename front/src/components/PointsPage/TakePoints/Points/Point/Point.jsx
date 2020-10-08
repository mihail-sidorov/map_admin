import React from 'react';

let Point = (props) => {
    let pointInform = [], moderStatus = '';
    if (props.point.moder_status === 'moderated') moderStatus = 'На модерации';
    if (props.point.moder_status === 'refuse') moderStatus = 'Отклонено';
    if (props.point.moder_status === 'accept') moderStatus = 'Допущена к публикации';
    if (props.point.moder_status === 'delete') moderStatus = 'На удалении';
    if (props.point.moder_status === 'take') moderStatus = 'Ожидает подтверждение взятия';
    if (props.point.moder_status === 'return') moderStatus = 'Ожидает подтверждение отдачи';

    pointInform.push(
        <div className="point__inform" key={1}>
            <span className="point__isActive">{props.point.isActive ? 'Активна' : 'Не активна'}</span>&nbsp;/&nbsp;
            <span className="point__moder-status">{moderStatus}</span>
        </div>
    );

    let pointDescription = [];
    if (props.point.description) {
        pointDescription.push(
            <div className="point__description" key={1}>
                {props.point.description}
            </div>
        );
    }

    return (
        <div className="point__container">
            {pointInform}

            <div point-id={props.point.id} className="point list__item">
                <span className="point__properties">
                    <span className="point__full-city-name">{props.point.full_city_name}</span>
                    <span className="point__street">{props.point.street}</span>
                    <span className="point__house">{props.point.house}</span>
                    <span className="point__apartment">{props.point.apartment}</span>
                    <span className="point__lng">{props.point.lng}</span>
                    <span className="point__lat">{props.point.lat}</span>
                    <span className="point__title">{props.point.title}</span>
                    <span className="point__hours">{props.point.hours}</span>
                    <span className="point__phone">{props.point.phone}</span>
                    <span className="point__site">{props.point.site}</span>
                </span>

                <button className="point__take-button list__item-btn list__item-btn_take" onClick={() => {
                    props.onTakePoint(props.point.id);
                }}></button>

                {pointDescription}
            </div>
        </div>
    );
}

export default Point;