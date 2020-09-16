import { connect } from 'react-redux';
import { changeSearchAdminRegionsActionCreator } from '../../../../redux/adminRegionsPageReducer';
import SearchAdminRegions from './SearchAdminRegions';

let SearchAdminRegionsContainer = connect(
    state => ({
        search: state.adminRegionsPageState.search,
    }),
    dispatch => ({
        onChangeSearch: (value) => {
            dispatch(changeSearchAdminRegionsActionCreator(value));
        },
    })
)(SearchAdminRegions);

export default SearchAdminRegionsContainer;