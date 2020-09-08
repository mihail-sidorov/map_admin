import { connect } from 'react-redux';
import User from './User';

let UserContainer = (id) => {
    return connect(
        state => ({
            user: state.adminPageState.shortUsers[id],
        }),
        dispatch => ({

        })
    )(User);
}

export default UserContainer;