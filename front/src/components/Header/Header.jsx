import React from 'react';
import { NavLink } from 'react-router-dom';

let Header = (props) => {
    return (
        <header className="header">
            {!props.auth.isAuth ? <NavLink to={'/login'}>Войти</NavLink> : <><span className="header__hi">Привет, {props.auth.login} </span><a href="#" className="header__logout" onClick={props.onLogout}>Выйти</a></>}
        </header>
    );
}

export default Header;