import {
	getInitIntentMoneyAuditTableDataFetch,
	getDetailsDataFetch,
	intentMoneyRejectFetch,
	intentMoneyPassFetch,
	getInitUserFetch,
	getInitDownPaymentAuditTableDataFetch,
	getInitCommissionAuditTableDataFetch,
	downPaymentPassFetch,
	downPaymentRejectFetch,
	commissionRejectFetch,
	commissionPassFetch,
	commitAuditList,
	requestApi,
	}
	from '../../services/contractReview/secondHandHouseSalesAudit'

import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {
	isNull,
	buildRefundOwnerInfo,
} from '../../../commons/utils/currencyFunction';
import {message} from 'antd';
const initState={
	//Index
	loadingShadow:false,
	resultData:[],
	initIntentMoneyAudit:[],
	tableLoading:true,
	activeKey:'dealAudit',
	//二手房成交审核弹出框
	projectDealAuditModal:{
		visible:false,
		currentRecord:{},
		dealAuditDatail:{},
	},
	/** 二手房成交审核分页 */
	secondHouseDealPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	/** 二手房意向金退款分页 */
	intentMoneyAuditPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	/** 二手房首付款退款审核分页 */
	initDownPaymentAuditTableDataPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	/** 二手房佣金退款审核分页 */
	initCommissionAuditTableDataPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},

	//二手房退款审核弹出框
	refundAuditModal:{
		visible:false,
		currentRecord:{},
	},
	auditExplainModal:{//审核最后一步填写审核/驳回原因__弹出框专用
		auditType:'',//一组件多用,判断当前属于哪个(项目发布,项目下架)审核.
		visible:false,
		title:'Title1',
		inputTitle:'Title2',
		projectId:'',
	},
	promptObj:{
	 visible:false,
	 description:'',
	 title:'',
	 promptFor:'default',
	 okText:'确定',
	 type:'',
	 todo:'',
 },
 resultTableData:[],
 resultReason:{},
 resultInfos:[],
 secondHouseDealList:[], /** 二手房成交审核列表 */
 /////////////////////////////////↓↓↓↓↓Du
 pagination:{//通用分页by Du
	 current:1,
	 total:0,
	 pageSize:10,
 },
 keyWords:'',
 secondHouseDealData:[],//二手房成交
 intentMoneyAuditData:[],//二手房意向金
 initDownPaymentAuditData:[],//二手房首付款
 initCommissionAuditData:[],//二手房佣金
}

