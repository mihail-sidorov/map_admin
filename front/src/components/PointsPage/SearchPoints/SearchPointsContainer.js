import { connect } from 'react-redux';
import SearchPoints from './SearchPoints';
import {changeSearchActionCreator, showAddEditPointFormActionCreator} from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        search: state.pointsPageState.search,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        changeSearch: (search) => {
            dispatch(showAddEditPointFormActionCreator(null));
            dispatch(changeSearchActionCreator(search));
        },
    };
}

let SearchPointsContainer =  connect(mapStateToProps, mapDispatchToProps)(SearchPoints);

export default SearchPointsContainer;