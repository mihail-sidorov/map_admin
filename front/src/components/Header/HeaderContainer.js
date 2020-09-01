import { connect } from 'react-redux';
import Header from './Header';
import { logout, getAuthData, setAuthDataActionCreator } from '../../redux/authReducer';
import { showAddEditPointFormActionCreator } from '../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        auth: state.authState,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => {
            dispatch(showAddEditPointFormActionCreator(null));
            logout()
                .then(() => {
                    return getAuthData();
                })
                .then((data) => {
                    dispatch(setAuthDataActionCreator(data));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    };
}

let HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;