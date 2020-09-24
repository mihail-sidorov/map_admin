import { connect } from 'react-redux';
import { closeAddUserFormActionCreator, getPermissions, setPermissionsActionCreator, addUser, addUserActionCreator, setRegionsToAddUserFormActionCreator } from '../../../../redux/adminPageReducer';
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
            if (values.email && values.password && values.permission && values.region) {
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
    })
)(AddUserFormRequest);

export default AddUserFormContainer;