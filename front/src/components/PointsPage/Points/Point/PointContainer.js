import { connect } from 'react-redux';
import { showAddEditPointFormActionCreator, showRefusePointFormActionCreator, showDelPointFormActionCreator, returnPoint, delPointActionCreator, addTakePointActionCreator } from '../../../../redux/pointsPageReducer';
import Point from './Point';

let PointContainer = (id) => {
    let mapStateToProps = (state) => {
        return {
            point: state.pointsPageState.shortPoints[id],
            moderTabsActive: state.pointsPageState.moderTabsActive,
            moderTabs: state.pointsPageState.moderTabs,
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
            onReturnPoint: (id, status) => {
                returnPoint(id)
                    .then((point) => {
                        if (status === 'take') {
                            dispatch(delPointActionCreator(point.id));
                        }
                        if (status === 'accept') {
                            dispatch(addTakePointActionCreator(point));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(Point);
}

export default PointContainer;