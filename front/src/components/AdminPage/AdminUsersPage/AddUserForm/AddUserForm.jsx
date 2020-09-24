import React from 'react';
import { Field, reduxForm } from 'redux-form';
import modalWindowHOC from '../../../../HOC/modalWindowHOC';

let Form = (props) => {
    let permissions = [], regions = [];
    permissions.push(<option value={0} key={0}>Уровень доступа</option>);
    props.permissions.forEach((permission, index) => {
        let permissionName = '';
        switch (permission.permission) {
            case 'admin':
                permissionName = 'Администратор';
                break;
            case 'moder':
                permissionName = 'Модератор';
                break;
            case 'user':
                permissionName = 'Пользователь';
                break;
            default:
                break;
        }
        permissions.push(<option value={permission.id} key={index + 1}>{permissionName}</option>);
    });
    regions.push(<option value={0} key={0}>Регион пользователя</option>);
    props.regions.forEach((region, index) => {
        regions.push(<option value={region.id} key={index + 1}>{region.region}</option>);
    });

    return (
        <form className="add-user-form__form form" onSubmit={props.handleSubmit}>
            <div className="add-user-form__form-fields form__fields">
                <div className="add-user-form__form-email form__field">
                    <label><Field name="email" type="text" component="input" placeholder="Логин" /></label>
                </div>
                <div className="add-user-form__form-password form__field">
                    <label><Field name="password" type="password" component="input" placeholder="Пароль" /></label>
                </div>
                <div className="add-user-form__form-permission form__field">
                    <label>
                        <Field name="permission" component="select">
                            {permissions}
                        </Field>
                    </label>
                </div>
                <div className="add-user-form__form-region form__field">
                    <label>
                        <Field name="region" component="select">
                            {regions}
                        </Field>
                    </label>
                </div>
            </div>
            <div className="add-user-form__btns">
                <button className="add-user-form__submit-btn btn">Добавить</button>
                <button className="add-user-form__cansel-btn btn" type="button" onClick={() => {
                    props.onCloseAddUserForm();
                }}>Отмена</button>
            </div>
        </form>
    );
}

Form = reduxForm({
    form: 'addUserForm',
})(Form);

let AddUserForm = (props) => {
    console.log('AddUserForm');

    return (
        <div className="add-user-form">
            <Form permissions={props.addUserForm.permissions} regions={props.addUserForm.regions} onCloseAddUserForm={props.onCloseAddUserForm} onSubmit={props.onSubmit} />
        </div>
    );
}

let AddUserFormRequest = class extends React.Component {
    componentDidMount() {
        this.props.onGetPermissions();
        this.props.onGetRegions();
    }

    render() {
        return (
            modalWindowHOC(AddUserForm, this.props, this.props.addUserForm.open, this.props.onCloseAddUserForm, true, 'Добавить пользователя')
        );
    }
}

export default AddUserFormRequest;