import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

let Form = (props) => {
    let formFields = [];
    if (props.permission === 'user') {
        formFields.push(
            <div className="add-edit-point-form__form-fields" key={1}>
                <div className="add-edit-point-form__form-lng">
                    <label><Field name={'lng'} type={'text'} component={'input'} placeholder={'lng'} /></label>
                </div>
                <div className="add-edit-point-form__form-lat">
                    <label><Field name={'lat'} type={'text'} component={'input'} placeholder={'lat'} /></label>
                </div>
                <div className="add-edit-point-form__form-apartment">
                    <label><Field name={'apartment'} type={'text'} component={'input'} placeholder={'apartment'} /></label>
                </div>
                <div className="add-edit-point-form__form-title">
                    <label><Field name={'title'} type={'text'} component={'input'} placeholder={'title'} /></label>
                </div>
                <div className="add-edit-point-form__form-hours">
                    <label><Field name={'hours'} type={'text'} component={'input'} placeholder={'hours'} /></label>
                </div>
                <div className="add-edit-point-form__form-phone">
                    <label><Field name={'phone'} type={'text'} component={'input'} placeholder={'phone'} /></label>
                </div>
                <div className="add-edit-point-form__form-site">
                    <label><Field name={'site'} type={'text'} component={'input'} placeholder={'site'} /></label>
                </div>
                <div className="add-edit-point-form__form-description">
                    <label><Field name={'description'} component={'textarea'} placeholder={'description'} /></label>
                </div>
                <div className="add-edit-point-form__form-isActive">
                    <label>Активна<Field name={'isActive'} type={'checkbox'} component={'input'} /></label>
                </div>
            </div>
        );
    }
    if (props.permission === 'moder') {
        formFields.push(
            <div className="add-edit-point-form__form-fields" key={1}>
                <div className="add-edit-point-form__form-full-city-name">
                    <label><Field name={'full_city_name'} type={'text'} component={'input'} /></label>
                </div>
                <div className="add-edit-point-form__form-street">
                    <label><Field name={'street'} type={'text'} component={'input'} /></label>
                </div>
                <div className="add-edit-point-form__form-house">
                    <label><Field name={'house'} type={'text'} component={'input'} /></label>
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
            </div>
        );
    }

    let submitBtn;
    if (props.permission === 'moder') {
        submitBtn = 'Утвердить'
    }
    if (props.permission === 'user') {
        submitBtn = (props.action === 'add' ? 'Добавить' : 'Редактировать');
    }

    return (
        <form className="add-edit-point-form__form" onSubmit={props.handleSubmit(values => {props.addEditPoint(values, props.action, props.permission)})}>
            {formFields}

            <button className="add-edit-point-form__form-submit-btn">{submitBtn}</button>
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
            <Form closeAddEditPointForm={props.closeAddEditPointForm} addEditPoint={props.addEditPoint} action={props.action} permission={props.permission} />
        </div>
    );
}

export default AddEditPointForm;