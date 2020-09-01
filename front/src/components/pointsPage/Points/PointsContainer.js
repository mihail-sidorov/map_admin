import { connect } from 'react-redux';
import Points from './Points';
import { showAddEditPointFormActionCreator } from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        points: state.pointsPageState.shortPoints,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        showAddEditPointForm: (action) => {
            dispatch(showAddEditPointFormActionCreator(action));
        }
    };
}

const PointsContainer = connect(mapStateToProps, mapDispatchToProps)(Points);

export default PointsContainer;