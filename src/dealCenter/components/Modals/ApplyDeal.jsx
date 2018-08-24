/**
 * Created by Jason on 2017/1/6.
 */

import React, { PropTypes } from 'react'
import {connect} from 'dva';
import { Modal, Button, Steps, Table, Popconfirm, message, Icon, Form, Input } from 'antd';
import Uploader from '../../../commons/components/Uploader';
import SelectAuditorModal from './SelectAuditorModal';
const Step = Steps.Step;
const FormItem=Form.Item;

function ApplyDeal({dispatch,secondDeal,form}){
	const {
		ApplyDealVisible,
		ApplyDeal_status,
		//Uploader用;
		fileList,
		previewVisible,
		previewImage,
	}=secondDeal;
	const {getFieldDecorator}= form;
	//步骤条状态
	let stepState=null;
	let ApplyDealButton='';//根据状态判断下方按钮
	switch(ApplyDeal_status){
		case '申请成交':
		 stepState={
				current:0,
				// status:'progress',
				description0:'',
				description1:'',
				description2:'',
				description3:'',
		 };
			ApplyDealButton='提交申请';
			break;
		case '成交等待审核':
			 stepState={
				current:0,
				status:'progress',
				description1:''
			};
			ApplyDealButton='撤回申请';
			break;
		case '成交审核已驳回':
			 stepState={
				current:1,
				status:'error',
				description1:'已驳回'
			};
			ApplyDealButton='重新申请';
			break;
		case '等待财务审核':
			 stepState={
				current:2,
				status:'progress',
				description2:''
			};
			ApplyDealButton='default';
			break;
		case '财务审核已驳回':
			 stepState={
				current:2,
				status:'error',
				description2:'已驳回'
			};
			ApplyDealButton='重新申请';
			break;
		case '等待佣金分配':
			 stepState={
				current:2,
				status:'progress',
				description3:''
			};
			ApplyDealButton='default';
			break;
		case '佣金已分配':
			 stepState={
				current:3,
				status:'finally',
				description3:''
			};
			ApplyDealButton='default';
			break;
		default:
			stepState={
				current:1,
				status:'finally',
				description1:''
			};
			ApplyDealButton='default';
			break;
	}
	//模拟成交说明
	const reasonsData={
		text:'我是退款文字理由',
		img:[{
			key:1,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		},{
			key:2,
			url:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
		},{
			key:3,
			url:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
		}]
	};
	//模拟审核信息
	const shenHeInfo=[
		{
			key:1,
			text:'2015-10-24 19:00 由黄林枫 申请退款  等待 李白 退款审核。'
		},{
			key:2,
			text:'2015-10-24 19:00 由 李白 审核通过  等待财务 王颖 进行审核'
		},{
			key:3,
			text:'2015-10-24 19:00 由 财务 王颖 审核通过 等待执行退款'
		},{
			key:4,
			text:'2015-10-24 19:00 由 财务 王颖 已执行退款  1~2个工作日后 退款将退回原卡账户。'
		}
	];

	//模拟成交房源
	const data=[{
		houseInfo:'鼎炫科技/A区域/1号楼/单元/7层/7002室',
		propertyType:'住宅',
		houseArea:'100㎡',
		houseUnitPrice:'1000元/㎡',
		houseTotalPrice:'200万/套',
		dealTotalPrice:'250万',
		dealBrokerage:'5万',
		houseBroker:'大湿兄',
		clientBroker:'仓老师',
		dealTime:'2015-10-24 19:00',
	}];
	const columns=[{
		title:'房源信息',
		dataIndex:'houseInfo'
	}, {
		title:'物业类型',
		dataIndex:'propertyType'
	}, {
		title:'房源面积',
		dataIndex:'houseArea'
	}, {
		title:'房源单价',
		dataIndex:'houseUnitPrice'
	}, {
		title:'房源总价',
		dataIndex:'houseTotalPrice'
	}, {
		title:'成交佣金',
		dataIndex:'dealBrokerage'
	}, {
		title:'房源经纪人',
		dataIndex:'houseBroker'
	}, {
		title:'客户经纪人',
		dataIndex:'clientBroker'
	}, {
		title:'成交时间',
		dataIndex:'dealTime'
	},{
		title:'操作',
		render:(record)=>{
			return(
				<a>交易详情</a>
			)
		}
	}];
	const showInputModal=()=>{
		dispatch({
			type:'secondDeal/setState',
			payload:{
				ApplyDeal_status:'申请成交'
			}
		})
	};
	let confirm=()=> {
		//发起撤回请求
		setTimeout(() => {
			message.success('Click on Yes');
			dispatch({
				type:'secondDeal/setState',
				payload:{
					ApplyDealVisible:false,
					ApplyDealButton:'default',
				}
			})
		}, 2000);

	};

	let cancel=()=> {
		message.error('Click on No');
	};

	//图片上传组件用
	const uploaderProps={
		tip:'最多可上传5张/单张不超过2M',
		fieldName:'Img_bu/sinesslicense',

		fileList,
		previewVisible,
		previewImage,

		handleCancel: () => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					previewVisible: false,
				}
			});
		},
		handlePreview: (file) => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					previewImage: file.url || file.thumbUrl,
					previewVisible: true,
				}
			});
		},
		handleChange :({ fileList }) => {
			dispatch({
				type:'secondDeal/setState',
				payload:{
					fileList,
				}
			});
		},
	};
	const handleCancel=()=>{
		//关闭当前modal
		dispatch({
			type:'secondDeal/setState',
			payload:{
				ApplyDealVisible:false,
				ApplyDealButton:'default',
				fileList:[],
			}
		});
	};
	const SelectAuditorModalProps={

	};

	let content=()=>{
		switch(ApplyDeal_status){
			case '申请成交':
				return(
					<div className="apply-deal">
						<h4>成交理由:</h4>
						<Form horizontal>
							<FormItem
							>
								{getFieldDecorator('dealExplain', {
									rules: [{ required: true, message: '请输入成交理由!' }],
								})(
									<Input placeholder='在此输入成交理由'/>
								)}
							</FormItem>
						</Form>
						<Uploader {...uploaderProps}/>
						<SelectAuditorModal {...SelectAuditorModalProps}/>
					</div>
				);
			default:
				return(
					<div>
						<div>
							<h4>成交说明</h4>
							<p>Lorem ipsuad a possimus squidem recusandae saepe temporibus.</p>
							<ul className="tuiKuanImgs">
								{reasonsData.img.map((item)=>{
									return (
										<li key={item.key}>
											<img className={'判断宽高条件'?"toogleImgWidth":'toogleImgHeight'} src={item.url} alt="图片加载失败"/>
										</li>
									)
								})}
							</ul>
						</div>
						<div>
							<h4>成交审核信息</h4>
							<ul>
								{
									shenHeInfo.map((item)=>{
										return (
											<li key={item.key}><span>{item.text}</span></li>
										)
									})
								}
							</ul>
						</div>
					</div>
				);
		}
	};
	const showAuditor=()=>{
		form.validateFields((err, values) => {
			console.log(err,values);
			if (err) {
				return;
			}
			dispatch({
				type:'secondDeal/setState',
				payload:{
					auditorModalVisible:true,
				}
			})
		});
	};
	return(
		<Modal
			className="ApplyDeal"
			visible={ApplyDealVisible}
			maskClosable={false}
			title="二手房--成交申请"
			onCancel={handleCancel}
			footer={
				ApplyDealButton==='重新申请'?
					[
						<Button key="reApply" type="primary" size="large" onClick={showInputModal}>重新申请</Button>,
						<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
					]:
					ApplyDealButton==='撤回申请'?
						[
							<Popconfirm  key="cancelApply" title="确认撤回申请?" onConfirm={confirm} onCancel={cancel} okText="是" cancelText="否">
								<Button type="primary" size="large">撤回申请</Button>
							</Popconfirm>,
							<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,
						]:
						ApplyDealButton==='提交申请'?
							[
								<Button key="reApply" type="primary" size="large" onClick={showAuditor}>提交申请</Button>,
								<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
							]:
							[
								<Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>
							]
			}
		>
			<div>
				<Steps current={stepState.current} status={stepState.status}>
					<Step description={stepState.description0}  title="申请成交" />
					<Step description={stepState.description1} title="成交审核" />
					<Step description={stepState.description2} title="财务审核" />
					<Step description={stepState.description3} title="分佣" />
				</Steps>
				<div>
					<h4>成交房源</h4>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
					/>
				</div>
				<div className="ApplyDeal_selfStyle">
					<h4>已办理业务</h4>
					<ul>
						<li><Icon className={'条件'?'selected':'unselected'} type="check-square" />购房意向金</li>
						<li><Icon className={'条件'?'selected':'unselected'} type="check-square"/>购房首付款</li>
						<li><Icon className={false?'selected':'unselected'} type="check-square"/>中介佣金</li>
						<li><Icon className={'条件'?'selected':'unselected'} type="check-square"/>购房贷款</li>
						<li><Icon className={false?'selected':'unselected'} type="check-square"/>购房过户</li>
					</ul>
				</div>
				<div className="ApplyDeal_selfStyle">
					<ul>
						<li><span>佣金总额: </span><span>20000元</span></li>
						<li><span>平台佣金: </span><span>10%</span></li>
						<li><span>剩余佣金总额: </span><span>18000元</span></li>
					</ul>
				</div>
				<div className="ApplyDeal_selfStyle">
					<ul>
						<li><span>成交方式: </span><span>自有客户</span></li>
						<li><span>佣金比例: </span><span>90%</span></li>
						<li><span>佣金分配金额: </span><span>18000元</span></li>
					</ul>
				</div>
				{
					content()
				}
			</div>
		</Modal>
	)
}
ApplyDeal.propTypes={

};
function mapStateToProps({ secondDeal }) {
	return { secondDeal };
}
ApplyDeal=Form.create({})(ApplyDeal);
export default connect(mapStateToProps)(ApplyDeal);
