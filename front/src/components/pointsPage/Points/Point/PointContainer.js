import { connect } from 'react-redux';
import {delPointActionCreator} from '../../../../redux/pointsPageReducer';
import Point from './Point';

let PointContainer = (id) => {
    let mapStateToProps = (state) => {
        return {
            point: state.pointsPageState.shortPoints[id],
        };
    }

    let mapDispatchToProps = (dispatch) => {
        return {
            delPoint: (id) => {
                dispatch(delPointActionCreator(id));
            },
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(Point);
}

export default PointContainer;