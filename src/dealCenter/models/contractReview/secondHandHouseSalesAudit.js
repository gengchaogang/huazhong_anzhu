import { routerRedux } from 'dva/router'
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
	secondHandDealPass,
	secondHandDealReject,
	}
	from '../../services/contractReview/secondHandHouseSalesAudit'

import {
		requestApi
}from '../../services/common'

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
	keyWords:"",
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
 pagination:{
	 current:1,
	 total:0,
	 pageSize:10,
 }
}
export default {
	namespace:'secondHandHouseSalesAudit',
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
			return {...state,tableLoading:false, loadingShadow: false,refundAuditModal:Object.assign({},state.refundAuditModal,{...action.payload})}
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
		showProcess(state,action) {
      return {...state,loadingShadow: true};
    },
    hideProcess(state,action) {
      return {...state,loadingShadow: false};
    },
		//更新keyWords
		doUpdateKeyWords(state,action){
			return {...state,keyWords:action.payload,pagination:initState.pagination}
		},
		doInitState(state,action){
			return initState
		},
		updateTableTab(state,action){
			return {...state,activeKey:action.payload,pagination:initState.pagination}
		},
		updatePage(state,action){
			return {...state,pagination:{...state.pagination,...action.payload}}
		},
		closeProjectDealAuditModal(state,action){
			return {...state,projectDealAuditModal:{...state.projectDealAuditModal,visible:false}}
		},
	},
	effects:{
		/**↓↓↓↓↓↓↓↓↓↓↓↓  du   ↓↓↓↓↓↓↓↓↓↓↓↓***/
		//初始化组件状态
		*initComponent({payload},{put}){
			yield put({
				type:'doInitState'
			})
			if(!!sessionStorage.getItem('contractReview_sh_sell')){
				yield put({
	 				type:'updateTableTab',
	 			 	payload:sessionStorage.getItem('contractReview_sh_sell'),
	 			})
				yield put({type:'getActiveTabTableData'})
			}else{
				yield put({type:'getActiveTabTableData'})
			}
		},
		//tab变化
		*changeTableTab({payload},{put}){
			sessionStorage.setItem('contractReview_sh_sell',payload)
			yield put({
				type:'updateTableTab',
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
			})
			yield put({
				type:'getActiveTabTableData'
			})
		},
		//获取激活tab表格数据
		*getActiveTabTableData({payload},{select,put}){
			const{
				activeKey,
				keyWords,
				pagination:{
					current,
					total,
					pageSize,
				}
			}=yield select(({secondHandHouseSalesAudit})=>secondHandHouseSalesAudit);
			if(activeKey==='dealAudit'){
				yield put({
					type: 'getInitSecondHandDealTableData',
					payload: {
						pageSize,
						pageNo:current-1,
						keyWords,
					}
				})
			}
			else if(activeKey==='intentMoneyAudit'){
				yield put({
					type:'getInitIntentMoneyAuditTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords,
					}
				})
			}
			else if(activeKey==='downPaymentAudit'){
				yield put({
					type:'getInitDownPaymentAuditTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords,
					}
				})
			}
			else if(activeKey==='commissionAudit'){
				yield put({
					type:'getInitCommissionAuditTableData',
					payload:{
						pageSize,
						pageNo:current-1,
						keyWords,
					}
				})
			}
		},
		//搜索过滤
		*searchKeyWord({payload},{put}){
			yield put({
				type:'doUpdateKeyWords',
				payload,
			});
			yield put({
				type:'getActiveTabTableData'
			})
		},
		/**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑  du   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑***/
		/** 加载 二手房列表 */
		*getInitSecondHandDealTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				console.log('-------------')
				payload.apiName = "/miss-anzhu-secdhouse-tx-commit/sell/audit/commitAuditList";
				const responseObj = yield call(requestApi, {...payload,auditType:'contract'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								secondHouseDealPage:reObj,
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

		//关闭所有模态框，审核完成
		*closeAllModal({payload},{put}){
			// 完成
			yield put({
				type:'auditExplainModal/closeModal',
				payload:{
					visible:false
				}
			});

			// 关闭成交审核框
			yield put({
				type:'closeProjectDealAuditModal',
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
		*getInitSecondHandDealData ({payload},{call,put}){
				console.log('---- ', payload);
				yield put ({
					type:'showProcess',
				});
				const responseObj=yield call(getDetailsDataFetch,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				console.log('reObj',reObj);
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

		//获取意向金退款审核列表
		*getInitIntentMoneyAuditTableData({payload},{call,put}){	//获取意向金列表
			yield put ({
				type:'showTableLoading',
			});
			// const {data}=yield call(getInitIntentMoneyAuditTableDataFetch,{...payload});
			// if(!!data && !!data.data){
			//
			// }else{
			//
			// }
			const responseObj=yield call(getInitIntentMoneyAuditTableDataFetch,{...payload,auditType:'contract'});
			var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
			if (reObj.isSuccess) {
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
				yield put({
					type:'showPrompt',
					payload:{
						description:`错误（1101）${reObj.msg}`
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
				let resultReason = {};
				const resultInfos = [];
				if(reObj.orderinfo){
					const orderinfo = reObj.orderinfo;
					orderinfo.key = reObj.orderinfo.transCode;
					resultTableData.push(orderinfo)
				}
				if(reObj.applyinfo){
					resultReason.refundReason = reObj.applyinfo.refundReason
					resultReason.images = reObj.applyinfo.images;
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
						description:`错误2001${reObj.msg}`
				}});
			}
		},

		*secondHandSaleDealPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			console.log('  - -- *-- *- *- * -', payload);
			payload.apiName = "/miss-anzhu-secdhouse-tx-commit/audit/commitAudit/pass";
			const responseObj=yield call(requestApi, {...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
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

		/** 二手房成交审核驳回 */
		*secondHandSaleDealReject({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			const responseObj=yield call(secondHandDealReject,{...payload});
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

		/** 意向金通过 */
		*intentMoneyPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			const responseObj = yield call(intentMoneyPassFetch,{...payload});
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
		//提示模态框行为判断
    // *closePrompt({payload},{select,call,put}){
    //   const{todo,transCode}=yield select(({secondHouseSellTrade})=>secondHouseSellTrade.promptObj);
    //   switch (todo) {
    //     case 'default':
    //       yield put({
    //         type:'onlyClosePrompt'
    //       });
    //       break;
    //     default:
    //       yield put({
    //         type:'onlyClosePrompt'
    //       });
    //       break;
    //   }
    // },
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
			const responseObj=yield call(getInitDownPaymentAuditTableDataFetch,{...payload,auditType:'contract'});
			var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
			if (reObj.isSuccess) {
					yield put({
						type:"saveResultData",
						payload:{
							initDownPaymentAuditTableDataPage:reObj,
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

		/** 二手房佣金退款审核列表 */
		*getInitCommissionAuditTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				const responseObj=yield call(getInitCommissionAuditTableDataFetch,{...payload,auditType:'contract'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								initCommissionAuditTableDataPage:reObj,
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

		/** 首付款通过 */
		*downPaymentPass({payload},{call,put}){
			yield put ({
				type:'showProcess',
			});
			const responseObj = yield call(downPaymentPassFetch,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功已转交由财务审核',
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
			const responseObj=yield call(downPaymentRejectFetch,{...payload});
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
			const responseObj=yield call(commissionPassFetch,{...payload});
			var reObj = analysisUtil.analysisDataResponse(responseObj);
			if(reObj.isSuccess) {
				yield put({
					type:'togglePrompt',
					payload:{
						type:'success',
						title:'成功!',
						description:'审核成功已转交由财务审核',
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
				const responseObj=yield call(commissionRejectFetch,{...payload});
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

	},

	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contractReview/secondHandHouseSalesAudit'){
					// dispatch({type:'initComponent'})
					setTimeout(()=>dispatch({
						type:'initComponent',
					}),0);
				}
			});
		},
	}
}
