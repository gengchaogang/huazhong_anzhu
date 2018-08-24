import { routerRedux } from 'dva/router';
import {requestApi} from '../../services/common.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import lodash from 'lodash';
const defaultState = {
  passwordDirty:null,
  verificationCodeId:null,
  loadingShadow:false,
  loginNameExist:false,
  isClear:false,
  promptObj:finalCode.promptObj,
}

export default {
  namespace: 'writePhone',
  state: null,
  reducers: {
    changePasswordDirty(state,action){
      return{...state,...action.payload}
    },
    changeLoginNameExist(state,action){
      return{...state,...action.payload}
    },
    changeState(state,action){
      return{...state,...action.payload}
    },
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    closeTime(state,action){
      return{...state,...action.payload}
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
			return{...state, loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})
      }
		},
    togglePrompt(state,action){
			return {...state,loadingShadow: false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
  },
  effects:{
    //获取验证码
    *getVerificationCode({payload},{put,call}){
      const phoneNumber = payload.phoneNumber;
      const {data}=yield call(requestApi,{
        apiName:"/miss-anzhu-sms/sendCode",
        phone:phoneNumber,
      });
      if(!!data&&data.status==='success'){
        yield put({
          type:"changeState",
          payload:{
            verificationCodeId:data.data.id
          }
        })
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:data.message
          }
        });
      }
    },
    //验证手机号码重复
    *checkLoginName({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/checkLoginName",
        ...payload,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.result&&reObj.isSuccess) {
        yield put({
          type:"changeLoginNameExist",
          payload:{
            loginNameExist:true
          }
        })
        payload.callBack(reObj.result,payload.form);
      }else if(reObj.isSuccess===false&&reObj.msg==='登陆名字不能为空'){
        yield put({
          type:"phoneExist",
          payload:{
            isPhoneExist:false
          }
        })
      }else if(reObj.data===false&&reObj.isSuccess){
        payload.callBack(reObj.data,payload.form);
      }else{
        yield put({
          type:"phoneExist",
          payload:{
            isPhoneExist:false
          }
        })
      }
    },



    //验证验证码
    *verifyCode({payload},{put,call}){
      const {id,code} = payload;
      const apiPara = {id,code}
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-sms/verifyCode",
        ...apiPara,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.result) {
        yield put({
          type:"closeTime",
          payload:{
            isClear:true
          }
        })
        yield put(routerRedux.push({
          pathname:"/mentorRegister/perfectInformation",
          state:payload,
        }));
      }else {
        yield put({
          type:'showPrompt',
          payload:{
            description:"验证码错误,请输入正确的验证码!"
          }
        });
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/mentorRegister/writePhone') {
          dispatch({
            type:"setDefaultState"
          })
				}
			});
		},
	},
}
