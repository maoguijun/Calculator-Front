import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    IndexRoute
} from 'react-router-dom';

import CalculatorPage from '../container/CalculatorPage';
// import SettingPage from '../container/SettingPage';



const children = [
  // {path:'/',Com:HomePage},
  // {path:'/login',Com:LoginPage},
  // {path:'/register',Com:RegisterPage},
  // {path:'/Gov',Com:Gov},
  // {path:'/Gaoanzhongxue',Com:Gaoanzhongxue},
  // {path:'/Gaoanerzhong',Com:Gaoanerzhong},
  // {path:'/Shinaozhongxue',Com:Shinaozhongxue},
  // {path:'/Huibuzhongxue',Com:Huibuzhongxue},

];
//exact 表示精确匹配
class Routes extends Component{
  render() { 
    return (
      <div>
        <Route exact path="/" exact component={CalculatorPage} key='CalculatorPage'></Route>
        {/* <Route exact path="/Setting" exact component={SettingPage} key='SettingPage'></Route> */}
      </div>
      
    )
  }
}
export default Routes;