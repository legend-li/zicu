import {createReducer} from '../utils'
import constants from '../constants'

const {
    RECEIVE_HOTEL_DATA,  //接收酒店数据
    RECEIVE_ACTIVITY_DATA_LIST,  //接收活动数据
} = constants

const initialState = {
    activityDataList: [  //活动列表数据
        {
            count: '605',
            text: '预定订单',
        }, {
            count: '655',
            text: '入住订单',
        }, {
            count: '80',
            text: '优惠补贴额',
        }, {
            count: '755',
            text: '自促订单总金额',
        }, {
            count: '0.11%',
            text: '投入产出比',
        }
    ],
    hotelName: '7天酒店',    //酒店名称
    hotelData: {
        dataList: [    //酒店过去三个月整体数据
            {
                name: '浏览量',
                data: [105,200,234,324,410,389,209],
            }, {
                name: '整体预定订单量',
                data: [100,155,210,320,350,257,120],
            }, {
                name: '整体入住订单量',
                data: [89,150,200,300,320,250,100],
            }, {
                name: '活动预定订单量',
                data: [56,100,150,280,300,200,55],
            }, {
                name: '活动入住订单量',
                data: [50,89,104,254,280,177,49],
            }
        ],
        dateList: ['2016-11-02','2016-11-03','2016-11-04','2016-11-05','2016-11-06','2016-11-07','2016-11-08'], //日期列表
    }
}

export default createReducer(initialState, {
    [RECEIVE_HOTEL_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            hotelData: payload.hotelData,
            hotelName: payload.hotelName,
        })
    },
    [RECEIVE_ACTIVITY_DATA_LIST]: (state, payload) => {
        return Object.assign({}, state, {
            activityDataList: payload.data,
        })
    },
})
