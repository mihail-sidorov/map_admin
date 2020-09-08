import { connect } from 'react-redux';
import {delPointActionCreator, showAddEditPointFormActionCreator, delPoint} from '../../../../redux/pointsPageReducer';
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
                delPoint(id)
                .then((id) => {
                    dispatch(delPointActionCreator(id));
                })
                .catch((error) => {
                    console.log(error);
                });
            },
            showAddEditPointForm: (action, id) => {
                dispatch(showAddEditPointFormActionCreator(action, id));
            }
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(Point);
}

export default PointContainer;