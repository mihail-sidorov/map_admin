import { connect } from 'react-redux';
import { acceptPoint, closeAcceptPointFormActionCreator, delPointActionCreator } from '../../../redux/pointsPageReducer';
import AcceptPointFormModalWindow from './AcceptPointForm';

let AcceptPointFormContainer = connect(
    state => ({
        acceptPointForm: state.pointsPageState.acceptPointForm,
    }),
    dispatch => ({
        onCloseAcceptPointForm: () => {
            dispatch(closeAcceptPointFormActionCreator());
        },
        onAcceptTakeReturnPoint: (id) => {
            acceptPoint(id)
                .then(() => {
                    dispatch(delPointActionCreator(id));
                    dispatch(closeAcceptPointFormActionCreator());
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    })
)(AcceptPointFormModalWindow);

export default AcceptPointFormContainer;