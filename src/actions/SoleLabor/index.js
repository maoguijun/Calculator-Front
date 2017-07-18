import {easyfetch} from '../../util/NetUtil';
export const GETHOMEADS_SUCCESS = 'GETHOMEADS_SUCCESS';
export const GETHOMEADS_FAILURE = 'GETHOMEADS_FAILURE';




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
