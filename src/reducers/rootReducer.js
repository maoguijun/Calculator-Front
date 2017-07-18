import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import SoleLabor from './SoleLabor'
import SoleCompany from './SoleCompany'
import SoleSalary from './SoleSalary'

//将子Reducers合并成大的Reducers
const rootReducer = combineReducers({
    // home,
    SoleLabor,
    SoleCompany,
    SoleSalary,
    router: routerReducer
});


export default rootReducer;