import { connect } from 'react-redux';
import Users from './Users';

let UsersContainer = connect(
    state => ({
        users: state.adminPageState.shortUsers,
    }),
    dispatch => ({

    })
)(Users);

export default UsersContainer;