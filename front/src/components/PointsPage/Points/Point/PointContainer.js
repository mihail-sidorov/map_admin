import { connect } from 'react-redux';
import {delPointActionCreator, showAddEditPointFormActionCreator, delPoint, refusePoint, showRefusePointFormActionCreator, showDelPointFormActionCreator} from '../../../../redux/pointsPageReducer';
import Point from './Point';

let PointContainer = (id) => {
    let mapStateToProps = (state) => {
        return {
            point: state.pointsPageState.shortPoints[id],
            moderTabsActive: state.pointsPageState.moderTabsActive,
        };
    }

    let mapDispatchToProps = (dispatch) => {
        return {
            onShowDelPointForm: (id, permission) => {
                dispatch(showDelPointFormActionCreator(id, permission));
            },
            showAddEditPointForm: (action, id) => {
                dispatch(showAddEditPointFormActionCreator(action, id));
            },
            onShowRefusePointForm: (id) => {
                dispatch(showRefusePointFormActionCreator(id));
            },
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(Point);
}

export default PointContainer;