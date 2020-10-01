import * as axios from 'axios';
import serverName from '../serverName';

const DEL_POINT = 'DEL_POINT', CHANGE_PAGE = 'CHANGE_PAGE', CHANGE_SEARCH = 'CHANGE_SEARCH', SHOW_ADD_EDIT_POINT_FORM = 'SHOW_ADD_EDIT_POINT_FORM', ADD_POINT = 'ADD_POINT', EDIT_POINT = 'EDIT_POINT', GET_POINTS = 'GET_POINTS', ADD_DUPLICATE = 'ADD_DUPLICATE', CANSEL_DUPLICATE = 'CANSEL_DUPLICATE', RESET_PAGINATION_POINTS = 'RESET_PAGINATION_POINTS', RESET_POINTS = 'RESET_POINTS', RESET_SEARCH_POINTS = 'RESET_SEARCH_POINTS', SET_MODER_TABS = 'SET_MODER_TABS', RESET_MODER_TABS = 'RESET_MODER_TABS', SET_MODER_TABS_ACTIVE = 'SET_MODER_TABS_ACTIVE', SHOW_REFUSE_POINT_FORM = 'SHOW_REFUSE_POINT_FORM', CLOSE_REFUSE_POINT_FORM = 'CLOSE_REFUSE_POINT_FORM', SHOW_DEL_POINT_FORM = 'SHOW_DEL_POINT_FORM', CLOSE_DEL_POINT_FORM = 'CLOSE_DEL_POINT_FORM';

let makeShortPoints = (state) => {
    let searchPoints = {}, shortPoints = {};

    if (state.search !== '') {
        for (let id in state.points) {
            let pattern = new RegExp(state.search.toLowerCase()), searchStr = '';

            for (let property in state.points[id]) {
                if (property === 'apartment' || property === 'full_city_name' || property === 'hours' || property === 'house' || property === 'lat' 
                    || property === 'lng' || property === 'phone' || property === 'site' || property === 'street' || property === 'title')
                {
                    if (state.points[id][property] !== undefined && state.points[id][property] !== null && state.points[id][property] !== '') {
                        searchStr += state.points[id][property];
                    }
                }
            }

            if (searchStr.toLowerCase().match(pattern)) {
                searchPoints[id] = state.points[id];
            }
        }
    }
    else {
        searchPoints = state.points;
    }

    let paginationCount = state.pagination.count;
    let currentPage = state.pagination.currentPage;
    
    let pages = Math.floor(Object.keys(searchPoints).length / paginationCount);
    if (Object.keys(searchPoints).length % paginationCount > 0) {
        pages++;
    }
    if (currentPage > pages || state.addEditPointForm.newPoint === true) {
        currentPage = pages;
    }

    if (currentPage === 0) currentPage = 1;

    let left = (currentPage - 1) * paginationCount + 1;
    let right = left + paginationCount - 1;
    let i = 1;

    for (let id in searchPoints) {
        if (i >= left && i <= right) {
            shortPoints[id] = searchPoints[id];
        }
        i++;
    }

    return {
        shortPoints: shortPoints,
        currentPage: currentPage,
        pages: pages,
    };
}

let resetAddEditPointForm = () => {
    return {
        action: null,
        point: {},
        newPoint: false,
    };
}

let initialState = {
    points: {},
    duplicate: {},
    shortPoints: {},
    addEditPointForm: {
        action: null,
        point: {},
        newPoint: false,
        open: false,
    },
    search: '',
    pagination: {
        count: 5,
        currentPage: 1,
        pages: 0,
    },
    moderTabs: false,
    moderTabsActive: 1,
    refusePointForm: {
        open: false,
        id: null,
    },
    delPointForm: {
        open: false,
        id: null,
        permission: null,
    },
};

// Запросы к API
export let addPoint = (point) => {
    return axios.post(`${serverName}/api/user/addPoint`, point, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return {
                point: response.data.response[0],
            };
        }
        else {
            if (response.data.response.duplicate) {
                return {
                    duplicate: response.data.response.duplicate,
                }
            }
        }

        throw 'Не удалось добавить точку!';
    });
}

export let editPoint = (point, permission) => {
    return axios.post(`${serverName}/api/${permission}/editPoint/${point.id}`, point, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            if (permission === 'user') {
                return {
                    point: response.data.response[0],
                };
            }
            if (permission === 'moder') {
                return {
                    id: response.data.response,
                };
            }
        }
        else {
            if (response.data.response.duplicate) {
                return {
                    duplicate: response.data.response.duplicate,
                }
            }
        }

        if (permission === 'user') {
            throw 'Не удалось отредактировать точку!';
        }
        if (permission === 'moder') {
            throw 'Не удалось промодерировать точку!';
        }
    });
}

export let getPoints = (permission) => {
    return axios.get(`${serverName}/api/${permission}/getPoints`, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось получить точки!';
        }
    });
}

export let delPoint = (id) => {
    return axios.post(`${serverName}/api/user/delPoint`, {id: id}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось удалить точку!';
        }
    });
}

export let refusePoint = (data) => {
    return axios.post(`${serverName}/api/moder/setPointRefuse`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось отклонить точку!';
        }
    });
}

export let acceptPoint = (id) => {
    return axios.post(`${serverName}/api/moder/setPointAccept`, {id: id}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось подтвердить точку!';
        }
    });
}

// Создание ActionCreator
export let delPointActionCreator = (id) => {
    return {
        type: DEL_POINT,
        id: id,
    };
}

export let changePageActionCreator = (page) => {
    return {
        type: CHANGE_PAGE,
        page: page,
    };
}

