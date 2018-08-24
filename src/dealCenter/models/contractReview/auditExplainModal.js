import {
	requestApi,
}
from '../../services/common'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';

const initState = {
		visible:false,
		title:'',
		inputTitle:'',
		message:'请输入',
		placeholder:'在此输入',
		buttonText:'',
		onSubmit:()=>{},
		showPicList:[],
		recordId:null,
		refundType:null,
		isPass:null,
		toUserName:null,
		aduitUserList:[],			// 审核人员列表
		promptObj: {
			 visible:false,
			 description:'',
			 title:'',
			 promptFor:'default',
			 okText:'确定',
			 type:'',
			 todo:'',
		},
		loadingShadow:false,
}

export default {
	namespace:'auditExplainModal',
	state:initState,
	reducers:{
		closeModal(state,action){
			return{...state,...action.payload}
		},
		changeState(state,action){
			return{...state,...action.payload}
		},
		changePicList(state,action){
			return{...state,showPicList:action.payload}
		},
		initaduitUserList(state,action){
				return{...state,aduitUserList:[]}
		},
		saveUserName(state,action){
			return{...state,...action.payload}
		},
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
		},
		initSetState(state,{payload}){
			return {
				...state,
				...initState
			};
		},
		togglePrompt(state,action){
			return {...state, loadingShadow: false, promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
		showPrompt(state,action) {
			return{...state, loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
		showProcess(state,action) {
      return {...state,loadingShadow: true};
    },
    hideProcess(state,action) {
      return {...state,loadingShadow: false};
    },
	},

	effects:{
		/** 加载财务审核人员列表 */
		*loadAuditUserList({payload},{call,put}){
				yield put ({
						type:"showProcess"
				})
				yield put ({
						type:"initaduitUserList"
				})
			  const params = {};
				if (payload) {
					params['name'] = payload['name'];
				}
				params.apiName = "/miss-anzhu-trading-center/employees/findUsersByAuthorityName";
				const responseObj = yield call(requestApi, {...params});
				var reObj = analysisUtil.analysisDataResponse(responseObj);
				if (reObj.isSuccess) {
						yield put({
							type:"changeState",
							payload:{
								aduitUserList:reObj.content,
							}
						});
						yield put ({
								type:"hideProcess"
						})
				}else {
					yield put({
						type:'showPrompt',
						payload:{
							description:`${reObj.msg}`
					}});
				}
		}
	},
}
