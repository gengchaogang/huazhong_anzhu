import React from 'react'
import {connect} from 'dva'
import {Table,Button,Tabs, message} from 'antd';
import { routerRedux,Link } from 'dva/router'
const TabPane = Tabs.TabPane;
import SearchInput from '../../../commons/View/SearchInput'

import ProjectDealAuditModal from '../../components/financialManagement/ProjectDealAuditModal'
import NewHouseRefundAuditModal from '../../components/financialManagement/NewHouseRefundAuditModal'

import AuditExplainModal from '../../components/contractReview/AuditExplainModal'
import './NewHouseElectricityExamination.css'
import '../../../commons/css/common.css';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../commons/View/PromptModal'
import {
	renderUnitPriceStr,
	renderTotalMoneyStr,
	renderMoneyStr,
} from '../../../commons/utils/publicFunction'

/*********************************************************/
/*********************************************************/
/****  （电商交易审核）财务审核：新房成交、团购退款审核 ******/
/********************************************************/
/********************************************************/

function NewHouseElectricityExamination({dispatch,newHouseElectricityExamination}){
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
		keyWords,
	}=newHouseElectricityExamination;
	const dealColumnsRender=(dataIndex,text,record)=>{
		const handleClick=()=>{
			// dispatch({
			// 	type:'newHouseElectricityExamination/setState',
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
			// 	type:'newHouseElectricityExamination/initShModalData',
			// 	payload:record,
			// });
			//审核页面压入模态框  changed by duxianqiu 17/05/17
			dispatch(routerRedux.push({
				pathname:'/financialManagement/newHouseElectricityExamination/nhCommitFinacialAudit',
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
			// "txStatus": "审核中",
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
			_key='请在此输入筛选关键字进行搜索，支持所属项目，支付订单，支付流水，支付客户'
			return _key
		}
  }
	const searchInputProps={
		placeholder:placeholdershow(activeKey),
		searchFuc:(value)=>dispatch({
			type:'newHouseElectricityExamination/searchSortTabelData',
			payload:value,
		}),
		clearFuc:()=>dispatch({
			type:'newHouseElectricityExamination/searchSortTabelData',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
	};
	const tableTagOnChange=(e)=>{
		dispatch({
			type:'newHouseElectricityExamination/tabTableChange',
			payload:e,
		})
	//
	// 	dispatch({
	// 		type:'newHouseElectricityExamination/setState',
	// 		payload:{
	// 			activeKey:e,
	// 		}
	// 	});
	//
	// 	if(e==='dealAudit'){
	// 		// 二手房意向金退款审核
	// 		dispatch({
	// 			type:'newHouseElectricityExamination/getNewHouseDealTableData',
	// 			payload:{
	// 				pageNo:0,
	// 				pageSize: newHouseDealPage.pageSize,
	// 			}
	// 		})
	// 	}else if (e === 'refundAudit') {
	// 		dispatch({
	// 			type:'newHouseElectricityExamination/getRefundAuditTableData',
	// 			payload:{
	// 				pageNo:0,
	// 				pageSize: refundAuditPage.pageSize,
	// 			}
	// 		})
	// 	}
	};

	/** 新房成交审核分页 */
	const paginationNewHouseDeal={
			showQuickJumper:commonFinalCode.showQuickJumper,
			// pageSize: newHouseDealPage.pageSize,
			pageSize: 10,
			current:newHouseDealPage.current,
			defaultCurrent:1,
			total:newHouseDealPage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'newHouseElectricityExamination/getNewHouseDealTableData',
					payload:{
						pageNo:page-1,
						keyword:keyWords,
						pageSize:10,
					}
				})
			},
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
		showQuickJumper:commonFinalCode.showQuickJumper,
		// pageSize: refundAuditPage.pageSize,
		pageSize: 10,
		current:refundAuditPage.current,
		defaultCurrent:1,
		total:refundAuditPage.total,
		showTotal:total => `共${total}条数据`,
		onChange:(page,pageSize)=>{
			dispatch({
				type:'newHouseElectricityExamination/getRefundAuditTableData',
				payload:{
					pageNo:page-1,
					keyword:keyWords,
					pageSize:10,
				}
			})
		},
	};

	/** 退款审核操作 */
	const refundColumnsRender=(dataIndex,text,record)=>{
		let handleClick=()=>{
			// dispatch({
			// 	type:'newHouseElectricityExamination/setState',
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
			// 	type:'newHouseElectricityExamination/initShRefundAuditData',
			// 	payload:record,
			// });
			//审核页面压入模态框  changed by duxianqiu 17/05/15
			dispatch(routerRedux.push({
				pathname:'/financialManagement/newHouseElectricityExamination/nhGroupBuyRefundFinacialAudit',
				state:{
					groupKey:record.groupKey,
					groupBuyId:record.groupbuyId,
					applyId:record.id,
				}
			}))
		};
		switch (dataIndex){
			case 'auditStatus':
				let _status = record.refundStatus;
				if (_status == '待财务审核') {
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
				if(record.refundStatus == '待财务审核') {
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
			dataIndex: 'status',
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




	// const onOkCallBack=()=>{
	// 	// if(promptObj.todo==='closeModal'){
	// 	// 	dispatch({
	// 	// 		type:"newHouseElectricityExamination/togglePrompt",
	// 	// 		payload:{
	// 	// 			visible:false
	// 	// 		}
	// 	// 	})
	// 	// }
	// 	//
	// 	// if((promptObj.todo === "closeModalAndSendFetch")
	// 	// 	|| (promptObj.todo === 'closeModalAndSendDownPaymentFetch')
	// 	// 	|| (promptObj.todo === 'closeModalAndSendCommissionFetch') ){
	// 	// 		// 完成
	// 	// 		// 关闭审核框
	// 	// 		dispatch({
	// 	// 			type:'auditExplainModal/closeModal',
	// 	// 			payload:{
	// 	// 				visible:false
	// 	// 			}
	// 	// 		});
	// 	// 		// 关闭
	// 	// 		dispatch({
	// 	// 			type:"newHouseElectricityExamination/togglePrompt",
	// 	// 			payload:{
	// 	// 				visible:false
	// 	// 			}
	// 	// 		});
	// 	//
	// 	// 		dispatch({
	// 	// 			type:'newHouseElectricityExamination/setState',
	// 	// 			payload:{
	// 	// 				projectDealAuditModal:{
	// 	// 					...projectDealAuditModal,
	// 	// 					visible:false,
	// 	// 				}
	// 	// 			}
	// 	// 		});
	// 	//
	// 	// 		// 关闭退款审核信息框
	// 	// 		dispatch({
	// 	// 			type:'newHouseElectricityExamination/setState',
	// 	// 			payload:{
	// 	// 				refundAuditModal:{
	// 	// 					...refundAuditModal,
	// 	// 					visible:false,
	// 	// 				}
	// 	// 			}
	// 	// 		});
	// 	//
	// 			// setTimeout(function() {
	// 			// 		if(activeKey === 'dealAudit') {
	// 			// 			// 重新加载成交审核列表列表
	// 			// 			dispatch({
	// 			// 				type:"newHouseElectricityExamination/getNewHouseDealTableData",
	// 			// 				payload:{
	// 			// 					pageNo: newHouseDealPage.pageNo,
	// 			// 					pageSize: newHouseDealPage.pageSize,
	// 			// 				}
	// 			// 			})
	// 			// 		}else if(activeKey === 'refundAudit') {
	// 			// 			dispatch({
	// 			// 				type:'newHouseElectricityExamination/findAuditList',
	// 			// 				payload:{
	// 			// 					pageNo: paginationRefund.pageNo,
	// 			// 					pageSize: paginationRefund.pageSize,
	// 			// 				}
	// 			// 			})
	// 			// 		}
	// 			// }, 500);
	// 	}
	// };

	const onCancelCallBack=()=>{

	};

	return (
    <div className="newHouseTransactionContractReview">
			<div style={{paddingTop:20}}>
				<SearchInput {...searchInputProps}/>
			</div>
			<ProjectDealAuditModal/>
			<NewHouseRefundAuditModal/>
			{/*<AuditExplainModal/>*/}
			<PromptModal {...promptObj} onOk={()=>dispatch({
					type:'newHouseElectricityExamination/judgePropModalTodo',
					payload:promptObj.todo
				})} onCancel={onCancelCallBack}/>
			<DxLoadingShadow visible={loadingShadow} />
			<div style={{paddingTop:20}}>
				<Tabs
					activeKey={activeKey}
					className='ant_tabs_anzhu'
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
		          />
		        </TabPane>

		        <TabPane tab='退款审核' key='refundAudit'>
		          <Table
								loading={tableLoading}
		            dataSource={refundAuditPage.content}
		            columns={columnsRefund}
		            pagination={paginationRefund}
		          />
		        </TabPane>

	      </Tabs>
			</div>
    </div>
	)
}

function mapStateToProps({newHouseElectricityExamination}){
	return {newHouseElectricityExamination}
}

export default connect(mapStateToProps)(NewHouseElectricityExamination);
