import { connect } from 'react-redux';
import { closeAddUserFormActionCreator, getPermissions, setPermissionsActionCreator, addUser, addUserActionCreator, setRegionsToAddUserFormActionCreator, changeUserOnAddUserFormActionCreator } from '../../../../redux/adminPageReducer';
import { getRegions } from '../../../../redux/adminRegionsPageReducer';
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
            if (values.email !== '' && values.password !== '' && values.permission !== '0' && values.permission !== 0  && values.region !== '0' && values.region !== 0) {
                values.permission_id = values.permission;
                values.region_id = values.region;

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
        onGetPermissions: () => {
            getPermissions()
                .then((permissionsArr) => {
                    dispatch(setPermissionsActionCreator(permissionsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onGetRegions: () => {
            getRegions()
                .then((regionsArr) => {
                    dispatch(setRegionsToAddUserFormActionCreator(regionsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onChangePermission: (permission) => {
            const adminPermission = 1;
            let user = {
                email: window.store.getState().form.addUserForm.values.email,
                password: window.store.getState().form.addUserForm.values.password,
                permission: permission,
            };

            if (permission == adminPermission) {
                user.region = null;
            }
            else {
                if (window.store.getState().adminPageState.addUserForm.user.permission == adminPermission) {
                    user.region = 0;
                }
                else {
                    user.region = window.store.getState().form.addUserForm.values.region;
                }
            }

            dispatch(changeUserOnAddUserFormActionCreator(user));
        },
    })
)(AddUserFormRequest);

export default AddUserFormContainer;