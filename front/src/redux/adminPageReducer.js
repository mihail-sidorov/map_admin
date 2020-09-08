import * as axios from 'axios';
import serverName from "../serverName";

const CHANGE_PAGE_ADMIN = 'CHANGE_PAGE_ADMIN', CHANGE_SEARCH_ADMIN = 'CHANGE_SEARCH_ADMIN', GET_USERS = 'GET_USERS';

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
        default:
            return state;
    }
}

export default adminPageReducer;