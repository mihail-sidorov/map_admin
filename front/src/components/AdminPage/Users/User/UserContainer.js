import { connect } from 'react-redux';
import User from './User';
import { openEditUserFormActionCreator } from '../../../../redux/adminPageReducer';

let UserContainer = (id) => {
    return connect(
        state => ({
            user: state.adminPageState.shortUsers[id],
        }),
        dispatch => ({
            onOpenEditUserForm: (id) => {
                dispatch(openEditUserFormActionCreator(id));
            },
        })
    )(User);
}

export default UserContainer;