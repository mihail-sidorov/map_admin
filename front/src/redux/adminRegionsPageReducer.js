const CHANGE_SEARCH_ADMIN_REGIONS = 'CHANGE_SEARCH_ADMIN_REGIONS';

let initialState = {
    regions: {},
    shortRegions: {},
    search: '',
    pagination: {
        count: 2,
        currentPage: 1,
        pages: 0,
    },
};

// Запросы к API

// Создание ActionCreator
export let changeSearchAdminRegionsActionCreator = (value) => ({
    type: CHANGE_SEARCH_ADMIN_REGIONS,
    value: value,
})

let adminRegionsPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SEARCH_ADMIN_REGIONS:
            return {
                ...state,
                search: action.value,
            };
        default:
            return state;
    }
}

export default adminRegionsPageReducer;