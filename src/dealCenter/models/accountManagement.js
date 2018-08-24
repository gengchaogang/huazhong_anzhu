import { routerRedux } from 'dva/router'
import {
  accountLoginFetch,
  accountOptFetch,
  sendVerificationCodeFetch,
  verificationLoginPsdFetch,
  verifyVerificationCodeFetch,
  changeUserPhoneFetch,
} from '../services/accountManagement';
import {
  getLoginInfo,
} from '../services/main';
import {
  isNull,
} from '../../commons/utils/currencyFunction'
const initState={
  type:null,
  accountModal:{
    title:'',
    visible:false,
    confirmLoading:false,
  },
  needOptPwd:false,
  stepBtnLoading:false,
  isTradingCenter:false,
  reGetCode:false,
  codeRight:false,
  changePhone:null,
  userPhone:'',
  codeId:null,
  changePhoneCode:'',
  changePhoneDoBtnValue:false,
  changePhoneDoBtnLoading:false,
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
};
export default {
  namespace:'accountManagement',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/accountManagement'){
         dispatch({type:'initComponent'})
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{takeLatest,put,select}){
      yield put({
        type:'doInitState'
      });
      // const {
      //   userInfo,
      // }=yield select(({main})=>main);
      // function *checkUserInfoFun(){
      //   const {
      //     userInfo,
      //   }=yield select(({main})=>main);
      //   yield put({
      //     type:'checkUserInfo',
      //     payload:userInfo,
      //   })
      // }
      // if(!!userInfo){
      //   yield put({
      //     type:'checkUserInfo',
      //     payload:userInfo,
      //   })
      // }else{
      //   yield takeLatest('main/initUserInfo',checkUserInfoFun)
      // }
      //changed by duxianqiu 17\05\12 改为获取最新的用户信息
      yield put({
        type:'getLatestUserInfo'
      })
    },
    //获取最新的用户信息
    *getLatestUserInfo({payload},{put,call}){
      const {data}=yield call(getLoginInfo);
      if(!!data && data.status==='success' && !!data.data){
        yield put({
          type:'updateNeedOpt',
          payload:{
            needOptPwd:isNull(data.data.needOptPwd,false),
            isTradingCenter:isNull(data.data.isTradingCenter,false),
            userPhone:isNull(data.data.phoneNumber,''),
          }
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请重新进入'),
            title:'获取用户信息失败！',
            todo:'doLogOut',
          },
        });
      }
    },
    //获取到用户信息
    *checkUserInfo({payload},{put}){
      const {
        needOptPwd,
        isTradingCenter,
        phoneNumber,
      }=JSON.parse(payload);
      yield put({
        type:'updateNeedOpt',
        payload:{
          needOptPwd,
          isTradingCenter,
          userPhone:phoneNumber,
        },
      })
    },
    //打开修改密码模态框
    *openAccountModal({payload},{put}){
      yield put({
        type:'setType',
        payload,
      })
      if(payload==='login'){
        yield put({
          type:'doOpenAccountModal',
          payload:{
            visible:true,
            title:'修改登录密码',
          }
        })
      }else if(payload==='operation'){
        yield put({
          type:'doOpenAccountModal',
          payload:{
            visible:true,
            title:'修改审核密码',
          }
        })
      }
    },
    //执行更改密码操作
    *doAccountPsw({payload},{call,put,select}){
      const {type}=yield select(({accountManagement})=>accountManagement);
      if(type==='login'){
        yield put({
          type:'doAccLoginPsw',
          payload,
        })
      }else if(type==='operation'){
        yield put({
          type:'doAccOptPsw',
          payload,
        })
      }
    },
    //点击修改手机号
    *readyChangePhone({payload},{put}){
      yield put({
        type:'updateChangePhoneStatus',
        payload:{
          changePhone:'step1',
          stepBtnLoading:false,
        },
      })
    },
    //验证登录密码
    *verificationLoginPsd({payload},{call,put}){
      const {data} = yield call(verificationLoginPsdFetch,{password:payload});
      if(!!data && !!data.data){
        yield put({
          type:'changeNextStepBtnLoading',
          payload:true,
        })
        yield put({
          type:'updateChangePhoneStatus',
          payload:{
            changePhone:'step2',
            codeRight:false,
          },
        })
      }else{
        yield put({
          type:'changeNextStepBtnLoading',
          payload:false,
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败'),
            title:'验证登录密码失败！',
            todo:'checkLoginPsdFail',
          },
        })
      }
    },
    //获取 验证码
    *doGetCode({payload},{call,put}){
      const {data} = yield call(sendVerificationCodeFetch,{phone:payload});
      if(!!data && data.status === 'success' && !!data.data.id){
        yield put({
          type:'keepCodeId',
          payload:data.data.id,
        })
      }else{
        yield put({
          type:'changeReGetCode',
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败'),
            title:'验证登录密码失败！',
            todo:'default',
          },
        })
      }
    },
    //验证 验证码
    *doVerifyCode({payload},{call,put,select}){
      console.log('payload',payload);
      const {codeId} = yield select(({accountManagement})=>accountManagement);
      const {data} = yield call(verifyVerificationCodeFetch,{
        id:codeId,
        code:payload.code,
      })
      if(!!data && data.status === 'success'){
        if(isNull(data.data.result,false)){
          yield put({
            type:'changeCodeRight',
            payload:true,
          })
        }else{
          yield put({
            type:'changeCodeRight',
            payload:false,
          })
          yield put({
            type:'changeReGetCode',
          })
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'验证码错误',
              title:'验证手机验证码失败！',
              todo:'checkCodeFail',
            },
          })
        }
      }else{
        yield put({
          type:'changeCodeRight',
          payload:false,
        })
        yield put({
          type:'changeReGetCode',
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败'),
            title:'验证手机验证码失败！',
            todo:'checkCodeFail',
          },
        })
      }
    },
    //执行更改 手机号
    *lastDoChangePhone({payload},{select,put,call}){
      yield put({
        type:'doChangePhoneButtonLoading',
        payload:true,
      })
      const {codeId} = yield select(({accountManagement})=>accountManagement);
      console.log('codeId',codeId);
      const {data} = yield call(changeUserPhoneFetch,{
        code:payload.code,
        codeId,
        phoneNumber:payload.newPhone,
      })
      if(!!data && data.status === 'success'){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请重新登录',
            title:'更改手机号码成功！',
            todo:'doLogOut',
          },
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败'),
            title:'更改手机号码失败！',
            todo:'changePhoneFail',
          },
        })
      }
    },
    //执行更改登录密码
    *doAccLoginPsw({payload},{call,put}){
      const {data}=yield call(accountLoginFetch,{
        confirmPassword:payload.confirmPsw,
        oldPassword:payload.oldPsw,
        password:payload.newPsw,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'点击退出',
              title:'修改登录密码成功！',
              todo:'doLogOut',
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'修改登录密码失败！',
              todo:'changePsdFail',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败',
            title:'修改登录密码失败！',
            todo:'changePsdFail',
          },
        });
      }
    },
    //执行更改审核密码
    *doAccOptPsw({payload},{call,put}){
      const {data}=yield call(accountOptFetch,{
        confirmPassword:payload.confirmPsw,
        oldPassword:payload.oldPsw,
        password:payload.newPsw,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'点击退出',
              title:'修改审核密码成功！',
              todo:'goOut',
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'修改审核密码失败！',
              todo:'changePsdFail',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败',
            title:'修改审核密码失败！',
            todo:'changePsdFail',
          },
        });
      }
    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({accountManagement})=>accountManagement.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'goOut':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put(routerRedux.goBack());
          break;
        case 'doLogOut':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'main/logout'
          });
          break;
        case 'changePsdFail':
          yield put({type:'onlyClosePrompt'});
          yield put({
            type:'changePsdModalButtonLoading',
            payload:false,
          });
          break;
        case 'checkLoginPsdFail':
          yield put({type:'onlyClosePrompt'});
          yield put({
            type:'changePhoneButtonLoading',
            payload:false,
          });
          break;
        case 'changePhoneFail':
          yield put({type:'onlyClosePrompt'});
          yield put({
            type:'changePhoneFail',
          });
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
  },
  reducers:{
    doInitState(state,action){
      return initState;
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //更改type
    setType(state,action){
      return {...state,type:action.payload,changePhone:null,stepBtnLoading:false}
    },
    //打开更改密码模态框
    doOpenAccountModal(state,action){
      return {...state,accountModal:action.payload}
    },
    //关闭更改密码模态框
    closeAccountPsw(state,action){
      return {...state,accountModal:initState.accountModal}
    },
    //改变模态框loading
    changePsdModalButtonLoading(state,action){
      return {...state,accountModal:{...state.accountModal,confirmLoading:action.payload}}
    },
    //更新是否用操作密码
    updateNeedOpt(state,action){
      return {...state,...action.payload}
    },
    //变更手机号 输入操作密码
    changePhoneChangeLoginPsd(state,action){
      return {...state,changePhoneInputValue:action.payload}
    },
    //变更手机号 输入新的手机号
    changePhoneChangeCode(state,action){
      return {...state,changePhoneCode:action.payload}
    },
    //变更手机号 切换状态
    updateChangePhoneStatus(state,action){
      return {...state,...action.payload}
    },
    //变更手机号 下一步 loading
    changeNextStepBtnLoading(state,action){
      return {...state,stepBtnLoading:action.payload}
    },
    //重新获取
    changeReGetCode(state,action){
      return {...state,reGetCode:!state.reGetCode,codeId:null}
    },
    //保存验证码id
    keepCodeId(state,action){
      return {...state,codeId:action.payload}
    },
    //更换手机号 button loading
    checkLoginPsdFail(state,action){
      return {...state,stepBtnLoading:action.payload}
    },
    //更换手机号 button loading
    doChangePhoneButtonLoading(state,action){
      return {...state,changePhoneDoBtnLoading:action.payload}
    },
    //code 是否正确
    changeCodeRight(state,action){
      return {...state,codeRight:action.payload}
    },
    changePhoneFail(state,action){
      return {...state,codeRight:false,changePhoneDoBtnLoading:false,codeId:null,reGetCode:!state.reGetCode,}
    },
    returnToStep1(state,action){
      return {
        ...state,
        changePhone:'step1',
        stepBtnLoading:false,
        codeId:null,
        changePhoneDoBtnLoading:false,
      }
    },
  },
}
