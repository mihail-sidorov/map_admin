import { connect } from 'react-redux';
import Pagination from '../../PointsPage/Pagination/Pagination';
import { changePageAdminActionCreator } from '../../../redux/adminPageReducer';

let mapStateToProps = (state) => {
    return {
        currentPage: state.adminPageState.pagination.currentPage,
        pages: state.adminPageState.pagination.pages,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => {
            dispatch(changePageAdminActionCreator(page));
        },
    };
}

let PaginationContainer = connect(mapStateToProps, mapDispatchToProps)(Pagination);

export default PaginationContainer;