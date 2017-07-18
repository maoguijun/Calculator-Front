import {
    GETHOMEADS_SUCCESS,
    GETHOMEADS_FAILURE,
    GETINSUR_SUCCESS,
    GETINSUR_FAILURE,
    GETBASE_SUCCESS,
    GETBASE_FAILURE
} from '../actions/SoleSalary';

export default function SoleSalary(state = {
    SoleSalaryData: {},
    SoleSalaryInsurData: {},
    SoleSalaryBaseData: {},
}, action) {
    switch (action.type) {
        case GETHOMEADS_SUCCESS:
            return {
                ...state,
                SoleSalaryData: action.result,
            };
        case GETHOMEADS_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case GETINSUR_SUCCESS:
            return {
                ...state,
                SoleSalaryInsurData: action.result,
            };
        case GETINSUR_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case GETBASE_SUCCESS:
            return {
                ...state,
                SoleSalaryBaseData: action.result,
            };
        case GETBASE_FAILURE:
            return {
                ...state,
                error: action.error
            };

        default:
            return state
    }
};
