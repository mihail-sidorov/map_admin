import { connect } from 'react-redux';
import PointsPage from './PointsPage';
import authHOC from '../../HOC/authHOC';

let PointsPageContainer = connect(
    state => ({
        permission: state.authState.permission,
    }),
    dispatch => ({

    })
)(PointsPage);

PointsPageContainer = authHOC(PointsPageContainer);

export default PointsPageContainer;