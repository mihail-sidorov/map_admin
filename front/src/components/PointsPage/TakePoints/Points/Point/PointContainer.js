import { connect } from 'react-redux';
import Point from './Point';
import { addTakePointActionCreator, takePoint } from '../../../../../redux/pointsPageReducer';

let PointContainer = (id) => {
    return connect(
        state => ({
            point: state.pointsPageState.takePoints.shortPoints[id],
        }),
        dispatch => ({
            onTakePoint: (id) => {
                takePoint(id)
                    .then((point) => {
                        dispatch(addTakePointActionCreator(point));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        })
    )(Point);
}

export default PointContainer;