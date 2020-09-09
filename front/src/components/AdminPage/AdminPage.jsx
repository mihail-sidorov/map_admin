import React from 'react';
import { Redirect } from 'react-router-dom';
import UsersContainer from './Users/UsersContainer';
import PaginationContainer from './Pagination/PaginationContainer';
import SearchAdminContainer from './SearchAdmin/SearchAdminContainer';
import AddUserFormContainer from './AddUserForm/AddUserFormContainer';
import EditUserFormContainer from './EditUserForm/EditUserFormContainer';

let AdminPage = (props) => {
    if (props.permission !== 'admin') {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <div className="admin-page">
            <SearchAdminContainer />
            <UsersContainer />
            <PaginationContainer />
            <AddUserFormContainer />
            <EditUserFormContainer />
        </div>
    );
}

export default AdminPage;