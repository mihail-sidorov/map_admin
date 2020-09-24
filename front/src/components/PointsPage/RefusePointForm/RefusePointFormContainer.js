import { connect } from 'react-redux';
import { closeRefusePointFormActionCreator, delPointActionCreator, refusePoint } from '../../../redux/pointsPageReducer';
import RefusePointFormModalWindow from './RefusePointForm';

let RefusePointFormContainer = connect(
    state => ({
        refusePointForm: state.pointsPageState.refusePointForm,
    }),
    dispatch => ({
        onCanselRefusePoint: () => {
            dispatch(closeRefusePointFormActionCreator());
        },
        onRefusePoint: (values) => {
            if (values.id && values.description) {
                console.log(values);
                refusePoint(values)
                    .then(() => {
                        dispatch(delPointActionCreator(values.id));
                        dispatch(closeRefusePointFormActionCreator());
                    });
            }
        },
    })
)(RefusePointFormModalWindow);

export default RefusePointFormContainer;