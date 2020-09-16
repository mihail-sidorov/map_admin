import { connect } from 'react-redux';
import ModerTabs from './ModerTabs';

let ModerTabsContainer = connect(
    state => ({
        moderTabs: state.authState.moderTabs,
    }),
    dispatch => ({

    })
)(ModerTabs);

export default ModerTabsContainer;