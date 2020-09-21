import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    return (
        <form action="" className="edit-region-form__form" onSubmit={props.handleSubmit}>
            <div className="edit-region-form__fields">
                <div className="edit-region-form__region">
                    <Field name="region" component="input" placeholder="region" />
                </div>
            </div>
            <button className="edit-region-form__submit-btn">Редактировать</button>
            <button className="edit-region-form__cansel-btn" type="button" onClick={() => {
                props.onCanselEditRegion();
            }}>Отмена</button>
        </form>
    );
}

Form = reduxForm({
    form: 'editRegionForm',
    enableReinitialize: true,
})(Form);

let EditRegionForm = (props) => {
    console.log('EditRegionForm');
    return (
        <div className="edit-region-form">
            <Form onSubmit={props.onEditRegionForm} initialValues={props.editRegionForm.region} onCanselEditRegion={props.onCanselEditRegion} />
        </div>
    );
}

let EditRegionFormModalWindow = (props) => {
    return (
        modalWindowHOC(EditRegionForm, props, props.editRegionForm.open, props.onCanselEditRegion, true, 'Редактировать регион')
    );
}

export default EditRegionFormModalWindow;