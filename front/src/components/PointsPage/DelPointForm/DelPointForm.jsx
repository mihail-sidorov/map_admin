import React from 'react';
import modalWindowHOC from '../../../HOC/modalWindowHOC';

let DelPointForm = (props) => {
    return (
        <div className="del-point-form">
            <div className="del-point-form__text">
                Вы действительно хотите удалить точку?
            </div>
            <div className="del-point-form__btns">
                <button className="del-point-form__accept-btn btn" onClick={() => {
                    props.onDelPoint(props.delPointForm.id, props.delPointForm.permission);
                }}>ОК</button>
                <button className="del-point-form__cansel-btn btn" onClick={() => {
                    props.onCloseDelPointForm();
                }}>Отмена</button>
            </div>
        </div>
    );
}

let DelPointFormModalWindow = (props) => {
    return (
        modalWindowHOC(DelPointForm, props, props.delPointForm.open, props.onCloseDelPointForm, true, 'Удалить точку')
    );
}

export default DelPointFormModalWindow;