import React, {useState} from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import modalWindowHOC from '../../../HOC/modalWindowHOC';

let Form = (props) => {
    let formFields = [];
    if (props.permission === 'user') {
        formFields.push(
            <div className="add-edit-point-form__form-fields form__fields" key={1}>
                <div className="add-edit-point-form__form-lng form__field">
                    <label><Field name={'lng'} type={'text'} component={'input'} placeholder={'Координаты широта'} /></label>
                </div>
                <div className="add-edit-point-form__form-lat form__field">
                    <label><Field name={'lat'} type={'text'} component={'input'} placeholder={'Координаты долгота'} /></label>
                </div>
                <div className="add-edit-point-form__form-apartment form__field">
                    <label><Field name={'apartment'} type={'text'} component={'input'} placeholder={'Этаж / Кабинет / Здание'} /></label>
                </div>
                <div className="add-edit-point-form__form-title form__field">
                    <label><Field name={'title'} type={'text'} component={'input'} placeholder={'Наименование'} /></label>
                </div>
                <div className="add-edit-point-form__form-hours form__field">
                    <label><Field name={'hours'} type={'text'} component={'input'} placeholder={'Режим работы'} /></label>
                </div>
                <div className="add-edit-point-form__form-phone form__field">
                    <label><Field name={'phone'} type={'text'} component={'input'} placeholder={'Телефон'} /></label>
                </div>
                <div className="add-edit-point-form__form-site form__field">
                    <label><Field name={'site'} type={'text'} component={'input'} placeholder={'Сайт'} /></label>
                </div>
                <div className="add-edit-point-form__form-description form__field">
                    <label><Field name={'description'} component={'textarea'} placeholder={'Комментарий'} /></label>
                </div>
                <div className="add-edit-point-form__form-isActive form__field">
                    <Field id="add-edit-point-form__form-isActive" name={'isActive'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isActive">Активна</label>
                </div>
                <div className="add-edit-point-form__form-isGeneralPartner form__field">
                    <Field id="add-edit-point-form__form-isGeneralPartner" name={'isGeneralPartner'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isGeneralPartner">Генеральный партнер</label>
                </div>
                <div className="add-edit-point-form__form-isKarmy form__field">
                    <Field id="add-edit-point-form__form-isKarmy" name={'is_karmy'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isKarmy">Karmy</label>
                </div>
                <div className="add-edit-point-form__form-isMeattime form__field">
                    <Field id="add-edit-point-form__form-isMeattime" name={'is_meattime'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isMeattime">Meat Time</label>
                </div>
            </div>
        );
    }
    if (props.permission === 'moder') {
        formFields.push(
            <div className="add-edit-point-form__form-fields form__fields" key={1}>
                <div className="add-edit-point-form__form-full-city-name form__field">
                    <label><Field name={'full_city_name'} type={'text'} component={'input'} placeholder="Регион, город" /></label>
                </div>
                <div className="add-edit-point-form__form-street form__field">
                    <label><Field name={'street'} type={'text'} component={'input'} placeholder="Улица" /></label>
                </div>
                <div className="add-edit-point-form__form-house form__field">
                    <label><Field name={'house'} type={'text'} component={'input'} placeholder="Дом" /></label>
                </div>
                <div className="add-edit-point-form__form-apartment form__field">
                    <label><Field name={'apartment'} type={'text'} component={'input'} placeholder="Этаж / Кабинет / Здание" /></label>
                </div>
                <div className="add-edit-point-form__form-title form__field">
                    <label><Field name={'title'} type={'text'} component={'input'} placeholder="Наименование" /></label>
                </div>
                <div className="add-edit-point-form__form-hours form__field">
                    <label><Field name={'hours'} type={'text'} component={'input'} placeholder="Режим работы" /></label>
                </div>
                <div className="add-edit-point-form__form-phone form__field">
                    <label><Field name={'phone'} type={'text'} component={'input'} placeholder="Телефон" /></label>
                </div>
                <div className="add-edit-point-form__form-site form__field">
                    <label><Field name={'site'} type={'text'} component={'input'} placeholder="Сайт" /></label>
                </div>
                <div className="add-edit-point-form__form-isActive form__field">
                    <Field id="add-edit-point-form__form-isActive" name={'isActive'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isActive">Активна</label>
                </div>
                <div className="add-edit-point-form__form-isGeneralPartner form__field">
                    <Field id="add-edit-point-form__form-isGeneralPartner" name={'isGeneralPartner'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isGeneralPartner">Генеральный партнер</label>
                </div>
                <div className="add-edit-point-form__form-isKarmy form__field">
                    <Field id="add-edit-point-form__form-isKarmy" name={'is_karmy'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isKarmy">Karmy</label>
                </div>
                <div className="add-edit-point-form__form-isMeattime form__field">
                    <Field id="add-edit-point-form__form-isMeattime" name={'is_meattime'} type={'checkbox'} component={'input'} /><label htmlFor="add-edit-point-form__form-isMeattime">Meat Time</label>
                </div>
            </div>
        );
    }

    let submitBtn;
    if (props.permission === 'moder') {
        submitBtn = 'ОК'
    }
    if (props.permission === 'user') {
        submitBtn = (props.action === 'add' ? 'ОК' : 'ОК');
    }

    return (
        <form className="add-edit-point-form__form form" onSubmit={props.handleSubmit(values => {props.addEditPoint(values, props.action, props.permission)})}>
            {formFields}

            <div className="add-edit-point-form__btns">
                <button className="add-edit-point-form__form-submit-btn btn">{submitBtn}</button>
                <button className="add-edit-point-form__form-cansel-btn btn" type="button" onClick={() => {
                    props.closeAddEditPointForm(null);
                }}>Отмена</button>
            </div>
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
        <div className="add-edit-point-form">
            <Form closeAddEditPointForm={props.closeAddEditPointForm} addEditPoint={props.addEditPoint} action={props.localAction} permission={props.permission} />
        </div>
    );
}

let AddEditPointFormModalWindow = (props) => {
    const [action, setAction] = useState(props.action);
    let title, newProps = {...props};

    if (action !== props.action && props.action !== null) {
        setAction(props.action);
    }

    if (action === 'add') {
        title = 'Добавить точку';
    }
    else if (action === 'edit') {
        if (props.permission === 'user') {
            title = 'Редактировать точку';
        }
        else {
            title = 'Утвердить точку';
        }
    }

    newProps.localAction = action;

    return (
        modalWindowHOC(AddEditPointForm, newProps, props.open, props.closeAddEditPointForm, true, title)
    );
}

export default AddEditPointFormModalWindow;