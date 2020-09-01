import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

let Form = (props) => {
    return (
        <form className="add-edit-point-form__form" onSubmit={props.handleSubmit(values => {props.addEditPoint(values, props.action)})}>
            <div className="add-edit-point-form__form-lng">
                <label><Field name={'lng'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-lat">
                <label><Field name={'lat'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-apartment">
                <label><Field name={'apartment'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-title">
                <label><Field name={'title'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-hours">
                <label><Field name={'hours'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-phone">
                <label><Field name={'phone'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-site">
                <label><Field name={'site'} type={'text'} component={'input'} /></label>
            </div>
            <div className="add-edit-point-form__form-description">
                <label><Field name={'description'} component={'textarea'} /></label>
            </div>
            <div className="add-edit-point-form__form-isActive">
                <label>Активна<Field name={'isActive'} type={'checkbox'} component={'input'} /></label>
            </div>
            <button className="add-edit-point-form__form-submit-btn">{props.action === 'add' ? 'Добавить' : 'Редактировать'}</button>
            <button className="add-edit-point-form__form-cansel-btn" type="button" onClick={() => {
                props.closeAddEditPointForm(null);
            }}>Отмена</button>
        </form>
    );
}

Form = reduxForm({
    form: 'addEditPointForm',
    enableReinitialize: true,
})(Form);

Form = connect(
    state => ({
        initialValues: state.pointsPageState.addEditPointForm.point,
    }),
    {}
)(Form);

let AddEditPointForm = (props) => {
    return (
        props.action !== null &&
        <div className="add-edit-point-form">
            <Form closeAddEditPointForm={props.closeAddEditPointForm} addEditPoint={props.addEditPoint} action={props.action} />
        </div>
    );
}

export default AddEditPointForm;