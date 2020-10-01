import { connect } from 'react-redux';
import User from './User';
import { openEditUserFormActionCreator, loginAs, loginAsActionCreator } from '../../../../../redux/adminPageReducer';
import { getAuthData, setAuthDataActionCreator } from '../../../../../redux/authReducer';
import { resetPointsActionCreator, resetPaginationPointsActionCreator, resetSearchPointsActionCreator, setModerTabsActionCreator } from '../../../../../redux/pointsPageReducer';

let UserContainer = (id) => {
    return connect(
        state => ({
            user: state.adminPageState.shortUsers[id],
        }),
        dispatch => ({
            onOpenEditUserForm: (id) => {
                dispatch(openEditUserFormActionCreator(id));
            },
            onLoginAs: (id) => {
                loginAs(id)
                    .then(() => {
                        return getAuthData();
                    })
                    .then((data) => {
                        if (data.permission === 'moder') {
                            dispatch(setModerTabsActionCreator());
                        }
                        dispatch(setAuthDataActionCreator(data));
                        dispatch(resetPaginationPointsActionCreator());
                        dispatch(resetSearchPointsActionCreator());
                        dispatch(resetPointsActionCreator());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        })
    )(User);
}

export default UserContainer;