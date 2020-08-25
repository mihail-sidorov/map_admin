import React from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

let authHOC = (Component) => {
    let componentContainer = (props) => {
        if (!props.isAuth) {
            return <Redirect to={'/login'} />
        }

        return (
            <Component />
        );
    }

    let mapStateToProps = (state) => {
        return {
            isAuth: state.authState.isAuth,
        };
    }

    let mapDispatchToProps = (dispatch) => {
        return {};
    }

    return connect(mapStateToProps, mapDispatchToProps)(componentContainer);
}

export default authHOC;