import React from 'react';

export let PointProperties = (props) => {
    let properties = [];

    if (props.permission === 'user') {
        properties.push(
            <span className="point__properties" key={1}>
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
        );
    }

    if (props.permission === 'moder') {
        properties.push(
            <span className="point__properties" key={1}>
                <span className="point__full-city-name">{props.point.full_city_name}</span>
                <span className="point__street">{props.point.street}</span>
                <span className="point__house">{props.point.house}</span>
                <span className="point__apartment">{props.point.apartment}</span>
                <span className="point__title">{props.point.title}</span>
                <span className="point__hours">{props.point.hours}</span>
                <span className="point__phone">{props.point.phone}</span>
                <span className="point__site">{props.point.site}</span>
            </span>
        );
    }

    return (
        properties
    );
}

let Point = (props) => {
    console.log('Point>>>');

    let onDelPoint = () => {
        if (window.confirm('Вы действительно хотите удалить точку?')) {
            props.delPoint(props.point.id);
        }
    }

    let pointInform = [];
    if (props.permission === 'user') {
        let moderStatus = '';
        if (props.point.moder_status === 'moderated') moderStatus = 'На модерации';
        if (props.point.moder_status === 'refuse') moderStatus = 'Отклонено';
        if (props.point.moder_status === 'accept') moderStatus = 'Допущена к публикации';

        pointInform.push(
            <div className="point__inform" key={1}>
                <span className="point__isActive">{props.point.isActive ? 'Активна' : 'Не активна'}</span>***
                <span className="point__moder-status">{moderStatus}</span>
            </div>
        );
    }

    let delPointBtn = [];
    if (props.permission === 'user') {
        delPointBtn.push(<button className="point__del-button" onClick={onDelPoint} key={1}>Удалить</button>);
    }

    let refuseBtn = [];
    if (props.permission === 'moder') {
        refuseBtn.push(<button className="point__refuse-btn" key={1} onClick={() => {
            props.onRefusePoint(props.point.id, prompt('Введите комментарий для пользователя', ''));
        }}>Отклонить</button>);
    }

    return (
        <div point-id={props.point.id} className="point">
            {pointInform}
            
            <PointProperties point={props.point} permission={props.permission}/>

            <button className="point__edit-button" onClick={() => {
                props.showAddEditPointForm('edit', props.point.id);
            }}>{props.permission === 'user' ? 'Редактировать' : 'Утвердить'}</button>

            {refuseBtn}

            {delPointBtn}

            <div className="point__description">
                {props.point.description}
            </div>
            <hr />
        </div>
    );
}

export default Point;