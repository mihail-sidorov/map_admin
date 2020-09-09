import { connect } from 'react-redux';
import { closeAddUserFormActionCreator, getPermissions, setPermissionsActionCreator, addUser, addUserActionCreator } from '../../../redux/adminPageReducer';
import AddUserFormRequest from './AddUserForm';

let AddUserFormContainer = connect(
    state => ({
        addUserForm: state.adminPageState.addUserForm,
    }),
    dispatch => ({
        onCloseAddUserForm: () => {
            dispatch(closeAddUserFormActionCreator());
        },
        onSubmit: (values) => {
            if (values.email && values.password && values.permission) {
                values.permission_id = values.permission;

                console.log(values);

                addUser(values)
                    .then((user) => {
                        dispatch(closeAddUserFormActionCreator());
                        dispatch(addUserActionCreator(user));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        getPermissions: () => {
            getPermissions()
                .then((permissionsArr) => {
                    dispatch(setPermissionsActionCreator(permissionsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    })
)(AddUserFormRequest);

export default AddUserFormContainer;