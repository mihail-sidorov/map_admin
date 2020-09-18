import { connect } from 'react-redux';
import { getRegions, getRegionsActionCreator } from '../../../../redux/adminRegionsPageReducer';
import RegionsRequest from './Regions';

let RegionsContainer = connect(
    state => ({
        regions: state.adminRegionsPageState.shortRegions,
    }),
    dispatch => ({
        onOpenAddRegionForm: () => {
            
        },
        onGetRegions: () => {
            getRegions()
                .then((regionsArr) => {
                    dispatch(getRegionsActionCreator(regionsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    })
)(RegionsRequest);

export default RegionsContainer;