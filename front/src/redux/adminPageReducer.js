import * as axios from 'axios';
import serverName from "../serverName";

const CHANGE_PAGE_ADMIN = 'CHANGE_PAGE_ADMIN', CHANGE_SEARCH_ADMIN = 'CHANGE_SEARCH_ADMIN', GET_USERS = 'GET_USERS', OPEN_ADD_USER_FORM = 'OPEN_ADD_USER_FORM', CLOSE_ADD_USER_FORM = 'CLOSE_ADD_USER_FORM', SET_PERMISSIONS = 'SET_PERMISSIONS', ADD_USER = 'ADD_USER', OPEN_EDIT_USER_FORM = 'OPEN_EDIT_USER_FORM', CLOSE_EDIT_USER_FORM = 'CLOSE_EDIT_USER_FORM', EDIT_USER = 'EDIT_USER', RESET_PAGINATION_ADMIN = 'RESET_PAGINATION_ADMIN', RESET_SEARCH_ADMIN = 'RESET_SEARCH_ADMIN', SET_REGIONS_TO_ADD_USER_FORM = 'SET_REGIONS_TO_ADD_USER_FORM', CHANGE_USER_ON_ADD_USER_FORM = 'CHANGE_USER_ON_ADD_USER_FORM';

let makeShortUsers = (state) => {
    let searchUsers = {}, shortUsers = {};

    if (state.search !== '') {
        for (let id in state.users) {
            let pattern = new RegExp(state.search.toLowerCase()), searchStr = '';

            for (let property in state.users[id]) {
                if (property === 'email' || property === 'permission' || property === 'region') {
                    if (state.users[id][property] !== undefined && state.users[id][property] !== null && state.users[id][property] !== '') {
                        if (property === 'permission') {
                            if (state.users[id][property] === 'admin') searchStr += 'Администратор';
                            if (state.users[id][property] === 'moder') searchStr += 'Модератор';
                            if (state.users[id][property] === 'user') searchStr += 'Пользователь';
                        }
                        else {
                            searchStr += state.users[id][property];
                        }
                    }
                }
            }

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

    if (currentPage === 0) currentPage = 1;

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
        count: 10,
        currentPage: 1,
        pages: 0,
    },
    addUserForm: {
        open: false,
        newUser: false,
        permissions: [],
        regions: [],
        user: {
            email: '',
            password: '',
            permission: 0,
            region: 0,
        },
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

export let loginAs = (id) => {
    return axios.post(`${serverName}/api/admin/loginAs`, {id: id}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось войти под пользователем!';
        }
    });
}

export let returnToAdmin = () => {
    return axios.post(`${serverName}/api/admin/returnToAdmin`, {}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось вернуться под админа!';
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

export let resetPaginationAdminActionCreator = () => ({
    type: RESET_PAGINATION_ADMIN,
})

export let resetSearchAdminActionCreator = () => ({
    type: RESET_SEARCH_ADMIN,
})

export let setRegionsToAddUserFormActionCreator = (regionsArr) => ({
    type: SET_REGIONS_TO_ADD_USER_FORM,
    regionsArr: regionsArr,
})

export let changeUserOnAddUserFormActionCreator = (user) => ({
    type: CHANGE_USER_ON_ADD_USER_FORM,
    user: user,
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
                    user: {
                        email: '',
                        password: '',
                        permission: 0,
                        region: 0,
                    },
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
        case RESET_PAGINATION_ADMIN:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    currentPage: 1,
                    pages: 0,
                },
            };
        case RESET_SEARCH_ADMIN:
            return {
                ...state,
                search: '',
            };
        case SET_REGIONS_TO_ADD_USER_FORM:
            return {
                ...state,
                addUserForm: {
                    ...state.addUserForm,
                    regions: action.regionsArr,
                },
            };
        case CHANGE_USER_ON_ADD_USER_FORM:
            return {
                ...state,
                addUserForm: {
                    ...state.addUserForm,
                    user: action.user,
                },
            };
        default:
            return state;
    }
}

export default adminPageReducer;