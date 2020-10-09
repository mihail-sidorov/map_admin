import { connect } from 'react-redux';
import Points from './Points';

let PointsContainer = connect(
    state => ({
        points: state.pointsPageState.takePoints.shortPoints,
    }),
    dispatch => ({

    })
)(Points);

export default PointsContainer;