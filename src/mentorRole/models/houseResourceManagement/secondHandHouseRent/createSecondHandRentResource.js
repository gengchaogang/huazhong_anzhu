import {requestApi} from '../../../services/common.js';
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import { routerRedux } from 'dva/router';
import {message} from 'antd'


export default {
  namespace: 'createSecondHandRentResource',
  state: {
    current: 0,
    projectId:null,
    loadingShadow:false,
    promptObj:{
  		 visible:false,
  		 description:'',
  		 title:'',
  		 promptFor:'default',
  		 okText:'确定',
  		 type:'',
  		 todo:'',
  	},
  },
  reducers: {
    setCurrent(state,action){
      return{...state,current:action.payload}
    },
    saveProjectId(state,action){
      return{...state,projectId:action.payload}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    saveResultData(state,action){
			return{...state,tableLoading:false,loadingShadow: false,...action.payload}
		},
    showProcess(state,action) {
			return {...state,loadingShadow: true};
		},
		hideProcess(state,action) {
			return {...state,loadingShadow: false};
		},
    showPrompt(state,action) {
			return{...state, tableLoading:false,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
  },
  effects:{

  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/houseResourceInfosRent') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/houseImgsRent'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/ownerInfosRent'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/assignAgentRent'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }
         });
       },
  }
}
