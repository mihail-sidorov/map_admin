import React from 'react';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import AdminRegionsPage from './AdminRegionsPage/AdminRegionsPage';
import AdminUsersPage from './AdminUsersPage/AdminUsersPage';

let AdminPage = (props) => {
    if (props.permission !== 'admin') {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <div className="admin-page">
            <div className="tabs">
                <div className="tabs__tab">
                    <NavLink to="/admin/users">Пользователи</NavLink>
                </div>
                <div className="tabs__tab">
                    <NavLink to="/admin/regions">Регионы</NavLink>
                </div>
            </div>
            <Switch>
                <Redirect exact from="/admin" to="/admin/users" />
                <Route path="/admin/users" render={AdminUsersPage} />
                <Route path="/admin/regions" render={AdminRegionsPage} />
            </Switch>
        </div>
    );
}

export default AdminPage;