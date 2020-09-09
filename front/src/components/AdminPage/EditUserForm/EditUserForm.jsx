import React from 'react';
import { Field, reduxForm } from 'redux-form';

let Form = (props) => {
    return (
        <form className="edit-user-form__form" onSubmit={props.handleSubmit}>
            <div className="edit-user-form__fields">
                <div className="edit-user-form__email">
                    <Field name="email" type="text" component="input" placeholder="email" />
                </div>
                <div className="edit-user-form__password">
                    <Field name="password" type="password" component="input" placeholder="password" />
                </div>
            </div>
            <button className="edit-user-form__submit-btn">Редактировать</button>
            <button className="edit-user-form__cansel-btn" type="button" onClick={() => {
                props.onCloseEditUserForm();
            }}>Отмена</button>
        </form>
    );
}

Form = reduxForm({
    form: 'editUserForm',
    enableReinitialize: true,
})(Form);

let EditUserForm = (props) => {
    let initialValues = props.editUserForm.user;

    return (
        props.editUserForm.open &&
        <div className="edit-user-form">
            <Form initialValues={initialValues} onCloseEditUserForm={props.onCloseEditUserForm} onSubmit={props.onSubmit} />
        </div>
    );
}

export default EditUserForm;