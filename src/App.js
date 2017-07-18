import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'
import Routes from './components/Routes'


class App extends Component {
    render() {
        return (
            <Router>
                    <Routes/>
            </Router>
        );
    }


}

const mapStateToProps = (state) => {
    const {router} = state;
    // console.log('state',state)
    return {
        router,
    }
}

//这个操作的功能是使得App能在后面获取到Reducer返回的数据
export default connect(mapStateToProps)(App)
