import React from 'react';
import { Field, reduxForm } from 'redux-form';

let Form = (props) => {
    let permissions = [];
    props.permissions.forEach((permission, index) => {
        permissions.push(<option value={permission.id} key={index}>{permission.permission}</option>);
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

        initialValues = {
            permission: permission.id,
        };
    }

    return (
        props.addUserForm.open && <div className="add-user-form">
            <Form permissions={props.addUserForm.permissions} initialValues={initialValues} onCloseAddUserForm={props.onCloseAddUserForm} onSubmit={props.onSubmit} />
        </div>
    );
}

let AddUserFormRequest = class extends React.Component {
    componentDidMount() {
        this.props.getPermissions();
    }

    render() {
        return (
            <AddUserForm {...this.props} />
        );
    }
}

export default AddUserFormRequest;