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

    let pointInform = [], moderStatus = '';
    if (props.permission === 'user') {
        if (props.point.moder_status === 'moderated') moderStatus = 'На модерации';
        if (props.point.moder_status === 'refuse') moderStatus = 'Отклонено';
        if (props.point.moder_status === 'accept') moderStatus = 'Допущена к публикации';
        if (props.point.moder_status === 'delete') moderStatus = 'На удалении';
        if (props.point.moder_status === 'take') moderStatus = 'Ожидает подтверждение взятия';
        if (props.point.moder_status === 'return') moderStatus = 'Ожидает подтверждение отдачи';
    }
    else {
        if (props.point.moder_status === 'moderated') moderStatus = 'На утверждение';
        if (props.point.moder_status === 'delete') moderStatus = 'На удаление';
        if (props.point.moder_status === 'take') moderStatus = 'На утверждение взятия';
        if (props.point.moder_status === 'return') moderStatus = 'На утверждение отдачи';
    }

    pointInform.push(
        <div className="point__inform" key={1}>
            <span className="point__isActive">{props.point.isActive ? 'Активна' : 'Не активна'}</span>&nbsp;/&nbsp;
            <span className="point__moder-status">{moderStatus}</span>
        </div>
    );

    let delPointBtn = [];
    if ((props.permission === 'user') || (props.permission === 'moder' && props.point.moder_status === 'delete')) {
        delPointBtn.push(<button className={`point__del-button list__item-btn${props.permission === 'moder' && props.moderTabsActive === 1 ? ' list__item-btn_accept list__item-btn_2' : ' list__item-btn_delete'}`} onClick={() => {
            props.onShowDelPointForm(props.point.id, props.permission);
        }} key={1}></button>);
    }

    let refuseBtn = [];
    if (props.permission === 'moder') {
        refuseBtn.push(<button className="point__refuse-btn list__item-btn list__item-btn_refuse" key={1} onClick={() => {
            props.onShowRefusePointForm(props.point.id);
        }}></button>);
    }

    let editAcceptBtn = [];
    if ((props.permission === 'user') || (props.permission === 'moder' && props.point.moder_status === 'moderated')) {
        editAcceptBtn.push(
            <button className={`point__edit-button list__item-btn list__item-btn_2${props.permission === 'moder' && props.moderTabsActive === 1 ? ' list__item-btn_accept' : ' list__item-btn_edit'}`} onClick={() => {
                props.showAddEditPointForm('edit', props.point.id);
            }} key={1}></button>
        );
    }

    let pointDescription = [];
    if (props.point.description) {
        pointDescription.push(
            <div className="point__description" key={1}>
                {props.point.description}
            </div>
        );
    }

    let acceptPointBtn = [];
    if (props.permission === 'moder' && (props.point.moder_status === 'take' || props.point.moder_status === 'return')) {
        acceptPointBtn.push(
            <button className="point__accept-button list__item-btn_accept list__item-btn list__item-btn_2" key={1} onClick={() => {
                props.onShowAcceptPointForm(props.point.id, props.point.moder_status);
            }}></button>
        );
    }

    return (
        <div className="point__container">
            {pointInform}
            <div point-id={props.point.id} className={`point list__item${(props.point.moder_status === 'take' || props.point.moder_status === 'accept') && !props.moderTabs ? ' point_return' : ''}`}>
                {(props.point.moder_status === 'take' || props.point.moder_status === 'accept') && !props.moderTabs && (
                    <button className="point__return-btn" onClick={() => {
                        props.onReturnPoint(props.point.id, props.point.moder_status);
                    }}></button>
                )}

                <PointProperties point={props.point} permission={props.permission}/>

                {acceptPointBtn}
                
                {editAcceptBtn}

                {delPointBtn}

                {refuseBtn}

                {pointDescription}
            </div>
        </div>
    );
}

export default Point;