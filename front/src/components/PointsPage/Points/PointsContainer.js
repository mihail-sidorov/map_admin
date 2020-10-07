import { connect } from 'react-redux';
import PointsClassComponent from './Points';
import { showAddEditPointFormActionCreator, getPoints, getPointsActionCreator, showTakePointsActionCreator } from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        points: state.pointsPageState.shortPoints,
        duplicate: state.pointsPageState.duplicate,
        moderTabs: state.pointsPageState.moderTabs,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        showAddEditPointForm: (action) => {
            dispatch(showAddEditPointFormActionCreator(action));
        },
        getPoints: (permission) => {
            getPoints(permission)
            .then((pointsArr) => {
                dispatch(getPointsActionCreator(pointsArr));
            })
            .catch((error) => {
                console.log(error);
            });
        },
        onShowTakePoints: () => {
            dispatch(showTakePointsActionCreator());
        },
    };
}

const PointsContainer = connect(mapStateToProps, mapDispatchToProps)(PointsClassComponent);

export default PointsContainer;