export default {
	namespace:'secondHandHouseFinancialSalesAudit',
	state:initState,
	reducers:{
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
		},
		togglePrompt(state,action){
			return {...state,tableLoading:false,loadingShadow: false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
		toggleRefundAuditModal(state,action){
			return {...state,tableLoading:false, loadingShadow: false, refundAuditModal:Object.assign({},state.refundAuditModal,{...action.payload})}
		},
		toggleProjectDealAuditModal(state,action){
			return {...state,tableLoading:false, projectDealAuditModal:Object.assign({},state.projectDealAuditModal,{...action.payload})}
		},
		saveResultData(state,action){
			return{...state,tableLoading:false,...action.payload}
		},
		changeTableLoading(state,action){
			return{...state,...action.payload}
		},
		hiddleTableLoading(state,action) {
			return{...state,tableLoading:false}
		},
		showTableLoading(state,action){
			return{...state,tableLoading:true}
		},
		showDealListData(state,action) {
			return{...state,tableLoading:false,secondHouseDealList:action.payload.resultData}
		},
		showPrompt(state,action) {
			return{...state, tableLoading:false,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
		doInitState(state,action){
			return initState;
		},
		showProcess(state,action) {
      return {...state,loadingShadow: true};
    },
    hideProcess(state,action) {
      return {...state,loadingShadow: false};
    },
		updatePagination(state,action){
			return {...state,pagination:{...state.pagination,...action.payload}}
		},
		updateTabKey(state,action){
			return {...state,activeKey:action.payload,pagination:initState.pagination}
		},
		updateKeyWords(state,action){
			return {...state,keyWords:action.payload,pagination:initState.pagination}
		},
	},

	effects:{

		/** 加载 二手房出售财务列表 */
		*getInitSecondHandDealTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/sell/audit/financeAuditList";
				const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								// secondHouseDealPage:reObj,
								secondHouseDealData:reObj.content,
								pagination:{
							 	 current:reObj.pageNo+1,
							 	 total:reObj.total,
							 	 pageSize:reObj.size,
							  },
							}
						});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		},

		/** 二手房成交：获取一个审核流程的详细信息 */
		*getInitSecondHandDealData ({payload},{call,put}){
				console.log('---- ', payload);
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/getDetails";
				const responseObj = yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:"toggleProjectDealAuditModal",
						payload:{
							visible:true,
							dealAuditDatail:reObj,
						}
					});
					yield put ({
						type:'hideProcess',
					});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		},

		/** 二手房成交审核通过 */
		*secondHandDealPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				console.log('  - -- *-- *- *- * -')
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/pass";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'审核成功，等待分佣。',
							visible:true,
							todo:'closeModalAndSendFetch'
					}});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},

		/** 二手房成交审核驳回 */
		*secondHandDealReject({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/reject";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'驳回审核成功',
							visible:true,
							todo:'closeModalAndSendFetch'
					}});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},


		//获取意向金退款审核列表
		*getInitIntentMoneyAuditTableData({payload},{call,put}){	//获取意向金列表
			yield put ({
				type:'showTableLoading',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-intention/sell/audit/financeAuditList";
			const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
			var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
			if (reObj.isSuccess) {
					yield put({
						type:"saveResultData",
						payload:{
							// intentMoneyAuditPage:reObj,
							intentMoneyAuditData:reObj.content,
							pagination:{
							 current:reObj.pageNo+1,
							 total:reObj.total,
							 pageSize:reObj.size,
							},
						}
					});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						description:`${reObj.msg}`
				}});
			}
		},

		*getDetailsData({payload},{call,put}){	//获取详细信息(意向金)
			yield put ({
				type:'showProcess',
			});

			const responseObj = yield call(getDetailsDataFetch,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if (reObj.isSuccess) {
				const resultTableData = [];
				const resultReason = {};
				const resultInfos = [];
				if(reObj.orderinfo){
					const orderinfo = reObj.orderinfo;
					orderinfo.key = reObj.orderinfo.transCode;
					resultTableData.push(orderinfo)
				}
				if(reObj.applyinfo){
					resultReason.refundReason = reObj.applyinfo.refundReason
					resultReason.images = reObj.applyinfo.images
					resultReason.returnedToOwner=isNull(reObj.applyinfo.returnedToOwner,false);
					if(resultReason.returnedToOwner){
						resultReason.refundInfo=[
							{
								label:'收款方',
								value:resultReason.returnedToOwner?'业主':'购房者',
							},
							...buildRefundOwnerInfo(reObj.applyinfo,'arr')
						];
					}
				}
				if(reObj.auditinfos){
					const auditinfos = reObj.auditinfos;
					auditinfos.map(item=>{
						resultInfos.push({
							auditInfo:item.auditInfo,
							images:item.images
						})
					})
				}
				yield put({
					type:"saveResultData",
					payload:{
						resultTableData:resultTableData,
						resultReason:resultReason,
						resultInfos:resultInfos,
					}
				})
				yield put({
					type:"toggleRefundAuditModal",
					payload:{
						visible:true,
					}
				})
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						description:`${reObj.msg}`
				}});
			}
		},

		/** 财务：意向金通过 */
		*intentMoneyPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/pass";
			const responseObj = yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			console.log('**************************');
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功已转交由财务审核',
						visible:true,
						todo:'closeModalAndSendFetch'
				}});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},

		/** 意向金驳回 */
		*intentMoneyReject({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/reject";
			const responseObj=yield call(intentMoneyRejectFetch,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'驳回审核成功',
						visible:true,
						todo:'closeModalAndSendFetch'
				}});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},

		*getInitUser({payload},{call,put}){	//获取审核人员名单Fetch services里面请求地址未更正
				// const {data}=yield put(getInitUserFetch,{...payload})
				// if(!!data&&data.status==='success'){
				// 	console.log('获取审核人员名单成功');
				// }else{
				// 	yield put({
				// 		type:'togglePrompt',
				// 		payload:{
				// 			type:'error',
				// 			title:'失败!',
				// 			description:'获取审核人员名单失败',
				// 			visible:true,
				// 			todo:'closeModal'
				// 	}})
				// }
		},


		/** 二手房首付款退款审核 */
		*getInitDownPaymentAuditTableData({payload},{call,put}){
			yield put ({
				type:'showTableLoading',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-firstpayment/audit/financeAuditList";
			const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
			var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
			if (reObj.isSuccess) {
					yield put({
						type:"saveResultData",
						payload:{
							// initDownPaymentAuditTableDataPage:reObj,
							initDownPaymentAuditData:reObj.content,
							pagination:{
							 current:reObj.pageNo+1,
							 total:reObj.total,
							 pageSize:reObj.size,
							},
						}
					});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						description:`${reObj.msg}`
				}});
			}
		},

		/** 二手房佣金退款审核列表 */
		*getInitCommissionAuditTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commission/sell/audit/financeAuditList";
				const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								// initCommissionAuditTableDataPage:reObj,
								initCommissionAuditData:reObj.content,
								pagination:{
								 current:reObj.pageNo+1,
								 total:reObj.total,
								 pageSize:reObj.size,
								},
							}
						});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		},

		/** 首付款通过 */
		*downPaymentPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-firstpayment/audit/fefundAudit/pass";
			const responseObj = yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功，等待退款。',
						visible:true,
						todo:'closeModalAndSendDownPaymentFetch'
				}});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},
		/** 首付款驳回 */
		*downPaymentReject({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-firstpayment/audit/fefundAudit/reject";
			const responseObj=yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'驳回审核成功',
						visible:true,
						todo:'closeModalAndSendDownPaymentFetch'
				}});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},

		/** 佣金审核成功 */
		*commissionPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/pass";
			const responseObj=yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功，等待退款。',
						visible:true,
						todo:'closeModalAndSendCommissionFetch'
				}});
			}else {
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},
		/** 佣金审核驳回 */
		*commissionReject({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/reject";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'驳回审核成功',
							visible:true,
							todo:'closeModalAndSendCommissionFetch'
					}});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},
		///////////////////////////////↓↓↓↓↓↓↓↓ du
		//【初始化】组件状态
		*initComponent({payload},{put}){
			yield put({type:'doInitState'});
			if(!!sessionStorage.getItem('financialManagement_sh_sell')){
				yield put({
					type:'updateTabKey',
					payload:sessionStorage.getItem('financialManagement_sh_sell'),
				})
				yield put({type:'getActiveTabTableData'})
			}else{
				yield put({type:'getActiveTabTableData'})
			}
		},
		//搜索
		*changeKeyWords({payload},{put}){
			yield put({
				type:'updateKeyWords',
				payload,
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//分页变化
		*changePagination({payload},{put}){
			yield put({
				type:'updatePagination',
				payload:{
					current:payload.pageNo,
				}
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//tab切换
		*changeTabKeys({payload},{put}){
			sessionStorage.setItem('financialManagement_sh_sell',payload);
			yield put({
				type:'updateTabKey',
				payload,
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//获取激活tab表格数据
		*getActiveTabTableData({payload},{select,put}){
			const {
				activeKey,
				keyWords,
				pagination:{
					current,
					total,
					pageSize,
				},
			}=yield select(({secondHandHouseFinancialSalesAudit})=>secondHandHouseFinancialSalesAudit);
			console.log('keyWords',keyWords);
			if(activeKey==='dealAudit'){
				yield put({
					type:'getInitSecondHandDealTableData',
					payload:{
						keyWords,
						pageNo:current-1,
						pageSize,
					}
				})
			}
			else if(activeKey==='intentMoneyAudit'){
				yield put({
					type:'getInitIntentMoneyAuditTableData',
					payload:{
						keyWords,
						pageNo:current-1,
						pageSize,
					}
				})
			}
			else if(activeKey==='downPaymentAudit'){
				yield put({
					type:'getInitDownPaymentAuditTableData',
					payload:{
						keyWords,
						pageNo:current-1,
						pageSize,
					}
				})
			}
			else if(activeKey==='commissionAudit'){
				yield put({
					type:'getInitCommissionAuditTableData',
					payload:{
						keyWords,
						pageNo:current-1,
						pageSize,
					}
				})
			}
		},
		//关闭所有模态框
		*closeAllModal({payload},{select,put}){
			const {
				projectDealAuditModal,
			}=yield select(({secondHandHouseFinancialSalesAudit})=>secondHandHouseFinancialSalesAudit);
			console.log('projectDealAuditModal',projectDealAuditModal);
			yield put({
				type:'auditExplainModal/closeModal',
				payload:{
					visible:false
				}
			});
			// 关闭成交审核框
			yield put({
				type:'setState',
				payload:{
					projectDealAuditModal:{
						...projectDealAuditModal,
						visible:false,
					}
				}
			});
			yield put({
				type:"togglePrompt",
				payload:{
					visible:false
				}
			});
			yield put({
				type:"toggleRefundAuditModal",
				payload:{
					visible:false
				}
			});
			yield put({
				type:'getActiveTabTableData'
			})
		},
	},

	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				/** 默认加载 二手房成交审核列表 */
				if (location.pathname === '/financialManagement/secondHouseSellExamine') {
					// dispatch({
					// 	type:'initComponent'
					// })
					setTimeout(()=>dispatch({
						type:'initComponent',
					}),0);
					// dispatch({
					// 	type: 'getInitSecondHandDealTableData',
					// 	payload: {
					// 		pageSize:commonFinalCode.pageSize,
					// 		pageNo:0
					// 	}
					// });
				}
			});
		},
	}
}
