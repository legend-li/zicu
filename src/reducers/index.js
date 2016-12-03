import {combineReducers} from 'redux'
import {routerStateReducer} from 'redux-router'
import activityConfig from './activityConfig'
import activityData from './activityData'

export default combineReducers({
	activityConfig,
	activityData,
	router: routerStateReducer
});
