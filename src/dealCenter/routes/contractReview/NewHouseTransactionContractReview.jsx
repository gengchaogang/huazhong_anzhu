import React from 'react'
import {connect} from 'dva'
import { routerRedux,Link } from 'dva/router'
import {Table,Button,Tabs, message} from 'antd';
const TabPane = Tabs.TabPane;
import SearchInput from '../../../commons/View/SearchInput'
import ProjectDealAuditModal from '../../components/contractReview/ProjectDealAuditModal'
import NewHouseRefundAuditModal from '../../components/contractReview/NewHouseRefundAuditModal'
import AuditExplainModal from '../../components/contractReview/AuditExplainModal'
import './newHouseTransactionContractReview.css'
import '../../../commons/css/common.css';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {
	isNull,
} from '../../../commons/utils/currencyFunction.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import PromptModal from '../../../commons/View/PromptModal';
import {
	renderUnitPriceStr,
	renderTotalMoneyStr,
	renderMoneyStr,
} from '../../../commons/utils/publicFunction'

/*****************************************************/
/*****************************************************/
/**********  新房成交、团购退款审核 ********************/
/*****************************************************/
/*****************************************************/

function NewHouseTransactionContractReview({dispatch,newHouseTransactionContractReview}){
	const {
		activeKey,
		projectDealAudit,
		newHouseDealPage,
		projectDealAuditModal,
		refundAudit,
		refundAuditPage,
		refundAuditModal,
		promptObj,
		tableLoading,
		loadingShadow,
		pagination,
		}=newHouseTransactionContractReview;

	const dealColumnsRender=(dataIndex,text,record)=>{
		const handleClick=()=>{
			// dispatch({
			// 	type:'newHouseTransactionContractReview/setState',
			// 	payload:{
			// 		projectDealAuditModal:{
			// 			...projectDealAuditModal,
			// 			currentRecord:record,
			// 			visible:true,
			// 		}
			// 	}
			// });
			//
			// dispatch({
			// 	type:'newHouseTransactionContractReview/initShModalData',
			// 	payload:record,
			// });
			//审核模态框压入页面
			dispatch(routerRedux.push({
				pathname:'/contractReview/newhousetransactionContractReview/nhCommitContractAudit',
				state:{
					groupKey:record.groupKey,
					applyId:record.id,
				}
			}))
		};
		if(dataIndex=='sellingHouse'){
			return(
        <span>{record.sellingHouse}/{record.totalHouse}</span>
			)
		}else if(dataIndex=='electricityPrivilege'){
			return (
        <span>{text}个</span>
			)
		}else if(dataIndex=='status'){
			// "txStatus":  "审核中",
      // "auditStatus": "待审核",
			// isFinished
			// isAllowed
			// isAllow
			// isFinish
			if(record['isFinished']) {
				let _state = '';
				// 总状态：已完成  未通过
				if(record.auditStatus === '财务审核拒绝' || record.auditStatus === '业务审核拒绝' || record.auditStatus ==='已取消') {
					_state = <a className="rejectTextColor" onClick={handleClick}>{record.auditStatus}</a>
				}
				else {
					_state = <a className="passedTextColor" onClick={handleClick}>{record.auditStatus}</a>
				}

				return (
					<div>
						<p>已审核</p>
						{_state}
					</div>
				)
			}else {
					// 未审核
					return (
		        <div>
		          <p>待审核</p>
		        </div>
					)
			}
		}else if(dataIndex=='operation'){
			if (!record['isFinished']) {
				// 未审核
				return(
	        <a className="clickA" onClick={handleClick}>审核</a>
				)
			}else {
				return('')
			}
		}
	};
	const placeholdershow=(key)=>{
		// console.log(key,'keykey');
    let _key='';
    if(key=='dealAudit'){
      _key='请在此输入筛选关键字进行搜索，支持所属项目，成交房源，成交经纪人'
      return _key
    }else{
      // _key='请在此输入筛选关键字进行搜索，支持所属项目，退款类型，支付订单，支付流水，支付客户'
      _key='请在此输入筛选关键字进行搜索，支持所属项目，支付订单，支付流水，支付客户'
      return _key
    }
  }
	const searchInputProps={
		placeholder:placeholdershow(activeKey),
		searchFuc:(value)=>dispatch({
			type:'newHouseTransactionContractReview/changeKeyWords',
			payload:value,
		}),
		clearFuc:()=>dispatch({
			type:'newHouseTransactionContractReview/changeKeyWords',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
	};
	const tableTagOnChange=(e)=>{
		dispatch({
			type:'newHouseTransactionContractReview/changeTableTab',
			payload:e,
		})
		// dispatch({
		// 	type:'newHouseTransactionContractReview/setState',
		// 	payload:{
		// 		activeKey:e,
		// 	}
		// });
		//
		// if(e==='dealAudit'){
		// 	// 二手房意向金退款审核
		// 	dispatch({
		// 		type:'newHouseTransactionContractReview/getNewHouseDealTableData',
		// 		payload:{
		// 			pageNo:0,
		// 			pageSize: newHouseDealPage.pageSize,
		// 		}
		// 	})
		// }else if (e === 'refundAudit') {
		// 	dispatch({
		// 		type:'newHouseTransactionContractReview/getRefundAuditTableData',
		// 		payload:{
		// 			pageNo:0,
		// 			pageSize: refundAuditPage.pageSize,
		// 		}
		// 	})
		// }
	};

	/** 新房成交审核分页 */
	const paginationNewHouseDeal={
			showQuickJumper: commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current: pagination.current,
			defaultCurrent:1,
			total: pagination.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page)=>dispatch({
				type:'newHouseTransactionContractReview/changePage',
				payload:page,
			}),
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'newHouseTransactionContractReview/getNewHouseDealTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:newHouseDealPage.pageSize,
			// 		}
			// 	})
			// },
	};
	const columnsDeal=[
		{
			title: '序号',
			dataIndex: 'id',
			key:"id"
		},{
			title: '所属项目',
			dataIndex: 'projectName',
		},{
			title: '成交房源',
			dataIndex: 'houseName',
		},{
			title: '团购优惠',
			dataIndex:'discountName',
		},{
			title: '成交单价',
			dataIndex: 'unitPrice',
			render:(text, record) => renderUnitPriceStr(text)
		},{
			title: '成交总价',
			dataIndex:'totalPrice',
			render:(text, record) =>renderTotalMoneyStr(text)
		},{
	    title:'成交佣金',
      dataIndex:'brokerage',
			render:(text, record) => renderMoneyStr(text)
    },{
	    title:'成交经纪人',
      dataIndex:'brokerName',
    },{
			title: '成交时间',
			dataIndex: 'txTime',
		},{
			title: '审核状态',
			dataIndex: 'status',
			render:(text,record)=>{
				return dealColumnsRender('status',text,record);
			}
		},{
			title: '操作',
			dataIndex:'operation',
			render:(text,record)=>{
				return dealColumnsRender('operation',text,record);
			}
		},
	];



	/** ------------------- 退款审核 start ----------------------- */
	const paginationRefund={
		showQuickJumper: commonFinalCode.showQuickJumper,
		pageSize: pagination.pageSize,
		current: pagination.current,
		defaultCurrent:1,
		total: pagination.total,
		showTotal:total => `共${total}条数据`,
		onChange:(page)=>dispatch({
			type:'newHouseTransactionContractReview/changePage',
			payload:page,
		}),
		// onChange:(page,pageSize)=>{
		// 	dispatch({
		// 		type:'newHouseTransactionContractReview/getRefundAuditTableData',
		// 		payload:{
		// 			pageNo:page-1,
		// 			pageSize:refundAuditPage.pageSize,
		// 		}
		// 	})
		// },
	};

	/** 退款审核操作 */
	const refundColumnsRender=(dataIndex,text,record)=>{
		let handleClick=()=>{
			// dispatch({
			// 	type:'newHouseTransactionContractReview/setState',
			// 	payload:{
			// 		refundAuditModal:{
			// 			...refundAuditModal,
			// 			currentRecord:record,
			// 			visible:true,
			// 		}
			// 	}
			// });
			//
			// dispatch({
			// 	type:'newHouseTransactionContractReview/initShRefundAuditData',
			// 	payload:record,
			// });
			//审核模态框压入页面 changed by duxianqiu 17/05/15
			dispatch(routerRedux.push({
				pathname:'/contractReview/newhousetransactionContractReview/nhGroupBuyRefundContractAudit',
				state:{
					applyId:record.id,
					groupKey:record.groupKey,
					groupBuyId:record.groupbuyId,
				}
			}))

		};
		switch (dataIndex){
			case 'auditStatus':
				let _status = record.refundStatus;
				if (_status == '待合同审核') {
						return (
		          <div>
		            <p>等待审核</p>
		          </div>
						);
				}else {
					let _class = 'passedTextColor';
					if (_status == '合同审核/已驳回' || _status == '财务审核/已驳回') {
							_class = 'rejectTextColor';
					}
					return (
	          <div>
	            <p>已审核</p>
							<a className={_class} onClick={handleClick}>{record.refundStatus}</a>
	          </div>
					);
				}
			case 'operation':
				if(record.refundStatus == '待合同审核') {
						return (
							<div>
								<a className="clickA" onClick={handleClick}>审核</a>
							</div>
						)
				}else {
					return('');
				}
			default:
				break;
		}
	};

	const columnsRefund=[
		{
			title: '序号',
			dataIndex: 'id',
			key:"id"
		},{
			title: '所属项目',
			dataIndex: 'projectName',
		},{
			title: '退款类型',
			dataIndex: 'refundType',
		},{
			title: '退款金额',
			dataIndex: 'groupbuyMoney',
			render:text=>`${text}元`
		},{
			title: '支付时间',
			dataIndex: 'payFinishTime',
		},{
			title:'支付订单',
			dataIndex:'payOrderNumber'
		},{
			title:'支付流水',
			dataIndex:'paySerialNumber'
		},{
			title: '支付客户',
			dataIndex: 'customerName',
		},{
			title: '审核状态',
			dataIndex: 'refundStatus',
			render:(text,record)=>{
				return refundColumnsRender('auditStatus',text,record)
			}
		},{
			title: '操作',
			dataIndex: 'operation',
			render:(text,record)=>{
				return refundColumnsRender('operation',text,record)
			}
		},
	];




	const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"newHouseTransactionContractReview/togglePrompt",
				payload:{
					visible:false
				}
			})
		}

		if((promptObj.todo === "closeModalAndSendFetch")
			|| (promptObj.todo === 'closeModalAndSendDownPaymentFetch')
			|| (promptObj.todo === 'closeModalAndSendCommissionFetch') ){
				dispatch({
					type:'newHouseTransactionContractReview/closeAllModal',
				})

				//
				//
				//
				//
				// // 完成
				// // 关闭审核框
				// dispatch({
				// 	type:'auditExplainModal/closeModal',
				// 	payload:{
				// 		visible:false
				// 	}
				// });
				// // 关闭
				// dispatch({
				// 	type:"newHouseTransactionContractReview/togglePrompt",
				// 	payload:{
				// 		visible:false
				// 	}
				// });
				//
				// dispatch({
				// 	type:'newHouseTransactionContractReview/setState',
				// 	payload:{
				// 		projectDealAuditModal:{
				// 			...projectDealAuditModal,
				// 			visible:false,
				// 		}
				// 	}
				// });
				//
				// // 关闭退款审核信息框
				// dispatch({
				// 	type:'newHouseTransactionContractReview/setState',
				// 	payload:{
				// 		refundAuditModal:{
				// 			...refundAuditModal,
				// 			visible:false,
				// 		}
				// 	}
				// });
				//
				// setTimeout(function() {
				// 		if(activeKey === 'dealAudit') {
				// 			// 重新加载成交审核列表列表
				// 			dispatch({
				// 				type:"newHouseTransactionContractReview/getNewHouseDealTableData",
				// 				payload:{
				// 					pageNo: newHouseDealPage.pageNo,
				// 					pageSize: newHouseDealPage.pageSize,
				// 				}
				// 			})
				// 		}else if(activeKey === 'refundAudit') {
				// 			dispatch({
				// 				type:'newHouseTransactionContractReview/findAuditList',
				// 				payload:{
				// 					pageNo: paginationRefund.pageNo,
				// 					pageSize: paginationRefund.pageSize,
				// 				}
				// 			})
				// 		}
				// }, 500);
		}
	};
	const onCancelCallBack=()=>{

	};

	return (
    <div className="newHouseTransactionContractReview">
			<div className='anzhu_dx_container_box'>
	      <SearchInput {...searchInputProps}/>
			</div>
			<ProjectDealAuditModal/>
			<NewHouseRefundAuditModal/>
			{/*<AuditExplainModal/>*/}
			<PromptModal zIndex={5000} {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
			<DxLoadingShadow visible={loadingShadow} />
			<div style={{paddingTop:20}}>
				<Tabs
					className='ant_tabs_anzhu'
					activeKey={activeKey}
					defaultActivKey="dealAudit"
					onChange={tableTagOnChange}
					type="card"
					>

						<TabPane tab='成交审核' key='dealAudit'>
							<Table
								loading={tableLoading}
								dataSource={newHouseDealPage.content}
								columns={columnsDeal}
								pagination={paginationNewHouseDeal}
								rowKey={renderTableKey}
							/>
						</TabPane>

						<TabPane tab='退款审核' key='refundAudit'>
							<Table
								loading={tableLoading}
								dataSource={refundAuditPage.content}
								columns={columnsRefund}
								pagination={paginationRefund}
								rowKey={renderTableKey}
							/>
						</TabPane>
				</Tabs>
			</div>
    </div>
	)
}

function mapStateToProps({newHouseTransactionContractReview}){
	return {newHouseTransactionContractReview}
}
function renderTableKey(record){
	return record.indexXh
}
export default connect(mapStateToProps)(NewHouseTransactionContractReview);
