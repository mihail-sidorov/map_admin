import * as axios from 'axios';
import serverName from "../serverName";

const CHANGE_PAGE_ADMIN = 'CHANGE_PAGE_ADMIN', CHANGE_SEARCH_ADMIN = 'CHANGE_SEARCH_ADMIN', GET_USERS = 'GET_USERS', OPEN_ADD_USER_FORM = 'OPEN_ADD_USER_FORM', CLOSE_ADD_USER_FORM = 'CLOSE_ADD_USER_FORM', SET_PERMISSIONS = 'SET_PERMISSIONS', ADD_USER = 'ADD_USER', OPEN_EDIT_USER_FORM = 'OPEN_EDIT_USER_FORM', CLOSE_EDIT_USER_FORM = 'CLOSE_EDIT_USER_FORM', EDIT_USER = 'EDIT_USER', RESET_CURRENT_PAGE_ADMIN = 'RESET_CURRENT_PAGE_ADMIN';

let makeShortUsers = (state) => {
    let searchUsers = {}, shortUsers = {};

    if (state.search !== '') {
        for (let id in state.users) {
            let pattern = new RegExp(state.search.toLowerCase());
            let email, permission;


            for (let property in state.users[id]) {
                switch (property) {
                    case 'email':
                        email = state.users[id][property];
                        break;
                    case 'permission':
                        permission = state.users[id][property];
                        break;
                    default:
                        break;
                }
            }

            let searchStr = email + permission;

            if (searchStr.toLowerCase().match(pattern)) {
                searchUsers[id] = state.users[id];
            }
        }
    }
    else {
        searchUsers = state.users;
    }

    let paginationCount = state.pagination.count;
    let currentPage = state.pagination.currentPage;
    
    let pages = Math.floor(Object.keys(searchUsers).length / paginationCount);
    if (Object.keys(searchUsers).length % paginationCount > 0) {
        pages++;
    }
    if (currentPage > pages || state.addUserForm.newUser === true) {
        currentPage = pages;
    }

    let left = (currentPage - 1) * paginationCount + 1;
    let right = left + paginationCount - 1;
    let i = 1;

    for (let id in searchUsers) {
        if (i >= left && i <= right) {
            shortUsers[id] = searchUsers[id];
        }
        i++;
    }

    return {
        shortUsers: shortUsers,
        currentPage: currentPage,
        pages: pages,
    };
}

let initialState = {
    users: {},
    shortUsers: {},
    search: '',
    pagination: {
        count: 2,
        currentPage: 1,
        pages: 0,
    },
    addUserForm: {
        open: false,
        newUser: false,
        permissions: [],
    },
    editUserForm: {
        open: false,
        user: {},
    },
};

// Запросы к API
export let getUsers = () => {
    return axios.get(`${serverName}/api/admin/getUsers`, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось получить пользователей!';
        }
    });
}

export let getPermissions = () => {
    return axios.get(`${serverName}/api/admin/getPermission`, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось получить роли!';
        }
    });
}

export let addUser = (data) => {
    return axios.post(`${serverName}/api/admin/addUser`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response[0];
        }
        else {
            throw 'Не удалось добавить пользователя!';
        }
    });
}

export let editUser = (data) => {
    return axios.post(`${serverName}/api/admin/editUser`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response[0];
        }
        else {
            throw 'Не удалось отредактировать пользователя!';
        }
    });
}

// Создание ActionCreator
export let changePageAdminActionCreator = (page) => ({
    type: CHANGE_PAGE_ADMIN,
    page: page,
})

export let changeSearchAdminActionCreator = (value) => ({
    type: CHANGE_SEARCH_ADMIN,
    value: value,
})

export let getUsersActionCreator = (usersArr) => ({
    type: GET_USERS,
    usersArr: usersArr,
})

export let openAddUserFormActionCreator = () => ({
    type: OPEN_ADD_USER_FORM,
})

