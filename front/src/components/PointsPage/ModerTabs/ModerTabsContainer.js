import { connect } from 'react-redux';
import { setAuthDataActionCreator } from '../../../redux/authReducer';
import { getPoints, getPointsActionCreator, resetPaginationPointsActionCreator, resetPointsActionCreator, resetSearchPointsActionCreator, setModerTabsActiveActionCreator } from '../../../redux/pointsPageReducer';
import ModerTabs from './ModerTabs';

let ModerTabsContainer = connect(
    state => ({
        moderTabs: state.pointsPageState.moderTabs,
        moderTabsActive: state.pointsPageState.moderTabsActive,
    }),
    dispatch => ({
        onGoToPoints: () => {
            dispatch(resetPaginationPointsActionCreator());
            dispatch(resetSearchPointsActionCreator());
            dispatch(resetPointsActionCreator());
            dispatch(setAuthDataActionCreator({...window.store.getState().authState, permission: 'user'}));
            dispatch(setModerTabsActiveActionCreator(2));

            getPoints('user')
                .then((pointsArr) => {
                    dispatch(getPointsActionCreator(pointsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        onGoToModer: () => {
            dispatch(resetPaginationPointsActionCreator());
            dispatch(resetSearchPointsActionCreator());
            dispatch(resetPointsActionCreator());
            dispatch(setAuthDataActionCreator({...window.store.getState().authState, permission: 'moder'}));
            dispatch(setModerTabsActiveActionCreator(1));

            getPoints('moder')
                .then((pointsArr) => {
                    dispatch(getPointsActionCreator(pointsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    })
)(ModerTabs);

export default ModerTabsContainer;