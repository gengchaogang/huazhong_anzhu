import { routerRedux } from 'dva/router';
import {requestApi} from '../../services/common.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import lodash from 'lodash';
const defaultState = {
  promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
  },
  confirmDirty:false,
  code:null,
  id:null,
  loginName:null,
}

export default {
  namespace: 'reSetPassWrod',
  state: defaultState,
  reducers: {
    changeConfirmDirty(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
			return {...state,loadingShadow:false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    showPrompt(state,action) {
      return{...state, loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})
      }
    },
    changeConfirmDirty(state,action){
      return{...state,...action.payload}
    },
    saveCurrentUserInfos(state,action){
      return{...state,...action.payload}
    },
    saveVerificationCodeId(state,action){
      return{...state,...action.payload}
    },
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
  },
  effects:{
    *savePassWord({payload},{call,put}){
      payload.apiName='/miss-anzhu-tutor/tutors/resetPassword';
        const responseObj=yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(!!reObj&&reObj.isSuccess){
          if(reObj.result){
            yield put({type:'togglePrompt',payload:{
              type:'success',
              title:'成功!',
              description:'重置密码成功!点击跳转登陆页面!',
              visible:true,
              todo:"closeAndToLogin"
            }})
          }
        }else{
          yield put({
            type:'showPrompt',
            payload:{
              description:reObj.msg
            }
          });
        }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/retrievePwd/reSetPassWrod') {
          dispatch({
            type:"setDefaultState"
          })
          if(!!location.state){
            dispatch({
              type:"saveCurrentUserInfos",
              payload:{
                code:location.state.code,
                id:location.state.id,
                loginName:location.state.loginName,
              }
            })
          }
				}
			});
		},
	},
}
