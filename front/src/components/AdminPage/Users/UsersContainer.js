import { connect } from 'react-redux';
import UsersRequest from './Users';
import { getUsers, getUsersActionCreator, openAddUserFormActionCreator } from '../../../redux/adminPageReducer';

let UsersContainer = connect(
    state => ({
        users: state.adminPageState.shortUsers,
    }),
    dispatch => ({
        getUsers: () => {
            getUsers()
                .then((usersArr) => {
                    dispatch(getUsersActionCreator(usersArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onOpenAddUserForm: () => {
            dispatch(openAddUserFormActionCreator());
        },
    })
)(UsersRequest);

export default UsersContainer;