const SET_AUTH_DATA = 'SET_AUTH_DATA';

let initialState = {
    login: null,
    isAuth: false,
    permission: null,
};

export let login = (login, password) => {
    return new Promise((resolve, reject) =>  {
        setTimeout(() => {
            resolve(true);
        }, 1000);
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
    return new Promise((resolve, reject) =>  {
        setTimeout(() => {
            resolve({login: 'Mihail', isAuth: true});
        }, 1000);
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