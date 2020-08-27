import {connect} from 'react-redux';
import Login from './Login';
import { login, getAuthData, setAuthDataActionCreator } from '../../redux/authReducer';

let mapStateToProps = (state) => {
    return {
        isAuth: state.authState.isAuth,
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