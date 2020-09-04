import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Redirect } from 'react-router-dom';

let LoginForm = (props) => {
    return (
        <form className="login-form" onSubmit={props.handleSubmit}>
            <div className="login-form__login">
                <label>Логин: <Field name={'login'} type={'text'} component={'input'} /></label>
            </div>
            <div className="login-form__password">
                <label>Пароль: <Field name={'password'} type={'password'} component={'input'} /></label>
            </div>
            <button>Войти</button>
        </form>
    );
}

LoginForm = reduxForm({
    form: 'loginForm'
})(LoginForm);

let Login = (props) => {
    if (props.isAuth) {
        if (props.permission === 'admin') return <Redirect to={'/admin'} />
        if (props.permission === 'moder' || props.permission === 'user') return <Redirect to={'/points'} />
    }
    return <LoginForm onSubmit={props.onLogin}/>
}

export default Login;