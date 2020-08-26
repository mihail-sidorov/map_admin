import * as axios from 'axios';

const SET_AUTH_DATA = 'SET_AUTH_DATA';

let initialState = {
    login: null,
    isAuth: false,
    permission: null,
};

export let login = (login, password) => {
    return axios.post('http://mapadmin.karmydev.ru/api/login', {login: login, password: password, withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response;
        }
        else {
            throw 'Ошибка авторизации!';
        }
    });
}

export let logout = () => {
    return new Promise((resolve, reject) =>  {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

export let getAuthData = () => {
    return axios.get('http://mapadmin.karmydev.ru/api/getAuthData', {withCredentials: true}).then((response) => {
        return response;
    });
}

export let setAuthDataActionCreator = (data) => {
    return {
        type: SET_AUTH_DATA,
        data: data,
    };
}

let authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_DATA:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
}

export default authReducer;