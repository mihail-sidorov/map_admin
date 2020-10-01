import { connect } from 'react-redux';
import { changePageAdminRegionsActionCreator } from '../../../../redux/adminRegionsPageReducer';
import Pagination from '../../../PointsPage/Pagination/Pagination';

let mapStateToProps = (state) => {
    return {
        currentPage: state.adminRegionsPageState.pagination.currentPage,
        pages: state.adminRegionsPageState.pagination.pages,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => {
            console.log(page);
            dispatch(changePageAdminRegionsActionCreator(page));
        },
    };
}

let PaginationContainer = connect(mapStateToProps, mapDispatchToProps)(Pagination);

export default PaginationContainer;