import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../../../actions';
import echarts from 'echarts/lib/echarts';	// 引入 ECharts 主模块
import 'echarts/lib/chart/line';	// 引入柱状图
import 'echarts/lib/component/tooltip';	// 引入提示框组件
// import 'echarts/lib/component/title';	// 引入标题组件
import 'echarts/lib/component/legend';	// 引入图例组件

import './Index.less';

let Data = React.createClass({
	componentWillMount() {
		this.props.actions.getActivityData(this.props.params.id);
	},
	componentDidMount() {
		// const that = this;
		// let series = that.props.hotelData.dataList.map((item) => {
		// 	return {
		// 		name: item.name,
		// 		type: 'line',
		// 		smooth: true,
		// 		data: item.data,
		// 	};
		// });
		// // let dates = that.props.hotelData.dateList.map((item) => {
		// // 	return item;
		// // })
		// let legend = that.props.hotelData.dataList.map((item) => {
		// 	return item.name;
		// });
		// // 基于准备好的dom，初始化echarts实例
		// let myChart = echarts.init(document.getElementById('lineChart'));
		// // 绘制图表
		// myChart.setOption({
		//     // title: { text: '过去三个月酒店整体数据' },
		//     tooltip: {
		//         trigger: 'axis'
		//     },
		//     legend: {
		//         // data:['浏览量','整体预定订单量','整体入住订单量','活动预定订单量','活动入住订单量']
		//         data:['活动入住订单量','活动预定订单量','整体入住订单量','整体预定订单量','浏览量']
		//     },
		//     toolbox: {
		//         show: true,
		//         feature: {
		//             magicType: {show: true, type: ['stack', 'tiled']},
		//             saveAsImage: {show: true}
		//         }
		//     },
		//     xAxis: {
		//         type: 'category',
		//         boundaryGap: false,
		//         data: that.props.hotelData.dateList
		//     },
		//     yAxis: {
		//         type: 'value'
		//     },
		//     series: series
		// });


		const that = this;
		that.props.actions.getHotelData(function () {
			let series = that.props.hotelData.dataList.map((item) => {
				return {
					name: item.name,
					type: 'line',
					smooth: true,
					data: item.data,
				};
			});
			// let dates = that.props.hotelData.dateList.map((item) => {
			// 	return item;
			// })
			let legend = that.props.hotelData.dataList.map((item) => {
				return item.name;
			});
			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(document.getElementById('lineChart'));
			// 绘制图表
			myChart.setOption({
			    // title: { text: '过去三个月酒店整体数据' },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        // data:['活动入住订单量','活动预定订单量','整体入住订单量','整体预定订单量','浏览量']
			        data: that.props.legend,
			    },
			    toolbox: {
			        show: true,
			        feature: {
			            magicType: {show: true, type: ['stack', 'tiled']},
			            saveAsImage: {show: true}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: that.props.hotelData.dateList
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: series
			});
		})
	},
	breakToConfigPage() {
		const jumpUrl = `/businiss/bsm/?pageIndex=${this.props.location.query.pageIndex}&actStatus=${this.props.location.query.actStatus}`;
    	browserHistory.push(jumpUrl);
	},
	render() {
		const dataSection = this.props.activityDataList.map((item) => {
			return <div className="dataSection">
				<div className="count">{item.count}</div>
				<div className="name">{item.text}</div>
			</div>
		});
	    return (
		    <div id="data" className='layout'>
		        <div className="title breakLastPage" onClick={this.breakToConfigPage}>《 数据查看</div>
		        <div className="section">
		        	<div className="sectionTitle">
						双十一优惠活动数据<span className="span">：（财务对账请以扣费记录为准）</span>
		        	</div>
		        	<div className="sectionCon">
		        		<div className="dataCollection">
		        			{dataSection}
		        		</div>
		        		<div className="dataTip">
							优惠补贴额是指该活动实际产生的扣减金额<br />
							自促订单总金额是指该自促活动产生的入住订单的总卖价<br />
							投入产出比=优惠补贴金额/优惠订单总金额
		        		</div>
		        	</div>
		        </div>
		        <div className="section">
		        	<div className="sectionTitle">
						{this.props.hotelName}整体数据<span className="span">：（展示过去三个月数据）</span>
		        	</div>
		        	<div id="lineChart"></div>
		        </div>
		    </div>
	    )
	}
});

// 绑定props和action到view
const mapStateToProps = (state) => ({
	hotelData: state.activityData.hotelData,	//酒店过去三个月整体数据
	hotelName: state.activityData.hotelName,	//酒店名称
	activityDataList: state.activityData.activityDataList,	//活动列表数据
})

const mapDispatchToProps = (dispatch) => ({
    actions : bindActionCreators(actionCreators, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Data)