import {
	getDetailsDataFetch,
	getInitUserFetch,
	requestApi,
}
from '../../services/contractReview/secondHandHouseRentalAudit'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {
	isNull,
	buildRefundOwnerInfo,
} from '../../../commons/utils/currencyFunction';

/*****************************************************/
/*****************************************************/
/********** 财务审核： 二手房出租等功能 ****************/
/*****************************************************/
/*****************************************************/

import {message} from 'antd';
const initState={
	resultData:[],
	tableLoading:false,
	loadingShadow:false,
	activeKey:'dealAudit',

	// 二手房 出租审核Page
	secondHouseRentalPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},

	//二手房成交审核弹出框
	projectDealAuditModal:{
		visible:false,
		currentRecord:{},
		dealAuditDatail:{},
	},

	//二手房退款审核弹出框
	refundAuditModal:{
		visible:false,
		currentRecord:{},
	},
	// 二手房出租 意向金退款Page
	intentMoneyAuditPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	// 二手房出租 佣金退款Page
	initCommissionAuditPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
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
 pagination:{
	 current:1,
	 total:0,
	 pageSize:10,
 },
 keyword:'',
}
export default {
	namespace:'secondHandHouseFinancialRentalAudit',
	state:initState,

	reducers:{
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
		},
		togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
		toggleRefundAuditModal(state,action){
			return {...state,refundAuditModal:Object.assign({},state.refundAuditModal,{...action.payload})}
		},
		changeTableLoading(state,action){
			return{...state,...action.payload}
		},
		saveResultData(state,action){
			return{...state,tableLoading:false,...action.payload}
		},
		showProcess(state,action) {
			return {...state,loadingShadow: true};
		},
		hideProcess(state,action) {
			return {...state,loadingShadow: false};
		},
		hiddleTableLoading(state,action) {
			return{...state,tableLoading:false}
		},
		showTableLoading(state,action){
			return{...state,tableLoading:true}
		},
		showPrompt(state,action) {
			return{...state, tableLoading:false,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
		toggleProjectDealAuditModal(state,action){
			return {...state,tableLoading:false, projectDealAuditModal:Object.assign({},state.projectDealAuditModal,{...action.payload})}
		},
		doInitState(state,action){
			return initState;
		},
		updateTableTab(state,action){
			return {...state,activeKey:action.payload,pagination:initState.pagination}
		},
		updateKeywords(state,action){
			return {...state,keyword:action.payload,pagination:initState.pagination}
		},
		updatePage(state,action){
			return {...state,pagination:{...state.pagination,...action.payload}}
		},
	},


	effects:{

		/** ------------------------二手房出租 start----------------------------- */
		/** 【租】获取成交财务审核列表 */
		*getInitSecondHandDealTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				console.log('getInitSecondHandDealTableData................')
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/lease/audit/financeAuditList";
				const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								secondHouseRentalPage:reObj,
								pagination:{
									current:reObj.number+1,
									total:reObj.totalElements,
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
		/** 二手房审核通过 */
		*secondHandDealPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			console.log('  - -- *-- *- *- * -');
			payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/pass";
			const responseObj=yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({type:'hideProcess'});
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功，等待分佣。',
						visible:true,
						todo:'closeModalAndSendFetch'
				}});
				yield put({type:'hideProcess'})
			}else {
				yield put({type:'hideProcess'});
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},
		/** 二手房审核驳回 */
		*secondHandDealReject({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/reject";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({type:'hideProcess'});
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
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},

		//获取一个审核流程的详细信息
		*getInitSecondHandDealData ({payload},{call,put}){
				console.log('---- ', payload);
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/getDetails";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({type:'hideProcess'});
					yield put({
						type:"toggleProjectDealAuditModal",
						payload:{
							visible:true,
							dealAuditDatail:reObj,
						}
					});
				}else {
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		},

		/** ----------------------------意向金 start---------------------------- */
		*getInitIntentMoneyAuditTableData({payload},{call,put}){	//获取意向金列表
			yield put ({
				type:'showTableLoading',
			});
			console.log('getInitIntentMoneyAuditTableData.....')
			payload.apiName = "/miss-anzhu-secdhouse-tx-intention/lease/audit/financeAuditList";
			const responseObj = yield call(requestApi, {...payload,auditType:'financial'});
			var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
			if (reObj.isSuccess) {
					yield put({type:'hideProcess'});
					yield put({
						type:"saveResultData",
						payload:{
							intentMoneyAuditPage:reObj,
							pagination:{
								current:reObj.number+1,
								total:reObj.totalElements,
								pageSize:reObj.size,
							},
						}
					});
			}else {
				yield put({type:'hideProcess'});
				yield put({
					type:'showPrompt',
					payload:{
						description:`${reObj.msg}`
				}});
			}
		},


		//获取详细信息(意向金)
		*getDetailsData({payload},{call,put}){
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
					yield put ({
						type:'hideProcess',
					});
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


		//意向金通过Fetch
		*intentMoneyPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/pass";
				const responseObj = yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				console.log('**************************');
				if(reObj.isSuccess) {
					yield put({type:'hideProcess'});
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'审核成功，等待退款。',
							visible:true,
							todo:'closeModalAndSendFetch'
					}});
				}else {
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},
		//意向金驳回Fetch
		*intentMoneyReject({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/reject";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({type:'hideProcess'});
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
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},


		//获取审核人员名单Fetch services里面请求地址未更正
		*getInitUser({payload},{call,put}){
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

		/** -----------------------------佣金 start--------------------------------- */
		/** 【租】获取退款财务审核列表 */
		*getInitCommissionAuditTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				console.log('getInitCommissionAuditTableDataFetch................')
				payload.apiName = "/miss-anzhu-secdhouse-tx-commission/lease/audit/financeAuditList";
				const responseObj=yield call(requestApi,{...payload,auditType:'financial'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({type:'hideProcess'});
						yield put({
							type:"saveResultData",
							payload:{
								initCommissionAuditPage:reObj,
								pagination:{
									current:reObj.number+1,
									total:reObj.totalElements,
									pageSize:reObj.size,
								},
							}
						});
				}else {
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		},
		/** 佣金退款审核通过 */
		*commissionPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				payload.apiName = "/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/pass";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({type:'hideProcess'});
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
					yield put({type:'hideProcess'});
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},
		/** 佣金退款审核驳回 */
		*commissionReject({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			payload.apiName = "/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/reject";
			const responseObj=yield call(requestApi,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({type:'hideProcess'});
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
				yield put({type:'hideProcess'});
				yield put({
					type:'showPrompt',
					payload:{
						title:'失败!',
						description:`${reObj.msg}`
				}});
			}
		},
		//初始化组件状态
		*doInitComponent({payload},{put}){
			yield put({
				type:'doInitState'
			})
			if(!!sessionStorage.getItem('financialManagement_sh_rent')){
				yield put({
					type:'updateTableTab',
					payload:sessionStorage.getItem('financialManagement_sh_rent'),
				})
				yield put({type:'getActiveTabTableData'})
			}else{
				yield put({type:'getActiveTabTableData'})
			}
		},
		//tab切换
		*changeTableTab({payload},{put}){
			sessionStorage.setItem('financialManagement_sh_rent',payload);
			yield put({
				type:'updateTableTab',
				payload,
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//搜索过滤
		*changeKeyWords({payload},{put}){
			yield put({
				type:'updateKeywords',
				payload,
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//分页变化
		*changePage({payload},{put}){
			yield put({
				type:'updatePage',
				payload:{
					current:payload,
				}
			});
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//获取激活tab表格数据
		*getActiveTabTableData({payload},{put,select}){
			const{
				pagination:{
			 	 current,
			 	 total,
			 	 pageSize,
				},
				activeKey,
				keyword,
			}=yield select(({secondHandHouseFinancialRentalAudit})=>secondHandHouseFinancialRentalAudit);
			if(activeKey==='dealAudit'){
				yield put({
					type:'getInitSecondHandDealTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords:keyword,
					}
				})
			}
			else if(activeKey==='intentMoneyAudit'){
				yield put({
					type:'getInitIntentMoneyAuditTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords:keyword,
					}
				})
			}
			else if(activeKey==='commissionAudit'){
				yield put({
					type:'getInitCommissionAuditTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords:keyword,
					}
				})
			}
		},
		//提示框 todo 判定
		*closePrompt({payload},{select,put}){
			const{
				todo,
			}=yield select(({secondHandHouseFinancialRentalAudit})=>secondHandHouseFinancialRentalAudit.promptObj);
			if(todo==='closeModal'){
				yield put({
					type:"togglePrompt",
					payload:{
						visible:false
					}
				})
			}
			else if(todo==='closeModalAndSendFetch'){
				yield put({
					type:'auditExplainModal/closeModal',
					payload:{
						visible:false
					}
				})
				yield put({
					type:"togglePrompt",
					payload:{
						visible:false
					}
				})
				yield put({
					type:"toggleRefundAuditModal",
					payload:{
						visible:false
					}
				})
				yield put({
					type:'getActiveTabTableData'
				})
			}
			else if(todo==='closeModalAndSendDownPaymentFetch'){
				yield put({
					type:'auditExplainModal/closeModal',
					payload:{
						visible:false
					}
				})
				yield put({
					type:"togglePrompt",
					payload:{
						visible:false
					}
				})
				yield put({
					type:"toggleRefundAuditModal",
					payload:{
						visible:false
					}
				})
				yield put({
					type:'getActiveTabTableData'
				})
			}
			else if(todo==='closeModalAndSendCommissionFetch'){
				yield put({
					type:'auditExplainModal/closeModal',
					payload:{
						visible:false
					}
				})
				yield put({
					type:"togglePrompt",
					payload:{
						visible:false
					}
				})
				yield put({
					type:"toggleRefundAuditModal",
					payload:{
						visible:false
					}
				})
				yield put({
					type:'getActiveTabTableData'
				})
			}
		},
	},
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/financialManagement/secondHouseLeaseExamine') {
					dispatch({
						type:'doInitComponent'
					})
					// setTimeout(()=>dispatch({
					// 	type:'initComponent',
					// }),0);
					// dispatch({
					// 	type: 'getInitSecondHandDealTableData',
					// 	payload: {
					// 		pageSize:commonFinalCode.pageSize,
					// 		pageNo:0,
					// 	}
					// });
				}
			});
		},
	}
}
