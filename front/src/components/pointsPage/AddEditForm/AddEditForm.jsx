import React from 'react';

let AddEditForm = (props) => {
    console.log('AddEditForm>>>');

    let onCanselAction = () => {
        props.canselAction();
    }

    let onChangeCity = (e) => {
        props.changeCity(e.currentTarget.value);
    }

    let onChangeName = (e) => {
        props.changeName(e.currentTarget.value);
    }

    let onChangeLong = (e) => {
        props.changeLong(e.currentTarget.value);
    }

    let onChangeLat = (e) => {
        props.changeLat(e.currentTarget.value);
    }

    let onAddEditPoint = () => {
        props.addEditPoint();
    }

    return (
        props.addEditForm.action !== null &&
        <div className="add-edit-form">
            <div className="add-edit-form__point">
                <input type="text" className="add-edit-form__city" value={props.addEditForm.point.city} onChange={onChangeCity} />
                <input type="text" className="add-edit-form__name" value={props.addEditForm.point.name} onChange={onChangeName} />
                <input type="text" className="add-edit-form__long" value={props.addEditForm.point.long} onChange={onChangeLong} />
                <input type="text" className="add-edit-form__lat" value={props.addEditForm.point.lat} onChange={onChangeLat} />
            </div>
            <button className="add-edit-form__add-button" onClick={onAddEditPoint}>{props.addEditForm.action === 'add' ? 'Добавить' : 'Редактировать'}</button>
            <button className="add-edit-form__cansel-button" onClick={onCanselAction}>Отмена</button>
        </div>
    );
}

export default AddEditForm;