import { connect } from 'react-redux';
import Point from './Point';

let PointContainer = (id) => {
    return connect(
        state => ({
            point: state.pointsPageState.takePoints.shortPoints[id],
        }),
        dispatch => ({

        })
    )(Point);
}

export default PointContainer;