import {
    GETHOMEADS_SUCCESS,
    GETHOMEADS_FAILURE,
} from '../actions/SoleCompany';

export default function SoleCompany(state = {
    SoleCompanyData: {},
}, action) {
    switch (action.type) {
        case GETHOMEADS_SUCCESS:
            return {
                ...state,
                SoleCompanyData: action.result,
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