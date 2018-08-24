import { routerRedux } from 'dva/router'
import {message}from 'antd'
import {
  prepareLogin,
  realLogin,
  completeLogin,
  finishLogin,
} from '../services/login';
import {
  setCookie,
  delCookie,
  clearCookie,
  isNull,
  clearJurisdictionArr,
} from '../../commons/utils/currencyFunction'
import lodash from 'lodash';
const initState={
  loginData:null,
  preLogin:null,
  buttonLoading:false,
  loginFail:null,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'login',
  state: lodash.cloneDeep(initState),
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/login'){
         dispatch({
           type:'initLogin'
         })
       }
    });
   },
  },
  effects:{
    //初始化登录
    *initLogin({payload},{call,put}){
      yield put({
        type:'initState'
      })
    },
    //执行登录
    *postLoginData({payload},{select,put,call}){
      ///储存返回数据
      let loginData=null;
      //清空渲染的提示信息
      yield put({
        type:'clearLogin',
      })
      //payload(输入的表单数据)
      //第一步  预登录
      const preLoginData = yield call(prepareLogin);
      // console.log('第一步  预登录',preLoginData);
      try{
        loginData = preLoginData.data;
      }catch(e){
        loginData=null;
      }

      const preDataValidated = (!!loginData) && (loginData.status === 'success');
      if(preDataValidated) {
        // 第一步登录成功
        const loginState = loginData.data.loginState;
        if(loginState === 'OK'){
          //原登录信息有效，跳转到业务首页
          sessionStorage.setItem('anzhu_login',true);
          yield put(routerRedux.push('/indexPage'));
        }else if(loginState === 'PREPARED'){
          let requestData={
            username: payload.loginName,
            password: payload.passWord,
          };
          requestData["_csrf"] = loginData.data["_csrf"];
          // requestData["sessionKey"] = loginData.data["sessionKey"];
          // //清空cookie
          // clearCookie();
          // //注入cookie
          // setCookie(loginData.data["sessionKey"],'');
          const debug=false;//是否是测试环境
        //  const debug=true;

          if(!!debug){
            //测试环境
            //第二步  将输入的用户名和密码发给后端
            const realLoginData = yield call(realLogin,{...requestData,debug:true});
            // console.log('第二步  将输入的用户名和密码发给后端',realLoginData);
            try{
              loginData = realLoginData.data;
            }catch(e){
              loginData=null;
            }
            const  realLoginDataValidated = (!!loginData) &&
                      (loginData.status === 'success');
            if(realLoginDataValidated) {
              // 第二步登录成功
              // let completeRequestData = {
              //   state: loginData.data.state,
              //   code: loginData.data.code,
              // };
              //第三步  完成登录
              const completeLoginData = yield call(finishLogin,loginData.data.redirectUrl);
              // console.log('第三步，完成登录',completeLoginData);
              try{
                loginData = completeLoginData.data;
              }catch(e){
                loginData=null;
              }
              const  completeLoginDataValidated = (!!loginData) &&
                    (loginData.status === 'success');
              if(completeLoginDataValidated){
                sessionStorage.setItem('anzhu_login',true);
                //清空权限
                clearJurisdictionArr()
                yield put({
                  type:'changeButtonLoading',
                  payload:false,
                })
                yield put(routerRedux.push('/indexPage'));
              }
            }else{
              yield put({
                type:'setButtonLoading',
                payload:'登录失败，用户或密码错误',
              })
            }
          }else{
            //部署环境
            //第二步  将输入的用户名和密码发给后端
            const realLoginData = yield call(realLogin,requestData);
            // console.log('第二步  将输入的用户名和密码发给后端',realLoginData);
            try{
              loginData = realLoginData.data;
            }catch(e){
              loginData=null;
            }
            const  realLoginDataValidated = (!!loginData) &&
                      (loginData.status === 'success');
            if(realLoginDataValidated) {
              sessionStorage.setItem('anzhu_login',true);
              //清空权限
              clearJurisdictionArr()
              yield put({
                type:'changeButtonLoading',
                payload:false,
              })
              yield put(routerRedux.push('/indexPage'));
            }else{
              yield put({
                type:'setButtonLoading',
                payload:'登录失败，用户或密码错误',
              })
            }
          }
        }else{
          yield put({
            type:'setButtonLoading',
            payload:'登录失败，用户或密码错误',
          })
        }
      }else{
        yield put({
          type:'setButtonLoading',
          payload:'登录失败，用户或密码错误',
        })
      }
    },
    // //执行登录
    // *postLoginData({payload},{select,put,call}){
    //   ///储存返回数据
    //   let loginData=null;
    //   //清空渲染的提示信息
    //   yield put({
    //     type:'clearLogin',
    //   })
    //   //payload(输入的表单数据)
    //   //第一步  预登录
    //   const preLoginData = yield call(prepareLogin);
    //   console.log('第一步  预登录',preLoginData);
    //   try{
    //     loginData = preLoginData.data;
    //   }catch(e){
    //     loginData=null;
    //   }
    //
    //   const preDataValidated = (!!loginData) && (loginData.status === 'success');
    //   if(preDataValidated) {
    //     // 第一步登录成功
    //     const loginState = loginData.data.loginState;
    //     if(loginState === 'OK'){
    //       //原登录信息有效，跳转到业务首页
    //       sessionStorage.setItem('anzhu_login',true);
    //       yield put(routerRedux.push('/indexPage'));
    //     }else if(loginState === 'PREPARED'){
    //       let requestData={
    //         username: payload.loginName,
    //         password: payload.passWord,
    //       };
    //       requestData["_csrf"] = loginData.data["XSRF-TOKEN"];
    //       requestData["queryString"] = loginData.data["queryString"];
    //       requestData["jsessionid"] = loginData.data["JSESSIONID"];
    //
    //
    //       //第二步  将输入的用户名和密码发给后端
    //       const realLoginData = yield call(realLogin,requestData);
    //       console.log('第二步  将输入的用户名和密码发给后端',realLoginData);
    //       try{
    //         loginData = realLoginData.data;
    //       }catch(e){
    //         loginData=null;
    //       }
    //       const  realLoginDataValidated = (!!loginData) &&
    //                 (loginData.status === 'success') &&
    //                 (loginData.data.loginState === 'MID_OK');
    //       if(realLoginDataValidated) {
    //         // 第二步登录成功
    //         let completeRequestData = {
    //           state: loginData.data.state,
    //           code: loginData.data.code,
    //         };
    //
    //         //第三步  完成登录
    //         const completeLoginData = yield call(completeLogin, completeRequestData);
    //         console.log('第三步，完成登录',completeLoginData);
    //         try{
    //           loginData = completeLoginData.data;
    //         }catch(e){
    //           loginData=null;
    //         }
    //         const  completeLoginDataValidated = (!!loginData) &&
    //               (loginData.status === 'success');
    //         if(completeLoginDataValidated){
    //           sessionStorage.setItem('anzhu_login',true);
    //           yield put(routerRedux.push('/indexPage'));
    //         }
    //       }
    //     }
    //   }
    //   yield put({
    //     type:'setButtonLoading',
    //     payload:'登录失败，用户或密码错误',
    //   })
    // },

    *setButtonLoading({payload},{put}){
      yield put({
        type:'updateLoginFail',
        payload:'登录失败，用户或密码错误',
      })
      yield put({
        type:'changeButtonLoading',
        payload:false,
      })
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ login }) => login.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt'});
          break;
        case 'getOut':
          yield put({type:'onlyClosePrompt'});
          yield put(routerRedux.push('/indexPage'));
          break;
        default:
          yield put({type:'onlyClosePrompt'});
          break;
      }
    },

  },
  reducers: {
    //初始化state
    initState(state) {
      return lodash.cloneDeep(initState);
    },
    //清空登录报错
    clearLogin(state,action){
      return {...state,buttonLoading:true,loginFail:null}
    },
    //初始化预登录数据
    initPrelogininitPrelogin(state,action){
      return {...state,preLogin:action.payload}
    },
    //登录失败
    updateLoginFail(state,action){
      return {...state,loginFail:action.payload}
    },
    changeButtonLoading(state,action){
      return {...state,buttonLoading:action.payload}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:initState.promptObj}
    },
    setLoginData(state,action){
      return {...state,loginData:action.payload}
    },
  },
}