export let closeAddUserFormActionCreator = () => ({
    type: CLOSE_ADD_USER_FORM,
})

export let setPermissionsActionCreator = (permissionsArr) => ({
    type: SET_PERMISSIONS,
    permissionsArr: permissionsArr,
})

export let addUserActionCreator = (user) => ({
    type: ADD_USER,
    user: user,
})

export let openEditUserFormActionCreator = (id) => ({
    type: OPEN_EDIT_USER_FORM,
    id: id,
})

export let closeEditUserFormActionCreator = () => ({
    type: CLOSE_EDIT_USER_FORM,
})

export let editUserActionCreator = (user) => ({
    type: EDIT_USER,
    user: user,
})

export let resetCurrentPageAdminActionCreator = () => ({
    type: RESET_CURRENT_PAGE_ADMIN,
})

let adminPageReducer = (state = initialState, action) => {
    let newState, makeShortUsersResult;

    switch (action.type) {
        case CHANGE_PAGE_ADMIN:
            newState = {...state};
            newState.pagination.currentPage = action.page;

            makeShortUsersResult = makeShortUsers(newState);
            newState.shortUsers = makeShortUsersResult.shortUsers;
            newState.pagination.currentPage = makeShortUsersResult.currentPage;
            newState.pagination.pages = makeShortUsersResult.pages;

            return newState;
        case CHANGE_SEARCH_ADMIN:
            newState = {...state};
            newState.search = action.value;
            newState.pagination.currentPage = 1;

            makeShortUsersResult = makeShortUsers(newState);
            newState.shortUsers = makeShortUsersResult.shortUsers;
            newState.pagination.currentPage = makeShortUsersResult.currentPage;
            newState.pagination.pages = makeShortUsersResult.pages;

            return newState;
        case GET_USERS:
            let users = {};
            action.usersArr.forEach((user) => {
                users[user.id] = user;
            });

            newState = {...state};
            newState.users = users;

            makeShortUsersResult = makeShortUsers(newState);
            newState.shortUsers = makeShortUsersResult.shortUsers;
            newState.pagination.currentPage = makeShortUsersResult.currentPage;
            newState.pagination.pages = makeShortUsersResult.pages;

            return newState;
        case OPEN_ADD_USER_FORM:
            return {
                ...state,
                addUserForm: {
                    ...state.addUserForm,
                    open: true,
                },
            };
        case CLOSE_ADD_USER_FORM:
            return {
                ...state,
                addUserForm: {
                    ...state.addUserForm,
                    open: false,
                },
            };
        case SET_PERMISSIONS:
            return {
                ...state,
                addUserForm: {
                    ...state.addUserForm,
                    permissions: action.permissionsArr,
                },
            };
        case ADD_USER:
            newState = {...state};
            newState.users = {...newState.users};
            newState.users[action.user.id] = action.user;
            
            newState.addUserForm.newUser = true;
            
            makeShortUsersResult = makeShortUsers(newState);
            newState.shortUsers = makeShortUsersResult.shortUsers;
            newState.pagination.currentPage = makeShortUsersResult.currentPage;
            newState.pagination.pages = makeShortUsersResult.pages;

            newState.addUserForm.newUser = false;

            return newState;
        case OPEN_EDIT_USER_FORM:
            return {
                ...state,
                editUserForm: {
                    ...state.editUserForm,
                    open: true,
                    user: state.users[action.id],
                },
            };
        case CLOSE_EDIT_USER_FORM:
            return {
                ...state,
                editUserForm: {
                    ...state.editUserForm,
                    open: false,
                },
            };
        case EDIT_USER:
            newState = {...state};
            newState.users[action.user.id] = action.user;
            newState.shortUsers[action.user.id] = action.user;

            return newState;
        case RESET_CURRENT_PAGE_ADMIN:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    currentPage: 1,
                },
            };
        default:
            return state;
    }
}

export default adminPageReducer;