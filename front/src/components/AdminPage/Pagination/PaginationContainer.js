import { connect } from 'react-redux';
import Pagination from '../../PointsPage/Pagination/Pagination';
import { changePageAdminActionCreator, closeAddUserFormActionCreator } from '../../../redux/adminPageReducer';

let mapStateToProps = (state) => {
    return {
        currentPage: state.adminPageState.pagination.currentPage,
        pages: state.adminPageState.pagination.pages,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => {
            dispatch(closeAddUserFormActionCreator());
            dispatch(changePageAdminActionCreator(page));
        },
    };
}

let PaginationContainer = connect(mapStateToProps, mapDispatchToProps)(Pagination);

export default PaginationContainer;