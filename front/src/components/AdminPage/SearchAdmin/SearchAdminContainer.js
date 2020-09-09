import { connect } from 'react-redux';
import SearchAdmin from './SearchAdmin';
import { changeSearchAdminActionCreator, closeAddUserFormActionCreator } from '../../../redux/adminPageReducer';

let SearchAdminContainer = connect(
    state => ({
        search: state.adminPageState.search,
    }),
    dispatch => ({
        onChangeSearch: (value) => {
            dispatch(closeAddUserFormActionCreator());
            dispatch(changeSearchAdminActionCreator(value));
        },
    })
)(SearchAdmin);

export default SearchAdminContainer;