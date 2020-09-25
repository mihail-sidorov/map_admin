import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    return (
        <form action="" className="edit-region-form__form form" onSubmit={props.handleSubmit}>
            <div className="edit-region-form__fields form__fields">
                <div className="edit-region-form__region form__field">
                    <label><Field name="region" type="text" component="input" placeholder="Регион" /></label>
                </div>
            </div>
            <div className="edit-region-form__btns">
                <button className="edit-region-form__submit-btn btn">Редактировать</button>
                <button className="edit-region-form__cansel-btn btn" type="button" onClick={() => {
                    props.onCanselEditRegion();
                }}>Отмена</button>
            </div>
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