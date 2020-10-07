import { connect } from 'react-redux';
import { closeTakePointsActionCreator } from '../../../redux/pointsPageReducer';
import TakePointsModalWindow from './TakePoints';

let TakePointsContainer = connect(
    state => ({
        takePoints: state.pointsPageState.takePoints,
    }),
    dispatch => ({
        onCloseTakePoints: () => {
            dispatch(closeTakePointsActionCreator());
        },
    })
)(TakePointsModalWindow);

export default TakePointsContainer;