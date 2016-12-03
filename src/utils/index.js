import { message } from 'antd';

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkHttpStatus(response) {
    if (response.errorNo) {
        message.warning(response.errorMsg, 2);
    }
    return response
}

export function param(obj) {
    let param = ''
    for (let key in obj) {
        let value = obj[key]
        if(value !== undefined){
            param +=`${key}=${value}&`
        }
    }
    return param.substring(0, param.length-1)

}

export function parseJSON(response) {
    return response.json()
}

export function dateFormat(dateSjc, type){
    //type=0:生成“2016-08-09”这种日期格式,
    //type=1:生成“2016年8月9日”这种日期格式,
    //stype=2:生成“20160809”这种日期格式,
    //type=3:生成“08-01 周一”这种日期格式
    let dateFormat,Y,M,D,dateObj;
    dateObj = new Date(parseInt(dateSjc));
    Y = dateObj.getFullYear();
    M = dateObj.getMonth()+1;
    D = dateObj.getDate();
    if (type == 0) {
        dateFormat = Y + '-' + (M<10 ? '0'+M : M) + '-' + (D<10 ? '0'+D : D);
    }else if (type == 1) {
        dateFormat = Y + '年' + M + '月' + D + '日';
    } else if (type  == 2) {
        dateFormat = Y*10000 + M*100 + D;
    } else if (type == 3) {
        let index = dateObj.getDay(),
        weeks = ['周日','周一','周二','周三','周四','周五','周六'];
        if(this.state.nowDaySJC == dateObj.getTime()){
            dateFormat = '今天' + ' ' + weeks[index];
        } else {
            dateFormat = (M > 9 ? M : ('0' + M)) + '-' + (D > 9 ? D : ('0' + D)) + ' ' + weeks[index];
        }
    }
    return dateFormat;
}