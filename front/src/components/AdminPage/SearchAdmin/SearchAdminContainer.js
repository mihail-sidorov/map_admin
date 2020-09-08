import { connect } from 'react-redux';
import SearchAdmin from './SearchAdmin';
import { changeSearchAdminActionCreator } from '../../../redux/adminPageReducer';

let SearchAdminContainer = connect(
    state => ({
        search: state.adminPageState.search,
    }),
    dispatch => ({
        onChangeSearch: (value) => {
            dispatch(changeSearchAdminActionCreator(value));
        },
    })
)(SearchAdmin);

export default SearchAdminContainer;