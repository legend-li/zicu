import React from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import configureStore from './store/configureStore';
// import { getUserInfo, fetchCityData, getOrderBubbleData } from './actions'
import 'antd/dist/antd.less'
//import './theme.less'
// import './index.less'
	
const store = configureStore()


export default React.createClass({
  render() {
    return (
	  <Provider store={store}>
	      <Router routes={routes} history={browserHistory}/>
	  </Provider>
    );
  }
})