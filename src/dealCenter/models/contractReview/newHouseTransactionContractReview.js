import {
		findAllMyDealAudit,
		getTrackDetailByGroupKeyAndDetailType,
		acceptanceDealAudit,
		rejectDealAudit,
		findAuditList,
		findGroupBuyPayOrder,
		findGroupBuyAuditInfo,
		gruopBuyContractReview,
	}
	from '../../services/contractReview/newHouseTransactionContractReview'
import {
		requestApi,
	}
	from '../../services/common'

import {message} from 'antd';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';


const initialState={
	//Index
	activeKey:'dealAudit',
	loadingShadow:false,
	tableLoading:false,

	newHouseDealPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	//项目成交审核表格组件
	projectDealAudit:{
		response:{
			data:{
				content:[],
				pageSize:10,
				pageNo:1,
				totalElements:5,
			}
		},
		loading:false,
	},
	//项目成交审核弹出框
	projectDealAuditModal:{
		visible:false,
		currentRecord:{},
	},


	refundAuditPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	//项目退款审核表格组件
	refundAudit:{
		response:{
			data:{
				data:{
					content:[],
					size:10,
					number:1,
					totalElements:10,
				}
			},
		},
		loading:false,
	},
	//项目退款审核弹出框
	refundAuditModal:{
		visible:false,
		currentRecord:{},
	},
	refundOrerInfo:{},					// 团购订单信息
	trackDetailData:{}, 				// 审核记录信息
	trackRefundDetailData:{},		// 退款审核记录信息
	auditExplainModal:{					//审核最后一步填写审核/驳回原因__弹出框专用
		auditType:'',							//一组件多用,判断当前属于哪个(项目发布,项目下架)审核.

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
	keyword:'',
	pagination:{
		current:1,
		total:0,
		pageSize:10,
	},

};

export default {
	namespace:'newHouseTransactionContractReview',
	state:initialState,
	reducers:{
		resetState(state){
			return {
				...state,
				...initialState
			};
		},
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
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
		togglePrompt(state,action){
			return {...state,tableLoading:false,loadingShadow: false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
		initTrackDetailData(state,action){
				return{...state,trackDetailData:{}}
		},
		initRrackRefundDetailData(state,action){
				return{...state,trackRefundDetailData:{}}
		},
		initRefundOrerInfo(state,action){
				return{...state,refundOrerInfo:{}}
		},
		doInitState(state,action){
			return initialState;
		},
		updateTableTab(state,action){
			return {...state,activeKey:action.payload,pagination:initialState.pagination}
		},
		updateKeywords(state,action){
			return {...state,keyword:action.payload,pagination:initialState.pagination}
		},
		updatePage(state,action){
			return {...state,pagination:{...state.pagination,...action.payload}}
		},
		closeProjectDealAuditModal(state,action){
			return {...state,projectDealAuditModal:{...state.projectDealAuditModal,visible:false}}
		},
		closeRefundAuditModal(state,action){
			return {...state,refundAuditModal:{...state.refundAuditModal,visible:false}}
		},
	},

	effects:{
		 //初始化组件状态
		 *initComponent({payload},{put}){
			 yield put({
				 type:'doInitState',
			 })
			 if(!!sessionStorage.getItem('contractReview_nh_trade')){
 				yield put({
 					type:'updateTableTab',
 					payload:sessionStorage.getItem('contractReview_nh_trade'),
 				})
 				yield put({type:'getActiveTabTableData'})
 			}else{
 				yield put({type:'getActiveTabTableData'})
 			}
		 },
		 //tab切换
		 *changeTableTab({payload},{put}){
 			 sessionStorage.setItem('contractReview_nh_trade',payload);
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
		 *getActiveTabTableData({payload},{select,put}){
			 const{
				 keyword,
				 pagination:{
					 current,
					 total,
					 pageSize,
				 },
				 activeKey,
			 }=yield select(({newHouseTransactionContractReview})=>newHouseTransactionContractReview);
			 if(activeKey==='dealAudit'){
				 yield put({
					 type:'getNewHouseDealTableData',
					 payload:{
             pageSize,
             pageNo:current-1,
             keyword,
					 }
				 })
			 }
			 else if(activeKey==='refundAudit'){
				 yield put({
					 type:'getRefundAuditTableData',
					 payload:{
             pageSize,
             pageNo:current-1,
             keyword,
					 }
				 })
			 }
		 },
		//关闭一大堆模态框（审核完成）
		*closeAllModal({payload},{select,put}){
			yield put({
				type:'auditExplainModal/closeModal',
				payload:{
					visible:false
				}
			})
			yield put({
				type:'togglePrompt',
				payload:{
					visible:false
				}
			})
			yield put({
				type:'closeProjectDealAuditModal',
			})
			yield put({
				type:'closeRefundAuditModal',
			})
			yield put({
				type:'getActiveTabTableData',
			})
		},

		*getNewHouseDealTableData({payload},{call,put}){
				console.log('getNewHouseDealTableData----------------------');
				yield put ({
					type:'showTableLoading',
				});

				payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/findAllMyDealAudit";
				const responseObj = yield call(requestApi, {...payload});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
					yield put({
						type:"saveResultData",
						payload:{
							newHouseDealPage:reObj,
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

		/** 加载审核记录信息 */
		*initShModalData({payload},{call,put,select}){
				yield put ({
					type:'showProcess',
				});
				// 初始审核信息
				yield put ({
					type:'initTrackDetailData',
				});
				const params = {groupKey:payload.groupKey,detailType:"成交审核"};
				// 得到state的信息
				const {projectDealAuditModal} = yield select(({newHouseTransactionContractReview})=>newHouseTransactionContractReview);
				const responseObj = yield call(getTrackDetailByGroupKeyAndDetailType,{...params});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								trackDetailData:reObj,
							  pagination:{
							    current:reObj.number+1,
							    total:reObj.totalElements,
							    pageSize:reObj.size,
							  },
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

		/** 新房审核通过 */
		*newHouseDealPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['auditResultDesc'] = payload['reason'];
						}
						if(payload['images']) {
							payload['auditResultFile'] = JSON.stringify(payload['images']);
						}
						if(payload['toUserId']) {
							payload['auditUserId'] = payload['toUserId'];
						}
						if(payload['toUserName']) {
							payload['auditUserName'] = payload['toUserName'];
						}
				}
				payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/acceptanceDealAudit";
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
					yield put ({
						type:'hideProcess',
					});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},

		/** 新房审核驳回 */
		*newhouseRejectDealAudit({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['auditResultDesc'] = payload['reason'];
						}
						if(payload['images']) {
							payload['auditResultFile'] = JSON.stringify(payload['images']);
						}
						if(payload['toUserId']) {
							payload['auditUserId'] = payload['toUserId'];
						}
						if(payload['toUserName']) {
							payload['auditUserName'] = payload['toUserName'];
						}
				}
				payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/rejectDealAudit"
				const responseObj=yield call(requestApi, {...payload});
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
					yield put ({
						type:'hideProcess',
					});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},


		/** --------------------------退款审核 start---------------------------- */
		*getRefundAuditTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				const responseObj = yield call(findAuditList, {...payload,auditType:'contract'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								refundAuditPage:reObj,
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


		/** 加载退款审核记录信息 */
		*initShRefundAuditData({payload},{call,put,select}){
				yield put ({
					type:'showProcess',
				});
				// 查询订单信息
				yield put ({
					type:'initRefundOrerInfo',
				});
				const params = {groupbuyId:payload.groupbuyId};
				// 得到state的信息
				const {refundAuditModal} = yield select(({newHouseTransactionContractReview})=>newHouseTransactionContractReview);
				const responseObj = yield call(findGroupBuyAuditInfo,{...params});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								refundOrerInfo:reObj,
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

		/** 退款审核通过 */
		*newHouseRefundAuditPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['contractComment'] = payload['reason'];
						}
						if(payload['images']) {
							payload['contractPic'] = payload['images'];
						}
						if(payload['toUserId']) {
							payload['financialAuditUserId'] = payload['toUserId'];
						}
						if(payload['toUserName']) {
							payload['financialAuditUserName'] = payload['toUserName'];
						}
				}
				payload['contractReviewResult'] = '审核通过';
				console.log('------------------------------------');
				const responseObj=yield call(gruopBuyContractReview,{...payload});
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
					yield put ({
						type:'hideProcess',
					});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},

		/** 退款审核驳回 */
		*newhouseRefundAuditRefuse({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['contractComment'] = payload['reason'];
						}
						if(payload['images']) {
							payload['contractPic'] = payload['images'];
						}
						if(payload['toUserId']) {
							payload['financialAuditUserId'] = payload['toUserId'];
						}
						if(payload['toUserName']) {
							payload['financialAuditUserName'] = payload['toUserName'];
						}
				}
				payload['contractReviewResult'] = '已驳回';

				const responseObj=yield call(gruopBuyContractReview,{...payload});
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
					yield put ({
						type:'hideProcess',
					});
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							title:'失败!',
							description:`${reObj.msg}`
					}});
				}
		},
		//----------------------------------end----------------------------
	},


	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contractReview/newhousetransactionContractReview') {
					// dispatch({
					// 	type: 'getNewHouseDealTableData',
					// 	payload: {
					// 		pageSize:commonFinalCode.pageSize,
					// 		pageNo:0
					// 	}
					// });
					// dispatch({
					// 	type:'initComponent'
					// })
					setTimeout(()=>dispatch({
            type:'initComponent',
          }),0);
				}
			});
		},
	}
}
