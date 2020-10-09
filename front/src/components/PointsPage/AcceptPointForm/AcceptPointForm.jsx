import React from 'react';
import modalWindowHOC from '../../../HOC/modalWindowHOC';

let AcceptPointForm = (props) => {
    return (
        <div className="accept-point-form">
            <div className="accept-point-form__text">
                {props.acceptPointForm.status === 'take' ? 'Вы действительно хотите утвердить взятие точки?' : 'Вы действительно хотите утвердить отдачу точки?'}
            </div>
            <div className="accept-point-form__btns">
                <button className="accept-point-form__accept-btn btn" onClick={() => {
                    props.onAcceptTakeReturnPoint(props.acceptPointForm.id);
                }}>ОК</button>
                <button className="accept-point-form__cansel-btn btn" onClick={() => {
                    props.onCloseAcceptPointForm();
                }}>Отмена</button>
            </div>
        </div>
    );
}

let AcceptPointFormModalWindow = (props) => {
    return (
        modalWindowHOC(AcceptPointForm, props, props.acceptPointForm.open, props.onCloseAcceptPointForm, true, props.acceptPointForm.status === 'take' ? 'Утверждение взятия' : 'Утверждение отдачи')
    );
}

export default AcceptPointFormModalWindow;