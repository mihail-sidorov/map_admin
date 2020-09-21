import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    return (
        <form className="add-region-form__form" onSubmit={props.handleSubmit}>
            <div className="add-region-form__fields">
                <div className="add-region-form__region">
                    <Field name="region" component="input" placeholder="region" />
                </div>
            </div>
            <button className="add-region-form__submit-btn">Добавить</button>
            <button className="add-region-form__cansel-btn" type="button" onClick={() => {
                props.onCanselAddRegion();
            }}>Отмена</button>
        </form>
    );
}

Form = reduxForm({
    form: 'addRegionForm',
})(Form);

let AddRegionForm = (props) => {
    return (
        <div className="add-region-form">
            <Form onSubmit={props.onAddRegion} {...props} />
        </div>
    );
}

let AddRegionFormModalWindow = (props) => {
    return (
        modalWindowHOC(AddRegionForm, props, props.open, props.onCanselAddRegion, true, 'Добавить регион')
    );
}

export default AddRegionFormModalWindow;