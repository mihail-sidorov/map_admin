import { connect } from 'react-redux';
import { closeDelPointFormActionCreator } from '../../../redux/pointsPageReducer';
import DelPointFormModalWindow from './DelPointForm';

let DelPointFormContainer = connect(
    state => ({
        delPointForm: state.pointsPageState.delPointForm,
    }),
    dispatch => ({
        onCloseDelPointForm: () => {
            dispatch(closeDelPointFormActionCreator());
        },
        onDelPoint: (id, permission) => {
            console.log(id);
            console.log(permission);
        }
    })
)(DelPointFormModalWindow);

export default DelPointFormContainer;