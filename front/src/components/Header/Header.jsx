import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../imgs/logo-map-admin.png';

let Header = (props) => {
    return (
        <header className="header">
            <div className="header__wrapper section">
                <a href="/" className="header__logo">
                    <img src={logo} />
                </a>
                {props.auth.isAuth && <><span className="header__hi">Привет, {props.auth.login} </span><span className="header__logout"><a href="#" onClick={props.onLogout}>Выйти</a></span></>}
            </div>
        </header>
    );
}

export default Header;