export let changeSearchActionCreator = (search) => {
    return {
        type: CHANGE_SEARCH,
        search: search,
    };
}

export let showAddEditPointFormActionCreator = (action, id = null) => {
    return {
        type: SHOW_ADD_EDIT_POINT_FORM,
        action: action,
        id: id,
    };
}

export let addPointActionCreator = (point) => {
    return {
        type: ADD_POINT,
        point: point,
    };
}

export let editPointActionCreator = (point) => {
    return {
        type: EDIT_POINT,
        point: point,
    };
}

export let getPointsActionCreator = (pointsArr) => {
    return {
        type: GET_POINTS,
        pointsArr: pointsArr,
    };
}

export let addDuplicateActionCreator = (duplicate, point) => {
    return {
        type: ADD_DUPLICATE,
        duplicate: duplicate,
        point: point,
    };
}

export let canselDuplicateActionCreator = () => {
    return {
        type: CANSEL_DUPLICATE,
    };
}

export let resetPaginationPointsActionCreator = () => ({
    type: RESET_PAGINATION_POINTS,
})

export let resetPointsActionCreator = () => ({
    type: RESET_POINTS,
})

export let resetSearchPointsActionCreator = () => ({
    type: RESET_SEARCH_POINTS,
})

export let setModerTabsActionCreator = () => ({
    type: SET_MODER_TABS,
})

export let resetModerTabsActionCreator = () => ({
    type: RESET_MODER_TABS,
})

export let setModerTabsActiveActionCreator = (index) => ({
    type: SET_MODER_TABS_ACTIVE,
    index: index,
})

export let showRefusePointFormActionCreator = (id) => ({
    type: SHOW_REFUSE_POINT_FORM,
    id: id,
})

export let closeRefusePointFormActionCreator = () => ({
    type: CLOSE_REFUSE_POINT_FORM,
})

export let showDelPointFormActionCreator = (id, permission) => ({
    type: SHOW_DEL_POINT_FORM,
    id: id,
    permission: permission,
})

export let closeDelPointFormActionCreator = () => ({
    type: CLOSE_DEL_POINT_FORM,
})

let pointsPageReducer = (state = initialState, action) => {
    let newState, makeShortPointsResult;

    switch (action.type) {
        case DEL_POINT:
            newState = {...state};
            newState.points = {...state.points};
            delete newState.points[action.id];

            newState.addEditPointForm = resetAddEditPointForm();

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case CHANGE_PAGE:
            newState = {...state};
            newState.pagination.currentPage = action.page;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case CHANGE_SEARCH:
            newState = {...state};
            newState.search = action.search;
            newState.pagination.currentPage = 1;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case SHOW_ADD_EDIT_POINT_FORM:
            newState = {...state};
            newState.addEditPointForm.action = action.action;

            if (action.action === null) {
                newState.addEditPointForm.open = false;
            }
            else {
                newState.addEditPointForm.open = true;
            }

            if (action.action === null || action.action === 'add') {
                newState.addEditPointForm.point = {};
            }
            else {
                newState.addEditPointForm.point = {...newState.points[action.id]};
            }

            return newState;
        case ADD_POINT:
            newState = {...state};
            newState.points[action.point.id] = action.point;

            newState.addEditPointForm.newPoint = true;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            newState.addEditPointForm = resetAddEditPointForm();

            return newState;
        case EDIT_POINT:
            newState = {...state};
            newState.points[action.point.id] = {...action.point};
            newState.shortPoints[action.point.id] = newState.points[action.point.id];

            newState.addEditPointForm = resetAddEditPointForm();

            return newState;
        case GET_POINTS:
            let points = {};
            action.pointsArr.forEach((point) => {
                points[point.id] = point;
            });

            newState = {...state};
            newState.points = points;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case ADD_DUPLICATE:
            newState = {...state};
            newState.duplicate = {...action.duplicate};
            newState.addEditPointForm = {
                ...newState.addEditPointForm,
                open: false,
            };

            newState.addEditPointForm.point = {...action.point};
            
            return newState;
        case CANSEL_DUPLICATE:
            return {
                ...state,
                duplicate: {},
            };
        case RESET_PAGINATION_POINTS:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    currentPage: 1,
                    pages: 0,
                },
            };
        case RESET_POINTS:
            return {
                ...state,
                points: {},
                shortPoints: {},
            };
        case RESET_SEARCH_POINTS:
            return {
                ...state,
                search: '',
            };
        case SET_MODER_TABS:
            return {
                ...state,
                moderTabs: true,
            };
        case RESET_MODER_TABS:
            return {
                ...state,
                moderTabs: false,
            };
        case SET_MODER_TABS_ACTIVE:
            return {
                ...state,
                moderTabsActive: action.index,
            };
        case SHOW_REFUSE_POINT_FORM:
            return {
                ...state,
                refusePointForm: {
                    ...state.refusePointForm,
                    open: true,
                    id: action.id,
                },
            };
        case CLOSE_REFUSE_POINT_FORM:
            return {
                ...state,
                refusePointForm: {
                    ...state.refusePointForm,
                    open: false,
                    id: null,
                },
            };
        case SHOW_DEL_POINT_FORM:
            return {
                ...state,
                delPointForm: {
                    ...state.delPointForm,
                    open: true,
                    id: action.id,
                    permission: action.permission,
                },
            };
        case CLOSE_DEL_POINT_FORM:
            return {
                ...state,
                delPointForm: {
                    ...state.delPointForm,
                    open: false,
                    id: null,
                    permission: null,
                },
            };
        default:
            return state;
    }
}

export default pointsPageReducer;