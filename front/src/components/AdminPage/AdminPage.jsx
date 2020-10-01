import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminRegionsPage from './AdminRegionsPage/AdminRegionsPage';
import AdminUsersPage from './AdminUsersPage/AdminUsersPage';
import Tabs from './Tabs/Tabs';

let AdminPage = (props) => {
    if (props.permission !== 'admin') {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <div className="admin-page">
            <Tabs />
            <Switch>
                <Redirect exact from="/admin" to="/admin/users" />
                <Route path="/admin/users" render={AdminUsersPage} />
                <Route path="/admin/regions" render={AdminRegionsPage} />
            </Switch>
        </div>
    );
}

export default AdminPage;