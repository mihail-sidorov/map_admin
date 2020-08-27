const DEL_POINT = 'DEL_POINT', CHANGE_PAGE = 'CHANGE_PAGE', CHANGE_SEARCH = 'CHANGE_SEARCH';

let makeShortPoints = (state) => {
    let searchPoints = {}, shortPoints = {};

    if (state.search !== '') {
        for (let id in state.points) {
            let pattern = new RegExp(state.search.toLowerCase());
            if (state.points[id].city.toLowerCase().match(pattern)) {
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
    if (currentPage > pages || state.addEditForm.action === 'add') {
        currentPage = pages;
    }

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

let initialState = {
    points: {
        1: {
            id: 1,
            city: 'city1',
            name: 'name1',
            long: 'long1',
            lat: 'lat1',
        },
        2: {
            id: 2,
            city: 'city2',
            name: 'name2',
            long: 'long2',
            lat: 'lat2',
        },
        3: {
            id: 3,
            city: 'city11',
            name: 'name3',
            long: 'long3',
            lat: 'lat3',
        },
        4: {
            id: 4,
            city: 'city3',
            name: 'name4',
            long: 'long4',
            lat: 'lat4',
        },
        5: {
            id: 5,
            city: 'city111',
            name: 'name5',
            long: 'long5',
            lat: 'lat5',
        },
    },
    shortPoints: {},
    addEditForm: {
        action: null,
        point: {
            id: null,
            city: null,
            name: null,
            long: null,
            lat: null,
        },
    },
    search: '',
    pagination: {
        count: 2,
        currentPage: 1,
        pages: 0,
    },
};

let makeShortPointsResult = makeShortPoints(initialState);
initialState.shortPoints = makeShortPointsResult.shortPoints;
initialState.pagination.currentPage = makeShortPointsResult.currentPage;
initialState.pagination.pages = makeShortPointsResult.pages;

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

let pointsPageReducer = (state = initialState, action) => {
    let newState, makeShortPointsResult;

    switch (action.type) {
        case DEL_POINT:
            newState = {...state};
            newState.points = {...state.points};
            delete newState.points[action.id];

            newState.addEditForm = {
                action: null,
                fields: {
                    id: null,
                    city: null,
                    name: null,
                    long: null,
                    lat: null,
                },
            };

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
        default:
            return state;
    }
}

export default pointsPageReducer;