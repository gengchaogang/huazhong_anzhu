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
  isClear:false,
  phoneNumber:null,
  showPhone:null,
  id:null,
  verificationCodeId:null,
  extUserType:null,
}

export default {
  namespace: 'getCodeByPhone',
  state: defaultState,
  reducers: {
    togglePrompt(state,action){
			return {...state,loadingShadow:false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    showPrompt(state,action) {
      return{...state, loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})
      }
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
    closeTime(state,action){
      return {...state,...action.payload}
    },
  },
  effects:{
    //获取验证码
    *getVerificationCode({payload},{put,call,select}){
      payload.apiName='/miss-anzhu-sms/sendCode';
      const responseObj=yield call(requestApi,{...payload});
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(!!reObj&&reObj.isSuccess){
        yield put({
          type:'saveVerificationCodeId',
          payload:{
            verificationCodeId:reObj.id
          }
        })
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
    },
    //验证验证码
    *verifyCode({payload},{call,put}){
      const name=payload.loginName;
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
          pathname:"/retrievePwd/reSetPassWrod",
          state:{
            loginName:name,
            ...payload,
          },
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
    //验证登陆名(根据登录名查找当前用户手机号)
    *checkLoginName({payload},{call,put}){
      payload.apiName='/miss-security-server/users/findPortionByLoginName';
        const responseObj=yield call(requestApi,{...payload});
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(!!reObj&&reObj.isSuccess){
          let showPhone;
          if(!!reObj.phoneNumber){
            showPhone=reObj.phoneNumber.substring(7)
          }
          yield put ({
            type:"saveCurrentUserInfos",
            payload:{
              extUserType:reObj.extUserType,
              id:reObj.id,
              phoneNumber:reObj.phoneNumber,
              showPhone:showPhone,
            }
          })

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
				if (location.pathname === '/retrievePwd/getCodeByPhone') {
          dispatch({
            type:"setDefaultState"
          })
				}
			});
		},
	},
}
