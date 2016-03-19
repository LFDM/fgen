import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { {{ name }} } from './presenter';

import {
} from '../../actions';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    const actions = {};
    return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)({{ name }});
