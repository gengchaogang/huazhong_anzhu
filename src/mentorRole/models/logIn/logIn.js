import { routerRedux } from 'dva/router'
import qs from 'qs';
import {
  prepareLogin,
  realLogin,
  completeLogin,
  finishLogin,
  judgeLoginUserInfoFetch,
} from '../../services/logIn/logIn';
import {
  setCookie,
  delCookie,
  clearCookie,
  isNull,
} from '../../../commons/utils/currencyFunction'
import {
  doLogout,
} from '../../services/main';
const initState = {
  preLogin: null,
  loginFail: null,
  buttonLoading: false,
  promptObj: {
    visible: false,
    description: '',
    title: '',
    okText: '确定',
    todo: 'default',
  },
}
export default {
  namespace: 'login',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/login') {
          dispatch({
            type: 'initLogin'
          })
        }
      });
    },
  },
  effects: {
    //初始化登录
    *initLogin({ payload }, { call, put }) {
      yield put({
        type: 'initState'
      })
    },
    //执行登录
    *postLoginData({ payload }, { select, put, call }) {
      ///储存返回数据
      let loginData = null;
      //清空渲染的提示信息
      yield put({
        type: 'clearLogin',
      })
      //payload(输入的表单数据)
      //第一步  预登录
      const preLoginData = yield call(prepareLogin);
      // console.log('第一步  预登录',preLoginData);
      try {
        loginData = preLoginData.data;
      } catch (e) {
        loginData = null;
      }

      const preDataValidated = (!!loginData) && (loginData.status === 'success');
      if (preDataValidated) {
        // 第一步登录成功
        const loginState = loginData.data.loginState;
        if (loginState === 'OK') {
          //原登录信息有效，跳转到业务首页
          sessionStorage.setItem('anzhu_login', true);
          yield put(routerRedux.push('/indexPage'));
        } else if (loginState === 'PREPARED') {
          let requestData = {
            username: payload.loginName,
            password: payload.passWord,
          };
          requestData["_csrf"] = loginData.data["_csrf"];
          // requestData["sessionKey"] = loginData.data["sessionKey"];
          // //清空cookie
          // clearCookie();
          // //注入cookie
          // setCookie(loginData.data["sessionKey"],'');
          const debug = false;//是否是测试环境
          if (!!debug) {
            //测试环境
            //第二步  将输入的用户名和密码发给后端
            const realLoginData = yield call(realLogin, { ...requestData, debug: true });
            // console.log('第二步  将输入的用户名和密码发给后端',realLoginData);
            try {
              loginData = realLoginData.data;
            } catch (e) {
              loginData = null;
            }
            const realLoginDataValidated = (!!loginData) &&
              (loginData.status === 'success');
            if (realLoginDataValidated) {
              // 第二步登录成功
              // let completeRequestData = {
              //   state: loginData.data.state,
              //   code: loginData.data.code,
              // };
              //第三步  完成登录
              const completeLoginData = yield call(finishLogin, loginData.data.redirectUrl);
              // console.log('第三步，完成登录',completeLoginData);
              try {
                loginData = completeLoginData.data;
              } catch (e) {
                loginData = null;
              }
              const completeLoginDataValidated = (!!loginData) &&
                (loginData.status === 'success');
              if (completeLoginDataValidated) {
                yield put({ type: 'judgeLoginUserInfo' })
              }
            } else {
              yield put({
                type: 'setButtonLoading',
                payload: '登录失败，用户或密码错误',
              })
            }
          } else {
            //部署环境
            //第二步  将输入的用户名和密码发给后端
            const realLoginData = yield call(realLogin, requestData);
            // console.log('第二步  将输入的用户名和密码发给后端',realLoginData);
            try {
              loginData = realLoginData.data;
            } catch (e) {
              loginData = null;
            }
            const realLoginDataValidated = (!!loginData) &&
              (loginData.status === 'success');
            if (realLoginDataValidated) {
              yield put({ type: 'judgeLoginUserInfo' })
            } else {
              yield put({
                type: 'setButtonLoading',
              })
            }
          }
        } else {
          yield put({
            type: 'setButtonLoading',
          })
        }
      } else {
        yield put({
          type: 'setButtonLoading',
        })
      }
    },

    // //执行登录
    // *postLoginData({payload},{select,put,call}){
    //   ///储存返回数据
    //   let loginData=null;
    //   //清空渲染的提示信息
    //   yield put({
    //     type:'updateLoginFail',
    //     payload:null,
    //   })
    //   //payload(输入的表单数据)
    //   //第一步  预登录
    //   const preLoginData=yield call(prepareLogin);
    //   try{
    //     loginData=preLoginData.data;
    //   }catch(e){
    //     loginData=null;
    //   }
    //   const preDataValidated=(!!loginData)&&((loginData.status==='success')||(loginData.status==='error'));
    //   if(!preDataValidated){
    //     clearCookie();
    //     yield put({
    //       type:'updateLoginFail',
    //       payload:'无效的登录数据',
    //     })
    //   }else{
    //     if(loginData.status==='success'){
    //       const loginState=loginData.data.loginState;
    //       if(loginState==='OK'){
    //         //已经登录，退出登录页
    //         sessionStorage.setItem('anzhu_login',true);
    //         yield put(routerRedux.push('/indexPage'));
    //       }else if(loginState==='PREPARED'){
    //         const requestData={
    //           username:payload.loginName,
    //           password:payload.passWord,
    //         };
    //         requestData["_csrf"]=loginData.data["XSRF-TOKEN"];
    //         requestData["queryString"]=loginData.data["queryString"];
    //         requestData["jsessionid"]=loginData.data["JSESSIONID"];
    //         //第二步  将输入的用户名和密码发给后端
    //         const realLoginData=yield call(realLogin,requestData);
    //         console.log('realLoginData',realLoginData);
    //         try{
    //           loginData=realLoginData.data;
    //         }catch(e){
    //           loginData=null;
    //         }
    //         const realLoginDataValidated=(!!loginData)&&((loginData.status==='success')||(loginData.status==='error'));
    //         if(loginData.status==='success'){
    //           const realLoginState=loginData.data.loginState;
    //           if(realLoginState==='MID_OK'){
    //             const completeRequestData={
    //               state:loginData.data.state,
    //               code:loginData.data.code,
    //             };
    //             //第三步  完成登录
    //             const completeLoginData=yield call(completeLogin,completeRequestData);
    //             console.log('completeLoginData',completeLoginData);
    //             try{
    //               loginData=completeLoginData.data;
    //             }catch(e){
    //               loginData=null;
    //             }
    //             const completeLoginDataValidated=(!!loginData)&&((loginData.status==='success')||(loginData.status==='error'));
    //             if(!!completeLoginDataValidated && loginData.status==='success'){
    //               //登录成功！
    //               sessionStorage.setItem('anzhu_login',true);
    //               yield put(routerRedux.push('/indexPage'));
    //             }else{
    //               clearCookie();
    //               yield put({
    //                 type:'updateLoginFail',
    //                 payload:'登录失败，用户名密码错误',
    //               })
    //             }
    //           }else{
    //             clearCookie();
    //             yield put({
    //               type:'updateLoginFail',
    //               payload:'登录失败，用户名密码错误',
    //             })
    //           }
    //         }else{
    //           clearCookie();
    //           yield put({
    //             type:'updateLoginFail',
    //             payload:'登录失败，用户名密码错误',
    //           })
    //         }
    //       }else{
    //         clearCookie();
    //         yield put({
    //           type:'updateLoginFail',
    //           payload:'无效的登录数据',
    //         })
    //       }
    //     }else{
    //       clearCookie();
    //       yield put({
    //         type:'updateLoginFail',
    //         payload:'无效的登录数据',
    //       })
    //     }
    //   }
    // },
    //判断登陆信息
    //判断经纪人账号信息
    *judgeLoginUserInfo({ payload }, { call, put }) {
      const { data } = yield call(judgeLoginUserInfoFetch, {});
      // 待处理!!
      if (!!data && data.status === 'success') {
        if (!!data.data.brokerId) {
          sessionStorage.setItem('anzhu_login', true);
          yield put(routerRedux.push({
            pathname: '/indexPage',
            state: { isBroker: true }
          }));
        } else {
          sessionStorage.setItem('anzhu_login', true);
          yield put(routerRedux.push({
            pathname: '/indexPage',
            state: { isBroker: false }
          }));
        }
      } else {
        const response = yield call(doLogout, {});
        if (!!response && !!response.data && !!response.data.data) {
          yield put({ type: 'setButtonLoading' })
        } else {
          //退出登陆失败
        }
        //不是无导师经纪人
        // sessionStorage.setItem('anzhu_login',true);
        // yield put(routerRedux.push('/indexPage'));
      }
    },


    *setButtonLoading({ payload }, { put }) {
      yield put({
        type: 'updateLoginFail',
        payload: '登录失败，用户或密码错误',
      })
      yield put({
        type: 'changeButtonLoading',
        payload: false,
      })
    },
  },
  reducers: {
    //初始化state
    initState(state) {
      return initState;
    },
    //清空登录报错
    clearLogin(state, action) {
      return { ...state, buttonLoading: true, loginFail: null }
    },
    //初始化预登录数据
    initPrelogininitPrelogin(state, action) {
      return { ...state, preLogin: action.payload }
    },
    //登录失败
    updateLoginFail(state, action) {
      return { ...state, loginFail: action.payload, buttonLoading: false }
    },
    switchPrompt(state, action) {
      return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },
    onlyClosePrompt(state, action) {
      return { ...state, promptObj: initState.promptObj }
    },
    changeButtonLoading(state, action) {
      return { ...state, buttonLoading: action.payload }
    },
  },
}
