import {createConstants} from '../utils';

export default createConstants(
 // 活动设置页面
 'RECEIVE_ACTIVITY_LIST', //接收活动列表
 'RECEIVE_ACTIVITY_DATA', //接收需要修改的活动的当前数据
 'CLEAR_FORM',	//清除表单数据
 'RECEIVE_QRCODE', //接收二维码地址
 'RECEIVE_HOTEL_DATA',  //接收酒店数据
 'RECEIVE_ACTIVITY_DATA_LIST',  //接收活动数据
);
