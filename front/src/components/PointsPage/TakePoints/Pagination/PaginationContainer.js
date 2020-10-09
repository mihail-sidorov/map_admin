import { connect } from 'react-redux';
import { changePageTakePointsActionCreator } from '../../../../redux/pointsPageReducer';
import Pagination from '../../Pagination/Pagination';

let PaginationContainer = connect(
    state => ({
        currentPage: state.pointsPageState.takePoints.pagination.currentPage,
        pages: state.pointsPageState.takePoints.pagination.pages,
    }),
    dispatch => ({
        changePage: (page) => {
            dispatch(changePageTakePointsActionCreator(page));
        },
    })
)(Pagination);

export default PaginationContainer;