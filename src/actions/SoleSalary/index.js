import {easyfetch} from '../../util/NetUtil';
export const GETHOMEADS_SUCCESS = 'GETHOMEADS_SUCCESS';
export const GETHOMEADS_FAILURE = 'GETHOMEADS_FAILURE';

export const GETINSUR_SUCCESS = 'GETINSUR_SUCCESS';
export const GETINSUR_FAILURE = 'GETINSUR_FAILURE';

export const GETBASE_SUCCESS = 'GETBASE_SUCCESS';
export const GETBASE_FAILURE = 'GETBASE_FAILURE';




export const getData = ()=>{
    return (dispatch) => {
        // console.log('dispatch',dispatch);
        return easyfetch('taxRates','get')
            .then(result=>{
                return dispatch(getHomeAdsSuccess(result));
            })
            .catch(error=>{
                console.log(error);
                return dispatch(getHomeAdsFailure(error));
            });
    }
};


const getHomeAdsSuccess=(result)=>({type:GETHOMEADS_SUCCESS,result,loading:false});
const getHomeAdsFailure=(error)=>({type:GETHOMEADS_FAILURE,error,loading:false});

export const getInsurData = ()=>{
    return (dispatch) => {
        return easyfetch('insuranceRates','get')
            .then(result=>{
                return dispatch(getInsurSuccess(result));
            })
            .catch(error=>{
                console.log(error);
                return dispatch(getInsurFailure(error));
            });
    }
};

const getInsurSuccess=(result)=>({type:GETINSUR_SUCCESS,result,loading:false});
const getInsurFailure=(error)=>({type:GETINSUR_FAILURE,error,loading:false});

export const getBaseData = () => {
    return (dispatch) => {
        return easyfetch('baseBounds','get')
            .then(result=>{
                return dispatch(getBaseSuccess(result));
            })
            .catch(error=>{
                console.log(error);
                return dispatch(getBaseFailure(error));
            });
    }
};

const getBaseSuccess=(result)=>({type:GETBASE_SUCCESS,result,loading:false});
const getBaseFailure=(error)=>({type:GETBASE_FAILURE,error,loading:false});