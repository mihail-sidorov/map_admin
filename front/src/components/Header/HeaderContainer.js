import { connect } from 'react-redux';
import Header from './Header';
import { logout, getAuthData, setAuthDataActionCreator } from '../../redux/authReducer';
import { showAddEditPointFormActionCreator } from '../../redux/pointsPageReducer';
import { closeAddUserFormActionCreator, closeEditUserFormActionCreator, returnToAdmin } from '../../redux/adminPageReducer';

let mapStateToProps = (state) => {
    return {
        auth: state.authState,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => {
            if (window.store.getState().authState.loginAs) {
                returnToAdmin()
                    .then(() => {
                        return getAuthData();
                    })
                    .then((data) => {
                        dispatch(showAddEditPointFormActionCreator(null));
                        dispatch(setAuthDataActionCreator(data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            else {
                logout()
                    .then(() => {
                        return getAuthData();
                    })
                    .then((data) => {
                        dispatch(showAddEditPointFormActionCreator(null));
                        dispatch(closeAddUserFormActionCreator());
                        dispatch(closeEditUserFormActionCreator());
                        dispatch(setAuthDataActionCreator(data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
    };
}

let HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;