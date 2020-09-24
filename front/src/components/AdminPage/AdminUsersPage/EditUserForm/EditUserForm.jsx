import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    return (
        <form className="edit-user-form__form form" onSubmit={props.handleSubmit}>
            <div className="edit-user-form__fields form__fields">
                <div className="edit-user-form__email form__field">
                    <label><Field name="email" type="text" component="input" placeholder="Логин" /></label>
                </div>
                <div className="edit-user-form__password form__field">
                    <label><Field name="password" type="password" component="input" placeholder="Пароль" /></label>
                </div>
            </div>
            <div className="edit-user-form__btns">
                <button className="edit-user-form__submit-btn btn">Редактировать</button>
                <button className="edit-user-form__cansel-btn btn" type="button" onClick={() => {
                    props.onCloseEditUserForm();
                }}>Отмена</button>
            </div>
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
        <div className="edit-user-form">
            <Form initialValues={initialValues} onCloseEditUserForm={props.onCloseEditUserForm} onSubmit={props.onSubmit} />
        </div>
    );
}

let EditUserFormModalWindow = (props) => {
    return (
        modalWindowHOC(EditUserForm, props, props.editUserForm.open, props.onCloseEditUserForm, true, 'Редактировать пользователя')
    );
}

export default EditUserFormModalWindow;