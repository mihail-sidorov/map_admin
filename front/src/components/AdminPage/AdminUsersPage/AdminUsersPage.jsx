import React from 'react';
import AddUserFormContainer from "./AddUserForm/AddUserFormContainer";
import EditUserFormContainer from "./EditUserForm/EditUserFormContainer";
import PaginationContainer from "./Pagination/PaginationContainer";
import SearchAdminContainer from "./SearchAdmin/SearchAdminContainer";
import UsersContainer from "./Users/UsersContainer";

let AdminUsersPage = (props) => {
    return (
        <div className="admin-users-page section">
            <SearchAdminContainer />
            <UsersContainer />
            <PaginationContainer />
            <AddUserFormContainer />
            <EditUserFormContainer />
        </div>
    );
}

export default AdminUsersPage;