import { connect } from 'react-redux';
import { changeSearchPointsFreeActionCreator } from '../../../../redux/pointsPageReducer';
import SearchPoints from '../../SearchPoints/SearchPoints';

let SearchContainer = connect(
    state => ({
        search: state.pointsPageState.takePoints.search,
    }),
    dispatch => ({
        changeSearch: (value) => {
            dispatch(changeSearchPointsFreeActionCreator(value));
        },
    })
)(SearchPoints);

export default SearchContainer;