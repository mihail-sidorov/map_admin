import { connect } from 'react-redux';
import Header from './Header';
import { logout, getAuthData, setAuthDataActionCreator } from '../../redux/authReducer';

let mapStateToProps = (state) => {
    return {
        auth: state.authState,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => {
            logout()
                .then(() => {
                    return getAuthData();
                })
                .then((data) => {
                    dispatch(setAuthDataActionCreator({login: null, isAuth: false}));
                });
        },
    };
}

let HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;