import React, {useState} from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../HOC/modalWindowHOC';

let Form = (props) => {
    return (
        <form className="refuse-point-form__form form" onSubmit={props.handleSubmit}>
            <div className="refuse-point-form__fields form__fields">
                <div className="refuse-point-form__field form__field">
                    <label><Field name="description" component="textarea" placeholder="Напишите причину отклонения точки" /></label>
                </div>
            </div>
            <div className="refuse-point-form__btns">
                <button className="refuse-point-form__submit-btn btn">ОК</button>
                <button className="refuse-point-form__cansel-btn btn" type="button" onClick={() => {
                    props.onCanselRefusePoint();
                }}>Отмена</button>
            </div>
        </form>
    );
}

Form = reduxForm({
    form: 'refusePointForm',
    enableReinitialize: true,
})(Form);

let RefusePointForm = (props) => {
    return (
        <div className="refuse-point-form">
            <Form {...props} onSubmit={props.onRefusePoint} initialValues={{id: props.refusePointForm.id}} />
        </div>
    );
}

let RefusePointFormModalWindow = (props) => {
    return (
        modalWindowHOC(RefusePointForm, props, props.refusePointForm.open, props.onCanselRefusePoint, true, 'Отклонить точку')
    );
}

export default RefusePointFormModalWindow;