import { connect } from 'react-redux';
import Pagination from './Pagination';
import {changePageActionCreator, showAddEditPointFormActionCreator} from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        currentPage: state.pointsPageState.pagination.currentPage,
        pages: state.pointsPageState.pagination.pages,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => {
            dispatch(showAddEditPointFormActionCreator(null));
            dispatch(changePageActionCreator(page));
        },
    };
}

let PaginationContainer = connect(mapStateToProps, mapDispatchToProps)(Pagination);

export default PaginationContainer;