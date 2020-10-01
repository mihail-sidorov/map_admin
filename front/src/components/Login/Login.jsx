import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Redirect } from 'react-router-dom';

let LoginForm = (props) => {
    return (
        <form className="login-form form" onSubmit={props.handleSubmit}>
            <div className="login-form__container">
                <div className="login-form__fields form__fields">
                    <div className="login-form__login form__field">
                        <label><Field name={'login'} type={'text'} component={'input'} placeholder="Логин" /></label>
                    </div>
                    <div className="login-form__password form__field">
                        <label><Field name={'password'} type={'password'} component={'input'} placeholder="Пароль" /></label>
                    </div>
                </div>
                <div className="login-form__btns">
                    <button className="btn">Войти</button>
                </div>
            </div>
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