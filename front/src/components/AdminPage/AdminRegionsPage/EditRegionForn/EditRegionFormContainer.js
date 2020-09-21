import { connect } from 'react-redux';
import { canselEditRegionActionCreator, editRegion, editRegionActionCreator } from '../../../../redux/adminRegionsPageReducer';
import EditRegionForm from './EditRegionForm';

let EditRegionFormContainer = connect(
    state => ({
        editRegionForm: state.adminRegionsPageState.editRegionForm,
    }),
    dispatch => ({
        onEditRegionForm: (values) => {
            if (values.region) {
                editRegion(values)
                    .then((region) => {
                        dispatch(editRegionActionCreator(region));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        onCanselEditRegion: () => {
            dispatch(canselEditRegionActionCreator());
        },
    })
)(EditRegionForm);

export default EditRegionFormContainer;