import {
    GETHOMEADS_SUCCESS,
    GETHOMEADS_FAILURE,
} from '../actions/SoleLabor';

export default function SoleLabor(state = {
    SoleLaborData: {},
}, action) {
    switch (action.type) {
        case GETHOMEADS_SUCCESS:
            return {
                ...state,
                SoleLaborData: action.result,
            };
        case GETHOMEADS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        default:
            return state
    }
};