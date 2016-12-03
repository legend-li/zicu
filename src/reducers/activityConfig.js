import {createReducer} from '../utils'
import constants from '../constants'

const {
    RECEIVE_ACTIVITY_LIST,  //接收活动列表
    RECEIVE_ACTIVITY_DATA,  //接收需要修改的活动的当前数据
    CLEAR_FORM, //清除表单数据
    RECEIVE_QRCODE, //接收二维码地址
} = constants

const initialState = {
    activityList: [
        // {    //活动列表数据
        // 	id: '1',   //活动id
        // 	activityName: '双十一优惠', //活动名称
        // 	activityTag: '今日特惠',   //活动标签
        // 	dateCheckIn: '2016-11-12至2016-11-13日', //入住日期
        //     reserve: '全天',  //预定时间
        //     subsidy: '5',  //补贴额配置
        //     activityStatus: '1',  //活动状态(1:已下线,2:进行中,3:已结束,4:暂停)
        //     remark: '商家下线', //备注
        // }
    ],
    activityTotal: 0,    //活动列表总条数
    activityInfo: {
        id: '', //活动ID
        actName: '',    //活动名称
        dateCheckInStart: '', //入住开始日期
        dateCheckInEnd: '', //入住结束日期
        limitType: '1',    //预定时间限制
        limitStartTime: '', //预定限时开始时间
        limitEndTime: '', //预定限时结束时间
        promoValue: '',   //每间夜补贴额
    },
    qrcodeRrl: 'bainuo://component?compid=maphotel&comppage=hoteldetail&uid=022d48d40525da22aecb669a&room_type=0&src_from=bainuo_hotel',    //二维码地址
    // qrcodeRrl: 'https://git.oschina.net/',  //二维码地址2
}

export default createReducer(initialState, {
    [RECEIVE_ACTIVITY_LIST]: (state, payload) => {
        return Object.assign({}, state, {
            activityList: payload.list,
            activityTotal: payload.total,
        })
    },
    [CLEAR_FORM]: (state, payload) => {
        return Object.assign({}, state, {
            activityInfo: payload.data,
        })
    },
    [RECEIVE_QRCODE]: (state, payload) => {
        return Object.assign({}, state, {
            qrcodeRrl: payload.qrcode,
        })
    },
})
