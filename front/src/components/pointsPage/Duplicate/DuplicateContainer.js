import { connect } from 'react-redux';
import Duplicate from './Duplicate';
import { canselDuplicateActionCreator } from '../../../redux/pointsPageReducer';

let DuplicateContainer = connect(
    state => ({
        duplicate: state.pointsPageState.duplicate,
    }),
    dispatch => ({
        cansel: () => {
            dispatch(canselDuplicateActionCreator());
        },
    }),
)(Duplicate);

export default DuplicateContainer;