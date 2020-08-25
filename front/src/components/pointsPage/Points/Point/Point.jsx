import React from 'react';

let Point = (props) => {
    console.log('Point>>>');

    let onShowAddForm = () => {
        props.showAddForm();
    }

    let onShowEditForm = () => {
        props.showEditForm(props.point);
    }

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
            <button className="point__add-button" onClick={onShowAddForm}>Добавить</button>
            <button className="point__edit-button" onClick={onShowEditForm}>Редактировать</button>
            <button className="point__del-button" onClick={onDelPoint}>Удалить</button>
        </div>
    );
}

export default Point;