import React from 'react'
import { checkHttpStatus, parseJSON, param, dateFormat } from '../utils';
import { message, notification, Button } from 'antd';
import constants from '../constants'
import { browserHistory } from 'react-router';

message.config({
  top: '50%',
  duration: .5
});

const {
	//活动设置页面
	RECEIVE_ACTIVITY_LIST,	//接收活动列表
	RECEIVE_ACTIVITY_DATA,	//接收需要修改的活动的当前数据
    CLEAR_FORM, //清除表单数据
    RECEIVE_QRCODE, //接收二维码地址
    RECEIVE_HOTEL_DATA,  //接收酒店数据
    RECEIVE_ACTIVITY_DATA_LIST,  //接收活动数据
} = constants

const HOST = 'http://cp01-face-1.epc.baidu.com:8070/business/bsm/'	//黎明开发机地址
// const HOST = '/business/bsm/'
//const HOST = 'http://localhost:8000'



/*******************************************************************************************
  * 自促设置页面
  **/

function receiveActivityList(data, total){
	let parseData = [];
	if(data.length){
		data.forEach(function(item, index){
			let obj = {}, info = {};
			try{
				info = item.business_extra_info ? JSON.parse(item.business_extra_info) : {};
			}catch(err){
				// console.log(err);
			}
			obj.id = item.id;
			obj.activityName = item.activity_name;
			obj.activityTag = item.activityTag;
			obj.dateCheckIn = (info.check_in_start_time && info.check_in_end_time) ? (dateFormat(info.check_in_start_time,0)+' 至 '+dateFormat(info.check_in_end_time,0)) : '';
			if(info.book_limit_type == '1'){
				obj.reserve = '全天';
			}else if(info.book_limit_type == '2'){
				obj.reserve = info.book_start_time+' - '+info.book_end_time;
			}else{
				obj.reserve = '';
			}
			obj.subsidy = info.promo_value ? info.promo_value : '';
			obj.activityStatus = item.is_online ? item.is_online : '';
			obj.remark = item.remark;
			parseData.push(obj);
		})
	}
	return {
		type: RECEIVE_ACTIVITY_LIST,
		payload: {
			list: parseData,
			total: total,
		}
	}
}

export function getActivityList(data) {	//获取活动列表
    return (dispatch, state) => {
        fetch(HOST + 'getActList', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: param(data)
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
        	if(!response.errorNo){
            	dispatch(receiveActivityList(response.data.list, response.data.count));
            }
        })
        .catch(error => {
            // message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

export function switchActivity(data, fn) {	//上线（下线）活动
    return (dispatch, state) => {
        fetch(HOST + 'setSwitch?' + param(data), {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
            	// console.log(response.data);
            	fn();
            }
        })
        .catch(error => {
        	// message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

function clearFormAction() {
    return {
        type: CLEAR_FORM,
        payload: {
            data: {
                id: '', //活动ID
                actName: '',    //活动名称
                dateCheckInStart: '', //入住开始日期
                dateCheckInEnd: '', //入住结束日期
                limitType: '1',    //预定时间限制
                limitStartTime: '', //预定限时开始时间
                limitEndTime: '', //预定限时结束时间
                promoValue: '',   //每间夜补贴额
            }
        }
    }
}

export function clearForm() {   //清除活动信息表单数据
    return (dispatch, state) => {
        dispatch(clearFormAction())
    }
}

function updateActivityInfo(data) { //将请求到的活动信息回填到form表单中，进行编辑
    let info = {};
    try{
        info = JSON.parse(data.business_extra_info);
    } catch(err) {
        // console.log(err);
    }
    let parseData = {
        id: data.id,   //活动ID
        actName: info.name ? info.name : '',    //活动名称
        dateCheckInStart: info.check_in_start_time ? dateFormat(info.check_in_start_time, 0) : '', //入住开始日期
        dateCheckInEnd: info.check_in_end_time ? dateFormat(info.check_in_end_time, 0) : '', //入住结束日期
        limitType: info.book_limit_type ? info.book_limit_type : '',    //预定时间限制
        limitStartTime: info.book_start_time ? info.book_start_time : '', //预定限时开始时间
        limitEndTime: info.book_end_time ? info.book_end_time : '', //预定限时结束时间
        promoValue: info.promo_value ? info.promo_value : '',   //每间夜补贴额
    }
    console.log(parseData)
    return {
        type: CLEAR_FORM,
        payload: {
            data: parseData
        }
    }
}

export function getActivityInfo(data) {
    return (dispatch, state) => {
        fetch(HOST + 'GetActDetail?' + param(data), {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
                dispatch(updateActivityInfo(response.data));
            }
        })
        .catch(error => {
            // message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

export function editActivity(data, fn) {	//修改活动
    return (dispatch, state) => {
        fetch(HOST + 'editActivity?' + param(data), {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
            	// console.log(response.data);
                fn();
            }
        })
        .catch(error => {
        	// message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

export function createActivity(data, fn) {	//新建活动
    return (dispatch, state) => {
        fetch(HOST + 'createActivity?' + param(data), {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
            	// console.log(response.data);
                fn();
            }
        })
        .catch(error => {
        	// message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

function receiveQrCode(qrcode) {
    return {
        type: RECEIVE_QRCODE,
        payload: {
            qrcode: qrcode
        }
    }
}

export function getQrCode(fn) {  //获取二维码地址
    return (dispatch, state) => {
        fetch(HOST + 'GetActRcode', {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
                // console.log(response.data);
                dispatch(receiveQrCode(response.data));
                setTimeout(function () {
                    fn();
                }, 50)
            }
        })
        .catch(error => {
            // message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

/******************************************************************************************/




/*******************************************************************************************
  * 自促数据页面
  **/

function receiveActivityData(data) {
    return {
        type: RECEIVE_ACTIVITY_DATA_LIST,
        payload: {
            data: data,
        }
    };
}

export function getActivityData(actId) { //获取活动起见各项数据
    return (dispatch, state) => {
        fetch(HOST + 'GetActData', {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
                // console.log(response.data);
                dispatch(receiveActivityData(response.data));
            }
        })
        .catch(error => {
            // message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

function receiveHotelData(data) {
    let parseData, htlName;
    htlName = data.hname;
    parseData = {
        dataList: data.tyname,
        dateList: data.tdate,
    };
    return {
        type: RECEIVE_HOTEL_DATA,
        payload: {
            hotelData: parseData,
            hotelName: htlName,
        }
    };
}

export function getHotelData(fn) {    //获取当前酒店过去三个月整体数据
    return (dispatch, state) => {
        fetch(HOST + 'GetShowData', {
            credentials: 'include'
        })
        .then(parseJSON)
        .then(checkHttpStatus)
        .then(response => {
            if(!response.errorNo){
                // console.log(response.data);
                dispatch(receiveHotelData(response.data));
                setTimeout(function () {
                    fn();
                }, 50)
            }
        })
        .catch(error => {
            // message.error(`获取数据异常,错误信息：${error}`);
        })
    }
}

/******************************************************************************************/