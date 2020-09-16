import * as axios from 'axios';
import serverName from '../serverName';

const SET_AUTH_DATA = 'SET_AUTH_DATA', CHANGE_HEADER_LOGIN = 'CHANGE_HEADER_LOGIN', RESET_MODER_TABS = 'RESET_MODER_TABS';

let initialState = {
    login: null,
    isAuth: false,
    permission: null,
    loginAs: false,
    moderTabs: false,
};

export let login = (login, password) => {
    return axios.post(`${serverName}/api/login`, {login: login, password: password}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return 'OK';
        }
        else {
            throw 'Ошибка авторизации!';
        }
    });
}

export let logout = () => {
    return axios.post(`${serverName}/api/logout`, {}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return 'OK';
        }
        else {
            throw 'Ошибка разлогинивания!';
        }
    });
}

export let getAuthData = () => {
    return axios.get(`${serverName}/api/getAuthData`, {withCredentials: true}).then((response) => {
        return response.data;
    });
}

export let setAuthDataActionCreator = (data) => {
    return {
        type: SET_AUTH_DATA,
        data: data,
    };
}

export let changeHeaderLoginActionCreator = (login) => ({
    type: CHANGE_HEADER_LOGIN,
    login: login,
})

export let resetModerTabsActionCreator = () => ({
    type: RESET_MODER_TABS,
})

let authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_DATA:
            let moderTabs = state.moderTabs;
            if (!moderTabs && action.data.permission === 'moder') moderTabs = true;

            return {
                ...action.data,
                moderTabs: moderTabs,
            };
        case CHANGE_HEADER_LOGIN:
            return {
                ...state,
                login: action.login,
            };
        case RESET_MODER_TABS:
            return {
                ...state,
                moderTabs: false,
            };
        default:
            return state;
    }
}

export default authReducer;