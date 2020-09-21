import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    let permissions = [], regions = [];
    props.permissions.forEach((permission, index) => {
        permissions.push(<option value={permission.id} key={index}>{permission.permission}</option>);
    });
    props.regions.forEach((region, index) => {
        regions.push(<option value={region.id} key={index}>{region.region}</option>);
    });

    return (
        <form className="add-user-form__form" onSubmit={props.handleSubmit}>
            <div className="add-user-form__form-fields">
                <div className="add-user-form__form-email">
                    <Field name="email" type="text" component="input" placeholder="email" />
                </div>
                <div className="add-user-form__form-password">
                    <Field name="password" type="password" component="input" placeholder="password" />
                </div>
                <div className="add-user-form__form-permission">
                    <Field name="permission" component="select">
                        {permissions}
                    </Field>
                </div>
                <div className="add-user-form__form-region">
                    <Field name="region" component="select">
                        {regions}
                    </Field>
                </div>
            </div>
            <button className="add-user-form__submit-btn">Добавить</button>
            <button className="add-user-form__cansel-btn" type="button" onClick={() => {
                props.onCloseAddUserForm();
            }}>Отмена</button>
        </form>
    );
}

Form = reduxForm({
    form: 'addUserForm',
})(Form);

let AddUserForm = (props) => {
    console.log('AddUserForm');
    let initialValues = {};

    if (props.addUserForm.permissions.length > 0) {
        let permission = props.addUserForm.permissions[0];

        if (permission === undefined) {
            permission = props.addUserForm.permissions[0];
        }

        initialValues.permission = permission.id;
    }

    if (props.addUserForm.regions.length > 0) {
        initialValues.region = props.addUserForm.regions[0].id;
    }

    return (
        <div className="add-user-form">
            <Form permissions={props.addUserForm.permissions} regions={props.addUserForm.regions} initialValues={initialValues} onCloseAddUserForm={props.onCloseAddUserForm} onSubmit={props.onSubmit} />
        </div>
    );
}

let AddUserFormRequest = class extends React.Component {
    componentDidMount() {
        this.props.getPermissions();
        this.props.onGetRegions();
    }

    render() {
        return (
            modalWindowHOC(AddUserForm, this.props, this.props.addUserForm.open, this.props.onCloseAddUserForm, true, 'Добавить пользователя')
        );
    }
}

export default AddUserFormRequest;