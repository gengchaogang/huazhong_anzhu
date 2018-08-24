import {
	requestApi,
} from '../../services/common'
// import {
// 	judgeJurisdiction,
// } from '../../../commons/utils/currencyFunction'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {message} from 'antd';

/*****************************************************/
/*****************************************************/
/**********  新房项目：发布、下架审核 ******************/
/*****************************************************/
/*****************************************************/
const initState={
	//Index页面
	activeKey:'publish',
	tableLoading:false,
	loadingShadow:false,
	resultTableData:[],
	// 新房发布审核Page
	projectPublishDealPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	// 项目发布审核弹出框
	projectPublishAuditModal:{
		visible:false,
		currentRecord:{},
	},

	// 新房下架审核
	projectDownDealPage: {
		pageNo:1,
		total:0,
		pageSize:commonFinalCode.pageSize,
		content:[],
	},
	//项目发布审核弹出框
	projectDownSelvesAuditModal:{
		visible:false,
		currentRecord:{},
	},
	projectSqObjInfo:{},		// 项目申请信息
	projectShObjInfo:{},		// 项目审核信息
	auditExplainModal:{			//审核最后一步填写审核/驳回原因__弹出框专用
		auditType:'',					//一组件多用,判断当前属于哪个(项目发布,项目下架)审核.
		visible:false,
		title:'Title1',
		inputTitle:'Title2',
		projectId:'',
		//上传图片用
		uploadText:'',
		fileList:[],
		previewVisible:false,
		previewImage:'',
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
 pagination:{
   current:1,
   total:0,
   pageSize:10,
 },
 keyword:'',

}
export default {
	namespace:'newHouseContractReview',
	state:initState,
	reducers:{
		changeProjectDownSelvesAuditModal(state,action){
			return {...state,projectDownSelvesAuditModal:Object.assign({},state.projectDownSelvesAuditModal,{...action.payload})}
		},
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
		},
		saveResultData(state,action){
			return{...state,tableLoading: false,...action.payload}
		},
		togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
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
		updateTableTab(state,action){
			return {...state,activeKey:action.payload,pagination:initState.pagination}
		},
		updateKeywords(state,action){
			return {...state,keyword:action.payload,pagination:initState.pagination}
		},
		updatePage(state,action){
			return {...state,pagination:{...state.pagination,...action.payload}}
		},
		doInitState(state,action){
			return initState
		},
		closeProjectPublishAuditModal(state,action){
			return {...state,projectPublishAuditModal:{...state.projectPublishAuditModal,visible:false}}
		},
		closeProjectDownSelvesAuditModal(state,action){
			return {...state,projectDownSelvesAuditModal:{...state.projectDownSelvesAuditModal,visible:false}}
		},

	},

	effects:{
		//初始化组件状态
		*initComponent({payload},{put}){
			yield put({type:'doInitState'});
			//权限判断
			if(!!sessionStorage.getItem('contractReview_nh_project')){
				yield put({
					type:'updateTableTab',
					payload:sessionStorage.getItem('contractReview_nh_project'),
				})
				yield put({type:'getActiveTabTableData'})
			}else{
				yield put({type:'getActiveTabTableData'})
			}
		},
		//获取激活tab表格数据
		*getActiveTabTableData({payload},{select,put}){
			const {
				activeKey,
				keyword,
			  pagination:{
			    current,
			    total,
			    pageSize,
			  },
			}=yield select(({newHouseContractReview})=>newHouseContractReview);
			if(activeKey==='publish'){
				yield put({
					type:'getInitPublishTableData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
				})
			}
			else if(activeKey==='downShelves'){
				yield put({
					type:'getInitDownShelvesTableData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
				})
			}
		},
		//tab变化
		*changeTableTab({payload},{put}){
			sessionStorage.setItem('contractReview_nh_project',payload);
			yield put({
				type:'updateTableTab',
				payload,
			});
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
		//分页
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




		/** 查询项目审核列表 */
		*getInitPublishTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				payload.apiName = "/miss-anzhu-newhouse-project/projects/publish/projectsSellList";
				const responseObj=yield call(requestApi,{...payload});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				console.log('reObj',reObj);
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								projectPublishDealPage:reObj,
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
		//审核完成关闭所有模态框
		*closeAllModal({payload},{select,put}){
			// 完成
			yield put({
				type:"togglePrompt",
				payload:{
					visible:false
				}
			})

			// 关闭审核框
			yield put({
				type:'auditExplainModal/closeModal',
				payload:{
					visible:false
				}
			});
			// 关闭上线审核框
			yield put({
				type:'closeProjectPublishAuditModal',
			});

			// 关闭下架审核框
			yield put({
				type:'closeProjectDownSelvesAuditModal',
			});
			yield put({
				type:'getActiveTabTableData'
			})

		},
		*initPublish({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				yield put({
					type:"saveResultData",
					payload:{
						projectSqObjInfo:{},
					}
				});
				yield put({
					type:"saveResultData",
					payload:{
						projectShObjInfo:{},
					}
				});

				// 查询申请说明信息
				const sqParams = {};
				// sqParams.id = payload['id'];
				sqParams.historyId = payload.record['historyId'];
				console.log('payload',payload);
				sqParams.status = payload.isDown?'下架':'上架';
				sqParams.apiName = "/miss-anzhu-newhouse-project/projects/publish/projectsByOne";
				const sqResponseObj = yield call(requestApi, {...sqParams});
				var reObj = analysisUtil.analysisDataResponse(sqResponseObj);
				console.log("申请信息：", reObj)
				if(reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								projectSqObjInfo:reObj,
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

				// // 查询审核信息说明
				// const shPahrams = {};
				// shPahrams.id = payload.record['id'];
				// shPahrams.apiName = "/miss-anzhu-newhouse-project/projects/publish/projectsAuditOne";
				// const shResponseObj = yield call(requestApi, {...shPahrams});
				// var reObj = analysisUtil.analysisDataResponse(shResponseObj);
				// console.log("审核信息：", reObj)
				// if(reObj.isSuccess) {
				// 		yield put({
				// 			type:"saveResultData",
				// 			payload:{
				// 				projectShObjInfo:reObj,
				// 			}
				// 		});
				// 		yield put ({
				// 			type:'hideProcess',
				// 		});
				// }else {
				// 	yield put({
				// 		type:'showPrompt',
				// 		payload:{
				// 			description:`${reObj.msg}`
				// 	}});
				// }
		},

		*publishPass({payload},{call,put}){
				console.log('payload  == ' , payload)
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['description'] = payload['reason'];
						}
						if(payload['images']) {
							payload['accessCode'] = payload['images'];
						}
				}
				if(!payload.oprationPwd){
					payload.oprationPwd = 'null'
				}
				payload.apiName = "/miss-anzhu-newhouse-project/projects/publish/audit";
				const responseObj = yield call(requestApi, {...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'审核成功',
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

		/** -----------------------下架列表 start ------------------------------ */
		*getInitDownShelvesTableData({payload},{call,put}){
				yield put ({
					type:'showTableLoading',
				});
				payload.apiName = "/miss-anzhu-newhouse-project/projects/publish/projectsShelfList";
				const responseObj = yield call(requestApi, {...payload});
				var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
				console.log('reObj-- ', reObj)
				if (reObj.isSuccess) {
						yield put({
							type:"saveResultData",
							payload:{
								projectDownDealPage:reObj,
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
		/** 下架审核通过 */
		*downShelvesPass({payload},{call,put}){
				yield put ({
					type:'showProcess',
				});
				if (payload != null) {
						if(payload['reason']) {
							payload['description'] = payload['reason'];
						}
						if(payload['images']) {
							payload['accessCode'] = payload['images'];
						}
				}
				console.log('payload',payload);
				payload.apiName = "/miss-anzhu-newhouse-project/projects/offTheShelves/audit";
				const responseObj = yield call(requestApi, {...payload});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if(reObj.isSuccess) {
					yield put({
						type:'togglePrompt',
						payload:{
							type:'success',
							title:'成功!',
							description:'审核成功',
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

		//---------------------------------effects end--------------------------
	},

	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contractReview/newHouseContractReview') {
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
