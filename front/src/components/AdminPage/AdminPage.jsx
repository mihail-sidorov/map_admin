import React from 'react';
import { Redirect } from 'react-router-dom';

let AdminPage = (props) => {
    if (props.permission !== 'admin') {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <div className="admin-page">
            Страница суперадмина
        </div>
    );
}

export default AdminPage;