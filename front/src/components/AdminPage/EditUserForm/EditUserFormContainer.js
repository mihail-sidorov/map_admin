import { connect } from 'react-redux';
import EditUserForm from './EditUserForm';
import { closeEditUserFormActionCreator, editUser, editUserActionCreator } from '../../../redux/adminPageReducer';
import { changeHeaderLoginActionCreator } from '../../../redux/authReducer';

let EditUserFormContainer = connect(
    state => ({
        editUserForm: state.adminPageState.editUserForm,
    }),
    dispatch => ({
        onCloseEditUserForm: () => {
            dispatch(closeEditUserFormActionCreator());
        },
        onSubmit: (values) => {
            if (values.email) {
                editUser(values)
                    .then((user) => {
                        if (window.store.getState().authState.login === window.store.getState().adminPageState.users[user.id].email) {
                            dispatch(changeHeaderLoginActionCreator(user.email));
                        }
                        dispatch(closeEditUserFormActionCreator());
                        dispatch(editUserActionCreator(user));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
    })
)(EditUserForm);

export default EditUserFormContainer;