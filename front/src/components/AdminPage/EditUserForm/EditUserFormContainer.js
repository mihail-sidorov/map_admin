import { connect } from 'react-redux';
import EditUserForm from './EditUserForm';
import { closeEditUserFormActionCreator, editUser, editUserActionCreator } from '../../../redux/adminPageReducer';

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