import { connect } from 'react-redux';
import Region from './Region';

let RegionContainer = (id) => {
    return connect(
        state => ({
            region: state.adminRegionsPageState.shortRegions[id],
        }),
        dispatch => ({
            onOpenEditRegionForm: (id) => {
                
            },
        })
    )(Region);
}

export default RegionContainer;