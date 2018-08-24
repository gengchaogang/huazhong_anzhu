import {
	findAllMyDealAudit,
	getTrackDetailByGroupKeyAndDetailType,
	acceptanceDealAudit,
	rejectDealAudit,
	findAuditList,
	findGroupBuyPayOrder,
	findGroupBuyAuditInfo,
	gruopBuyContractReview,
  requestApi,
	}
	from '../../services/contractReview/newHouseTransactionContractReview'

import lodash from 'lodash';
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
	keyWords:'',

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

};
export default {
	namespace:'newHouseElectricityExamination',
	state:lodash.cloneDeep(initialState),
	reducers:{
		resetState(state){
			return {
				...state,
				...lodash.cloneDeep(initialState)
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
		updateKeyWords(state,action){
			return {...state,keyWords:action.payload}
		},
		updateTabKey(state,action){
			return {...state,activeKey:action.payload}
		},
		doInitState(state,action){
      return lodash.cloneDeep(initialState);
		},
	},

	effects:{
    /** 新房成交财务审核列表 */
		*getNewHouseDealTableData({payload},{call,put}){
				console.log('getNewHouseDealTableData----------------------');
				yield put ({
					type:'showTableLoading',
				});
        payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/findAllMyFinanceAudit";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								newHouseDealPage:reObj,
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
        console.log('initShModalData.....')
				yield put ({
					type:'showProcess',
				});
				// 初始审核信息
				yield put ({
					type:'initTrackDetailData',
				});
				const params = {groupKey:payload.groupKey,detailType:"成交审核"};
				// 得到state的信息
				const {projectDealAuditModal} = yield select(({newHouseElectricityExamination})=>newHouseElectricityExamination);
				const responseObj = yield call(getTrackDetailByGroupKeyAndDetailType,{...params});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								trackDetailData:reObj,
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
		/** 新房成交财务审核通过 */
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
				}
        payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/acceptanceFinanceAudit";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'财务审核成功，等待执行分佣。',
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
				}
        payload.apiName = "/miss-anzhu-newhouse-tx-commit/tx/audit/rejectFinanceAudit";
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
				const responseObj=yield call(findAuditList,{...payload,auditType:'financial'});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								refundAuditPage:reObj,
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
		//初始化组件状态
		*initComponent({payload},{put}){
			yield put({
				type:'doInitState'
			})
			if(!!sessionStorage.getItem('financialManagement_nh')){
				yield put({
					type:'updateTabKey',
					payload:sessionStorage.getItem('financialManagement_nh'),
				})
				yield put({type:'getActiveTabTableData'})
			}else{
				yield put({type:'getActiveTabTableData'})
			}
		},
		//搜索过滤
		*searchSortTabelData({payload},{put}){
			yield put({
				type:'updateKeyWords',
				payload,
			})
			yield put({
				type:'getActiveTabTableData',
			})
		},
		//tab切换
		*tabTableChange({payload},{put}){
			yield put({
				type:'updateTabKey',
				payload:payload
			});
			sessionStorage.setItem('financialManagement_nh',payload)
			yield put({type:'getActiveTabTableData'})
		},
		//获取激活tab表格数据
		*getActiveTabTableData({payload},{select,put}){
			const {
				activeKey,
				keyWords,
			}=yield select(({newHouseElectricityExamination})=>newHouseElectricityExamination);
			if(activeKey==='dealAudit'){
				yield put({
					type:'getNewHouseDealTableData',
					payload:{
						keyword:keyWords,
						pageNo:0,
						pageSize:10,
					}
				})
			}
			else if(activeKey==='refundAudit'){
				yield put({
					type:'getRefundAuditTableData',
					payload:{
						keyword:keyWords,
						pageNo:0,
						pageSize:10,
					}
				})
			}
		},
		*judgePropModalTodo({payload},{select,put}){
			const {projectDealAuditModal,refundAuditModal} = yield select(({newHouseElectricityExamination})=>newHouseElectricityExamination)
			if(payload==='closeModal'){
				yield put({
					type:"togglePrompt",
					payload:{
						visible:false
					}
				})
			}
			else if((payload === "closeModalAndSendFetch")
				|| (payload === 'closeModalAndSendDownPaymentFetch')
				|| (payload === 'closeModalAndSendCommissionFetch') ){
					// 完成
					// 关闭审核框
					yield put({
						type:'auditExplainModal/closeModal',
						payload:{
							visible:false
						}
					});
					// 关闭
					yield put({
						type:"togglePrompt",
						payload:{
							visible:false
						}
					});

					yield put({
						type:'setState',
						payload:{
							projectDealAuditModal:{
								...projectDealAuditModal,
								visible:false,
							}
						}
					});

					// 关闭退款审核信息框
					yield put({
						type:'setState',
						payload:{
							refundAuditModal:{
								...refundAuditModal,
								visible:false,
							}
						}
					});
					yield put({
						type:'getActiveTabTableData'
					})
				}
				else{

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
							payload['financialComment'] = payload['reason'];
						}
						if(payload['images']) {
							payload['financialPic'] = payload['images'];
						}
				}
				payload['financialAuditResult'] = '审核通过';
				payload.apiName = "/miss-anzhu-newhouse-tx-groupbuy/groupbuy/financialAudit";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'财务审核成功，等待退款。',
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
							payload['financialComment'] = payload['reason'];
						}
						if(payload['images']) {
							payload['financialPic'] = payload['images'];
						}
				}
				payload['financialAuditResult'] = '已驳回';
				payload.apiName = "/miss-anzhu-newhouse-tx-groupbuy/groupbuy/financialAudit";
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
				if (location.pathname === '/financialManagement/newHouseElectricityExamination') {
					dispatch({
						type:'initComponent'
					})
					// dispatch({
					// 	type: 'getNewHouseDealTableData',
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
