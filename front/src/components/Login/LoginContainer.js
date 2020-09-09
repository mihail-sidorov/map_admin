import {connect} from 'react-redux';
import Login from './Login';
import { login, getAuthData, setAuthDataActionCreator } from '../../redux/authReducer';
import { resetCurrentPageAdminActionCreator } from '../../redux/adminPageReducer';
import { resetCurrentPagePointsActionCreator } from '../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        isAuth: state.authState.isAuth,
        permission: state.authState.permission,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (data) => {
            if (data.login !== undefined && data.password !== undefined) {
                login(data.login, data.password)
                    .then((response) => {
                        return getAuthData();
                    })
                    .then((data) => {
                        dispatch(setAuthDataActionCreator(data));
                        dispatch(resetCurrentPageAdminActionCreator());
                        dispatch(resetCurrentPagePointsActionCreator());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
    };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;