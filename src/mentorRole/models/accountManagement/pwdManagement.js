import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';
import {routerRedux} from 'dva/router'

const defaultState = {
  currentActiveKey:"修改密码",
  confirmDirty:false,
  isClear:false,
  verificationCodeId:null,
  hasWithdrawPwd:false,
  promptObj:finalCode.promptObj,
  startNum:null,
  lastNum:null,
  phoneNumber:null,
}

export default {
  namespace: 'pwdManagement',
  state:defaultState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    savePhoneNumber(state,action){
      return{...state,...action.payload}
    },
    changeConfirmDirty(state,action){
      return{...state,...action.payload}
    },
    closeTime(state,action){
      return{...state,...action.payload}
    },
    changeActiveKey(state,action){
      return{...state,...action.payload}
    },
    changeState(state,action){
      return{...state,...action.payload}
    },
    changeHasWithdrawPwd(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
      return{...state, loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})
      }
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *verifyCode({payload},{call,put}){
      console.log('payload',payload);
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/tutorForgetWithdrawPwd",
        ...payload
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        yield put({
          type:"closeTime",
          payload:{
            isClear:true
          }
        })
        yield put({
          type:"togglePrompt",
          payload:{
            type:'success',
            title:'成功!',
            description:'重置密码成功，点击确定跳转到佣金分配机制页面！',
            visible:true,
            todo:"closeAndToRecord"
          }
        })
      }else{
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
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
    *findTutorInfo({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/findTutorInfo",
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        if(reObj.contactsPhone===null||reObj.contactsPhone===""){
          yield put({
            type:"togglePrompt",
            payload:{
              type:'success',
              title:'提示!',
              description:'请完善企业信息!',
              visible:true,
              todo:"toBusinessInfos"
            }
          })
        }else{
          const lastNum=reObj.contactsPhone.substring(7);
          const startNum=reObj.contactsPhone.substring(0,3);
          yield put({
            type:"savePhoneNumber",
            payload:{
              startNum:startNum,
              lastNum:lastNum,
              phoneNumber:reObj.contactsPhone,
            }
          })
        }
      }else{
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *modifyPassword({payload},{call,put}){
      const uploadData={};
      uploadData.withdrawPwd=payload.values.oldPassword;  //旧密码
      uploadData.newWithdrawPwd=payload.values.password_modify; //新密码
      uploadData.checkWithdrawPwd=payload.values.confirmPassword_modify; //确认密码
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/tutorRestWithdrawPwdByPwd",
        ...uploadData
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        if(!!reObj.errorCount){
          yield put({type:'showPrompt',payload:{description:`原密码错误，剩余修改次数：${reObj.errorCount}`}});
        }else if(reObj.errorCount!==0){
          yield put({type:'showPrompt',payload:{description:`修改密码成功!!`}});
        }
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *checkPwdExist({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/state",
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        if(reObj.hasWithdrawPwd){
          yield put({
            type:"changeHasWithdrawPwd",
            payload:{hasWithdrawPwd:reObj.hasWithdrawPwd}
          })
        }
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *addPwd({payload},{call,put}){
      const uploadData={};
      uploadData.withdrawPwd=payload.password;
      uploadData.checkWithdrawPwd=payload.confirmPassword;
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/tutorSetWithdrawPwd",
        ...uploadData
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        yield put({type:"checkPwdExist"})
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
    *getInitMoney({payload},{call,put,select}){
      const payloadEnpty={};
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/statistics/findTutorTotalCommission",
        ...payloadEnpty
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        const InitMoney={};
        InitMoney.notIssue=reObj.notIssue;
        InitMoney.totalCommission=reObj.totalCommission;
        InitMoney.totalIssue=reObj.totalIssue;
        yield put({type:"saveInitMoney",payload:{InitMoney:InitMoney}})
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/commissionRecord/pwdManagement') {
          //获取初始化信息
          dispatch({
            type:"setDefaultState",
          });
          dispatch({
            type:"checkPwdExist"
          })
          dispatch({
            type:"findTutorInfo"
          })
				}
			});
		},
	},
}
