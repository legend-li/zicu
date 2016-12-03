import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../../../actions';
import { QRCode } from '../../../common/qrcode';
import { Select, Button, Table, Form, DatePicker, Input, Row, Col, Radio } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const createForm = Form.create;
const RadioGroup = Radio.Group;

import './Index.less';

let Config = React.createClass({
	getInitialState() {
	    return {
	    	actStatus: '0',	//查询活动的状态条件(0:全部状态,1:已下线,2:进行中,3:已结束,4:暂停)
	    	pageIndex: 1,	//当前页数
	    	limitStartTimeArr: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00',
	    		'13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],	//可选预定限时开始时间段
	    	limitEndTimeArr: ['1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00',
	    		'14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','23:59'],	//可选预定限时开始时间段
	    	formShow: 'none',	//活动form表单区域显示状态('none':隐藏,'block':显示)
	    	formEditStatus: 0,	//活动form表单编辑状态(0:新建活动,1:编辑活动)
	    	limitType: 1,	//预定时间类型
	    };
    },
    componentWillMount() {
    	let that = this, status, pageIndex;
    	if(that.props.location.query.pageIndex && that.props.location.query.actStatus){
    		status = that.props.location.query.actStatus;
    		pageIndex = that.props.location.query.pageIndex;
    		that.setState({
    			actStatus: status,
    			pageIndex: pageIndex,
    		})
    	}else{
    		status = that.state.actStatus;
    		pageIndex = that.state.pageIndex;
    	}
    	that.props.actions.getActivityList({
    		status: status,	//活动状态
	    	pageindex: pageIndex,	//查询的页数
	    	pagenum: 10,	//每页的行数
    	});
	},
	componentDidMount() {
		const that = this;
		const qrcode = new QRCode(document.querySelector(".qrcode"), {
            width : 100,//设置宽高
            height : 100
        });
		that.props.actions.getQrCode(function () {
			// console.log('qrcodeRrl now is:', that.props.qrcodeRrl);
	        qrcode.makeCode(that.props.qrcodeRrl);
		})
	},
	handleChange: function(status){
		const that = this;
		that.setState({
			actStatus: status
		})
		that.props.actions.getActivityList({
    		status: status,	//活动状态
	    	pageindex: 1,	//查询的页数
	    	pagenum: 10,	//每页的行数
    	});
	},
	activitySwitch(actId, type) {	//上线(下线)活动,type=1:上线,type=2:下线
		const that = this;
		that.props.actions.switchActivity({
			promo_id: actId,
			switch: type,
		}, function () {
			that.props.actions.getActivityList({
				status: that.state.actStatus,	//活动状态
		    	pageindex: that.state.pageIndex,	//查询的页数
		    	pagenum: 10,	//每页的行数
			});
		});
	},
	newActivity() {
		this.props.actions.clearForm();
		this.setState({
			formEditStatus: 0,
			formShow: 'block'
		})
		let box = document.querySelector("body");
		setTimeout(function () {
			// console.log(box.scrollHeight)
			box.scrollTop = 980;
		}, 50)
	},
	editActivity(actId) {
		this.props.actions.clearForm();
		this.props.actions.getActivityInfo({
			promo_id: actId,
		})
		this.setState({
			formEditStatus: 1,
			formShow: 'block'
		})
		let box = document.querySelector("body");
		setTimeout(function () {
			// console.log(box.scrollHeight)
			box.scrollTop = 980;
		}, 50)
	},
	submitActivityInfo() {	//提交活动信息
		console.log('submit')
		const that = this;
		that.props.form.validateFieldsAndScroll((errors, values) => {
			if (!!errors) {
		    	return;
		    } else {
		    	console.log(values)
		    	let data = {
		    		name: values.actName,
		    		book_limit_type: values.limitType,
		    		book_start_time: values.limitStartTime,
		    		book_end_time: values.limitEndTime,
		    		check_in_start_time: Date.parse(values.dateCheckInStart),
		    		check_in_end_time: Date.parse(values.dateCheckInEnd),
		    		promo_value: values.promoValue,
		    	};
		    	if(that.state.formEditStatus) {
		    		data.promo_id = that.props.activityInfo.id;
		    		that.props.actions.editActivity(data, function () {
			    		that.props.actions.getActivityList({
				    		status: that.state.actStatus,	//活动状态
					    	pageindex: that.state.pageIndex,	//查询的页数
					    	pagenum: 10,	//每页的行数
				    	});
			    		that.setState({
			    			formShow: 'none',
			    		});
			    		let box = document.querySelector("body");
						setTimeout(function () {
							box.scrollTop = 0;
						}, 50)
			    	});
		    	} else {
		    		that.props.actions.createActivity(data, function () {
			    		that.props.actions.getActivityList({
				    		status: 0,	//活动状态
					    	pageindex: 1,	//查询的页数
					    	pagenum: 10,	//每页的行数
				    	});
			    		that.setState({
			    			formShow: 'none',
			    			actStatus: '0',
			    		});
			    		let box = document.querySelector("body");
						setTimeout(function () {
							box.scrollTop = 0;
						}, 50)
			    	});
		    	}
		    }
		})
	},
	breakToDataPage(actId) {	//跳转到自促数据页面
		const jumpUrl = `/businiss/bsm/activity/activityData/${actId}?pageIndex=${this.state.pageIndex}&actStatus=${this.state.actStatus}`;
    	browserHistory.push(jumpUrl);
	},
	dateCheckInStartCheck(rule, value, callback) {
	    if (!value) {
	    	callback();
	    }else{
	    	let startDate = Date.parse(value)+24*60*60*1000;
	    	let nowDate = Date.parse(new Date());
	    	if(startDate<nowDate){
	    		callback('入住开始日期必须大于等于当前日期！');
	    	}else{
	    		callback();
	    	}
	    }
	},
	dateCheckInEndCheck(rule, value, callback) {
		const { getFieldValue } = this.props.form;
	    if (!value) {
	    	callback();
	    }else{
	    	let endDate = Date.parse(value);
	    	let startDate = Date.parse(getFieldValue('dateCheckInStart'));
	    	if(endDate<startDate){
	    		callback('入住截止日期必须大于等于入住开始日期！');
	    	}else{
	    		callback();
	    	}
	    }
	},
	compareTime(time1, time2) {
		function parseArr(str) {
			return str.split(':');
		}
		let arr1_0 = parseInt(parseArr(time1)[0]),
		arr1_1 = parseInt(parseArr(time1)[1]),
		arr2_0 = parseInt(parseArr(time2)[0]),
		arr2_1 = parseInt(parseArr(time2)[1]);

		if(arr1_0 < arr2_0){
			return true;
		}else if((arr1_0 == arr2_0) && (arr1_1 < arr2_1)){
			return true;
		}else{
			return false;
		}
	},
	limitStartTimeCheck(rule, value, callback) {
		const { getFieldValue } = this.props.form;
	    if (!value) {
	    	callback();
	    }else{
	    	if(value && getFieldValue('limitEndTime')){
	    		if(!this.compareTime(value, getFieldValue('limitEndTime'))){
	    			callback('预定开始时间小于预定结束时间');
	    		}else{
	    			callback();
	    		}
	    	}else{
	    		callback();
	    	}
	    }
	},
	limitEndTimeCheck(rule, value, callback) {
		const { getFieldValue } = this.props.form;
	    if (!value) {
	    	callback();
	    }else{
	    	if(value && getFieldValue('limitStartTime')){
	    		if(!this.compareTime(getFieldValue('limitStartTime'), value)){
	    			callback('预定开始时间小于预定结束时间');
	    		}else{
	    			callback();
	    		}
	    	}else{
	    		callback();
	    	}
	    }
	},
	promoValueCheck(rule, value, callback) {
		if (!value) {
	    	callback();
	    }else if(parseFloat(value) < 3){
	    	callback('每间夜补贴金额不能低于3元');
	    }else if(parseFloat(value) > 50){
	    	callback('每间夜补贴金额不能大于50元');
	    }else{
	    	callback();
	    }
	},
    render() {
    	const that = this, { getFieldProps, getFieldValue } = this.props.form;
    	const columns = [{
		  title: '活动名称',
		  dataIndex: 'activityName',
		  key: 'activityName',
		}, {
		  title: '活动标签',
		  dataIndex: 'activityTag',
		  key: 'activityTag',
		}, {
		  title: '入住日期',
		  dataIndex: 'dateCheckIn',
		  key: 'dateCheckIn',
		}, {
		  title: '预定时间',
		  dataIndex: 'reserve',
		  key: 'reserve',
		}, {
		  title: '补贴额配置',
		  dataIndex: 'subsidy',
		  key: 'subsidy',
		  render: (text) => (
		  	<span>{text ? text+'元/每间夜' : ''}</span>
		  )
		}, {
		  title: '活动状态',
		  dataIndex: 'activityStatus',
		  key: 'activityStatus',
		  render: (text) => {
		  	let status;
			switch(text){
				case '1': 
					status = '进行中';
					break;
				case '2': 
					status = '已下线';
					break;
				case '3': 
					status = '已结束';
					break;
				case '4': 
					status = '暂停';
					break;
				default: 
					status = '';
					break;
			}
			return <span>{status}</span>
		  }
		}, {
		  title: '备注',
		  dataIndex: 'remark',
		  key: 'remark',
		}, {
		  title: '操作',
		  key: 'operation',
		  render: (text, record) => (
		    <span>
		    	{record.activityStatus == '2' ? <a onClick={this.editActivity.bind(null, record.id)}> 修改 </a> : ''}
		    	{
		    		(record.activityStatus == '1')||(record.activityStatus == '4') ? 
		    		<a onClick={this.activitySwitch.bind(null, record.id, 2)}> 下线 </a> : 
		    		(record.activityStatus == '2') ? <a onClick={this.activitySwitch.bind(null, record.id, 1)}>上线</a> : ''
		    	}
		    	<a onClick={this.breakToDataPage.bind(null, record.id)}> 数据查看 </a>
		    </span>
		  ),
		}];
		const pagination = {
			total: that.props.activityTotal,
			pageSize: 10,
			onChange(current) {
			    // console.log('Current: ', current);
			    that.setState({
			    	pageIndex: current,
			    });
			    that.props.actions.getActivityList({
			    	status: that.state.actStatus,	//活动状态
			    	pageindex: current,	//查询的页数
			    	pagenum: 10,	//每页的行数
			    });
			},
		};
		const limitStartTimeOption = that.state.limitStartTimeArr.map((item) => (
			<Option value={item}>{item}</Option>
		))
		const limitEndTimeOption = that.state.limitEndTimeArr.map((item) => (
			<Option value={item}>{item}</Option>
		))
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 19 },
	    };
	    const actName = getFieldProps('actName', {
	    	initialValue: that.props.activityInfo.actName,
	    	rules: [
	    		{ required: true, whitespace: true, max: 20, message: '请填写20字以内活动名称' }
	    	]
	    });
	    const dateCheckInStart = getFieldProps('dateCheckInStart', {
	    	initialValue: that.props.activityInfo.dateCheckInStart,
	    	rules: [
	    		{ required: true },
	    		{ validator: that.dateCheckInStartCheck },
	    	]
	    });
	    const dateCheckInEnd = getFieldProps('dateCheckInEnd', {
	    	initialValue: that.props.activityInfo.dateCheckInEnd,
	    	rules: [
	    		{ required: true },
	    		{ validator: that.dateCheckInEndCheck },
	    	]
	    });
	    const limitType = getFieldProps('limitType', {
	    	initialValue: that.props.activityInfo.limitType,
	    	onChange: function(){
	    		setTimeout(function () {
	    			// console.log(getFieldValue('limitType'))
	    			that.setState({
	    				limitType: getFieldValue('limitType'),
	    			})
	    		}, 10)
        	},
	    	rules: [
	    		{ required: true }
	    	]
	    });
	    const limitStartTime = getFieldProps('limitStartTime', {
	    	initialValue: that.props.activityInfo.limitStartTime,
	    	rules: [
	    		{ validator: that.limitStartTimeCheck },
	    	]
	    });
	    const limitEndTime = getFieldProps('limitEndTime', {
	    	initialValue: that.props.activityInfo.limitEndTime,
	    	rules: [
	    		{ validator: that.limitEndTimeCheck },
	    	]
	    });
	    const promoValue = getFieldProps('promoValue', {
	    	initialValue: that.props.activityInfo.promoValue,
	    	rules: [
	    		{ required: true },
	    		{ validator: that.promoValueCheck }
	    	]
	    });
	    return (
	      <div id="config" className='layout'>
	      	
	      	<div className="title">自促设置</div>
	      	<div className="areaBox">
	      		温馨提示：<span>想要设置自促活动，请先去自促资金池中充值吧！</span>
	      	</div>
	      	<div className="title">自促列表</div>
	      	<div className="form1">
	      		<Select className="select" value={this.state.actStatus} onChange={this.handleChange}>
			      <Option value="0">全部状态</Option>
			      <Option value="1">进行中</Option>
			      <Option value="2">已下线</Option>
			      <Option value="3">已结束</Option>
			      <Option value="4">暂停</Option>
			    </Select>
			    <Button className="buttonColor newActivity" type="ghost" onClick={this.newActivity}>新建促销</Button>
	      	</div>
	      	<Table bordered={true} pagination={pagination} columns={columns} dataSource={this.props.activityList} />
	      	<div className="title" style={{ display: this.state.formShow}}>新建促销/修改促销</div>
	      	<Form horizontal className="ant-advanced-search-form" style={{ display: this.state.formShow}}>
				<FormItem 
					className="actNameBox"
					{...formItemLayout}
					label="活动名称"
					required
				>
					<Input className="actName" {...actName} />
				</FormItem>
				<FormItem 
					{...formItemLayout}
					label="活动时间"
					required
				>
					<div>
						<div className="checkIn">
							<div style={{ width: 60,float: 'left' }}>入住日期&nbsp;&nbsp;</div>
							<FormItem style={{ width: 170,float: 'left' }}>
								<DatePicker {...dateCheckInStart} />
							</FormItem>
							<div style={{ width: 30,float: 'left' }}>&nbsp;&nbsp;至</div>
							<FormItem style={{ width: 170,float: 'left' }}>
								<DatePicker {...dateCheckInEnd} />
							</FormItem>
							<div style={{ clear: 'both' }}></div>
						</div>
						<div className="limitTime">
		  					<div className="radioBox">
			  					<div style={{ width: 60,float: 'left' }}>预定时间&nbsp;&nbsp;</div>
		  						<FormItem style={{ width: 130, float: 'left' }}>
		  							<RadioGroup {...limitType}>
							            <Radio value="1">全天</Radio>
							            <Radio value="2">限时</Radio>
						        	</RadioGroup>
		  						</FormItem>
		  					</div>
				        	<div className="limitTimeSelectBox" style={{ display: ((this.state.limitType == 1) ? 'none' : 'block') }}>
				        		<FormItem style={{ width: 120, float: 'left' }}>
					        		<Select className="select" {...limitStartTime}>
					        			{limitStartTimeOption}
								    </Select>
							    </FormItem>
							    <div style={{ width: 30,float: 'left' }}>&nbsp;&nbsp;至</div>
							    <FormItem style={{ width: 120, float: 'left' }}>
								    <Select className="select" {...limitEndTime}>
								    	{limitEndTimeOption}
								    </Select>
							    </FormItem>
				        	</div>
						</div>
					</div>
				</FormItem>
				<FormItem 
					{...formItemLayout}
					label="补贴额配置"
					required
				>
					<div>
						<div className="promoBox">
							<div style={{ width: 70,float: 'left' }}>每间夜补贴&nbsp;&nbsp;</div>
							<FormItem style={{ width: 200, float: 'left' }}>
								<Input className="actName" {...promoValue} />
							</FormItem>
							&nbsp;&nbsp;元<br/><br/>
							<p>
								补贴额不能大于资金池余额<br/>
								活动提交后，补贴将应用于贵酒店所有在百度外网展示的的所有预付产品
							</p>
						</div>
						<div className="qrcodeBox">
							<div className="qrcode"></div>
							<div className="qrcodeText">扫码查看酒店当前外网报价</div>
						</div>
					</div>
				</FormItem>
				<FormItem 
					{...formItemLayout}
					label="结算规则"
					required
				>
					<p>
						<span className="settlementRule">商户预充值自促资金，用户离店后每个有效间夜从资金池中扣除相应配置的补贴</span><br/>
						<span className="settlementRuleTip">
							举例：您在后台配置每间夜补贴5元，用户从百度预订5.1-5.2大床房预付产品两间，则该订单用户支付时立减
							5元*2间=10元，用户离店后，将从您的资金池中扣除这10元费用
						</span>
					</p>
				</FormItem>
				<Button className="buttonColor submitBtn" onClick={this.submitActivityInfo}>提交</Button>
	      	</Form>
	      </div>
	    )
    }
})

Config = createForm()(Config);

// 绑定props和action到view
const mapStateToProps = (state) => ({
	activityList: state.activityConfig.activityList,	//活动列表
	activityTotal: state.activityConfig.activityTotal,	//活动列表总条数
	activityInfo: state.activityConfig.activityInfo,	//表单——活动信息
	qrcodeRrl: state.activityConfig.qrcodeRrl,	//二维码地址
})

const mapDispatchToProps = (dispatch) => ({
    actions : bindActionCreators(actionCreators, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Config)