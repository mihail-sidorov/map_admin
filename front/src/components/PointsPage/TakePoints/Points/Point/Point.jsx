import React from 'react';

let Point = (props) => {
    return (
        <div className="point__container">
            <div className="point__inform" key={1}>
                <span className="point__isActive">Активна</span>&nbsp;/&nbsp;
                <span className="point__moder-status">Допущена к публикации</span>
            </div>
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

                <div className="point__description">
                    апавппа воаовоа воаровро ававраовра врарвоарва апавппа воаовоа воаровро ававраовра врарвоарва апавппа воаовоа воаровро ававраовра врарвоарва
                </div>
            </div>
        </div>
    );
}

export default Point;