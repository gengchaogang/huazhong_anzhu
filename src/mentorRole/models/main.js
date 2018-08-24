import { routerRedux } from 'dva/router'
import lodash from 'lodash';
import {
  testApi,
} from '../services/logIn/logIn';
import {
  pathMap,
  isNull,
} from '../../commons/utils/currencyFunction'
import {
  doLogout,
  getLoginInfo,
  getBrokerInfo,
} from '../services/main';
import {
  getMsgListFetch,
  getMyNoreadCountFetch,
} from '../services/remindMsgManagement';
const permissions=new Map();
permissions.set('creatEmployee',true);
const initState={
  permissions,
  userInfo:null,
  userInfoStatus:null,
  isBroker:null,
  menuSelectKeys:[],
  openKeys:[],
  noReadCount:0,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  remindMsg:{
    id:null,
    title:'',
    timestamp:'',
  },
}
let timer=null;
export default {
  namespace: 'main',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       dispatch({
         type:'locationChange',
         payload:location.pathname,
       })
       if(!window.dispatch){
         window.dispatch=dispatch;
       }
      // dispatch({
      //    type:'getRemindMsg',
      //  })
      if(timer===null){
        dispatch({
          type:'getRemindMsg'
        })
        timer=setInterval(() => {
          dispatch({
            type:'getRemindMsg',
          })
        },10000);
      }
    });
   },
  },
  effects:{
    //获取站内信
    *getRemindMsg({payload},{call,put,select}){
      const {noReadCount}=yield select(({main})=>main);
      if(!!sessionStorage.getItem('anzhu_login')){
        const {data}=yield call(getMyNoreadCountFetch);
        // const {data}=yield call(getMsgListFetch);
        if(!!data){
          if(data.status==='success'){
            const noReadCountNo=data.data.noReadCount;
            yield put({
              type:'updateNoReadCount',
              payload:isNull(noReadCountNo,0),
            })
            yield put({type:'getNewMsg'})

            // if(noReadCountNo===0 || noReadCountNo===noReadCount){
            //   //无未读消息
            // }else{
            //   //有未读消息
            //   // yield put({
            //   //   type:'updateNoReadCount',
            //   //   payload:isNull(noReadCount,0),
            //   // })
            //   // yield put({type:'getNewMsg'})
            // }

          }else{
            // yield put({
            //   type:'updateNewMsg',
            //   payload:{
            //     id:null,
            //     title:data.message,
            //     timestamp:'',
            //   }
            // })
          }
        }else{
          // yield put({
          //   type:'updateNewMsg',
          //   payload:{
          //     id:null,
          //     title:'获取播报信息失败',
          //     timestamp:'',
          //   }
          // })
        }
      }else{
        clearTimeout(timer);
        timer=null;
      }
    },

    //获取最新的一条站内信
    *getNewMsg({payload},{call,put,select}){
      const {id}=yield select(({main})=>main.remindMsg);
      const {data}=yield call(getMsgListFetch,{pageNo:0,pageSize:1});
      if(!!data){
        if(data.status==='success'){
          if(data.data.content.length===0){
            //无消息
          }else{
            const msgObj=data.data.content[0];
            if(id===msgObj.id){
              //无新消息
            }else{
              //新消息
              yield put({
                type:'updateNewMsg',
                payload:{
                  id:isNull(msgObj.id,'-'),
                  title:isNull(msgObj.message,''),
                  timestamp:isNull(msgObj.createDateTime,''),
                }
              })
            }
          }
        }else{
          if(id!==null){
            yield put({
              type:'updateNewMsg',
              payload:{
                id:null,
                title:data.message,
                timestamp:'',
              }
            })
          }
        }
      }else{
        if(id!==null){
          yield put({
            type:'updateNewMsg',
            payload:{
              id:null,
              title:'获取播报信息失败',
              timestamp:'',
            }
          })
        }
      }
    },
    *initMain({payload},{call,select,put}){
      //请求用户信息
      const [{data},brokerData]=yield [call(getLoginInfo),call(getBrokerInfo)];
      // const {data}=yield call(getLoginInfo);
      // const {brokerData}=yield call(getBrokerInfo)
      if(!!data && data.status==='success'){
        const userInfo={
          toturId:isNull(data.data.id,''),
          code:isNull(data.data.code,''),
          name:isNull(data.data.name,''),
          auditStatus:isNull(data.data.auditStatus,''),
          contacts:isNull(data.data.contacts,''),
          contactsPhone:isNull(data.data.contactsPhone,''),
          logo:isNull(data.data.logo,''),
          brokerId:isNull(data.data.brokerId,''),
          userType:isNull(data.data.userType,''),
        }
        const userInfoStatus=userInfo.auditStatus;
        yield put({
          type:"saveUserInfoStatus",
          payload:{
            userInfoStatus:userInfoStatus
          }
        })

        if(data.data.auditStatus==='待审核'){
          yield put({
            type:"switchPrompt",
            payload:{
              title:"提示!",
              description:"当前合伙人未审核,请审核成功之后登录!",
              visible:true,
              todo:"doLogout"
            }
          })
        }else{
          if(data.data.userType==='BROKER_USER'&&!!data.data.brokerId){ //經紀人渲染頁面
            yield put({
              type:"saveUserType",
              payload:{
                isBroker:true
              }
            })
            if(!!brokerData.data&&brokerData.data.status==='success'){
              userInfo.name=brokerData.data.data.name;
              yield put({
                type:'initUserInfo',
                payload:JSON.stringify(userInfo),
              })
            }
            yield put({
              type:'indexPageX/chooseFetchSendByUser',
              payload:{
                isBroker:true,
                pathname:payload
              }
            })
          }else if(data.data.userType==='BROKER_USER_MANAGE'&&!!data.data.brokerId){

              yield put({
                type:"saveUserType",
                payload:{
                  isBroker:true
                }
              })
              if(!!brokerData.data&&brokerData.data.status==='success'){
                userInfo.name=brokerData.data.data.name;
                yield put({
                  type:'initUserInfo',
                  payload:JSON.stringify(userInfo),
                })
              }
              yield put({
                type:'indexPageX/chooseFetchSendByUser',
                payload:{
                  isBroker:true,
                  pathname:payload
                }
              })
          }

else
          {  //導師渲染頁面
            yield put({
              type:"saveUserType",
              payload:{
                isBroker:false,
              }
            })
            yield put({
              type:'initUserInfo',
              payload:JSON.stringify(userInfo),
            })
            yield put({
              type:'indexPageX/chooseFetchSendByUser',
              payload:{
                isBroker:false,
                pathname:payload
              }
            })
          }
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请刷新页面',
            title:'获取登录信息失败！',
            todo:'default',
            okText:'确定',
          },
        });

      }
    },
    *locationChange({payload},{select,put}){
      const {userInfo}=yield select(({main})=>main);
      if(!!sessionStorage.getItem('anzhu_login') && userInfo===null && payload!=='/login' && payload.indexOf('mentorRegister')===-1){
        yield put({type:'initMain',payload:payload})
      }
      const pathArr=payload.split('/');
      if(pathArr.length>=4){
        const selectedKeys=[`/${pathArr[1]}/${pathArr[2]}`];
        yield put({
          type:'updateMenuSelectOpenKeys',
          payload:{
            menuSelectKeys:selectedKeys,
            openKeys:[`/${pathArr[1]}`],
          },
        })
      }else{
        yield put({
          type:'updateMenuSelectOpenKeys',
          payload:{
            menuSelectKeys:[payload],
            openKeys:[`/${pathArr[1]}`],
          },
        })
      }
    },
    //左侧菜单选择
    *menuSelect({payload},{put}){
      // yield put({  //解决栈溢出的问题
      //   type:'updateMenuSelectOpenKeys',
      //   payload:{
      //     menuSelectKeys:payload,
      //     openKeys:[],
      //   },
      // })
      yield put(routerRedux.push(payload[0]));
    },
    //左侧菜单展开
    *menuOpen({payload},{put}){
      yield put({
        type:'changeOpenKeys',
        payload:[payload[payload.length-1]],
      })
      // yield put(routerRedux.push(payload[payload.length-1]));
    },
    //登出
    *logout({payload},{call,put}){
      const {data}=yield call(doLogout);
      if(!!data){
        sessionStorage.removeItem('anzhu_login');
        yield put({
          type:'clearUserInfo',
        });
         yield put({
           type:"setDefaultState"
         })
        yield put(routerRedux.push('/login'));
      }else{
        // yield put({
        //   type: 'switchPrompt',
        //   payload:{
        //     visible:true,
        //     description:data.message,
        //     title:'注销登录失败',
        //     todo:'default',
        //     okText:'确定',
        //   },
        // });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ main }) => main.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt'});
          break;
        case 'getOut':
          yield put({type:'onlyClosePrompt'});
          yield put(routerRedux.push('/'));
          break;
        case 'doLogout':
          yield put({type:'logout'});
          break;
        case 'toBusinessInfos':
          yield put({type:'onlyClosePrompt'});
          yield put(routerRedux.push('/businessManagement/businessInfos'));
          break;
        default:
          yield put({type:'onlyClosePrompt'});
          break;
      }
    },

  },
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:initState.promptObj}
    },
    //更新菜单选中展开数组
    updateMenuSelectOpenKeys(state,action){
      return {...state,...action.payload}
    },
    saveUserType(state,action){
      return {...state,...action.payload}
    },
    saveUserInfoStatus(state,action){
      return {...state,...action.payload}
    },
    //清除用户信息
    clearUserInfo(state,action){
      return {...state,userInfo:null}
    },
    //初始化用户信息
    initUserInfo(state,action){
      return {...state,userInfo:action.payload}
    },
    //更新菜单展开数组
    changeOpenKeys(state,action){
      return {...state,openKeys:action.payload}
    },
    //更新站内信
    updateNewMsg(state,action){
      return {...state,remindMsg:action.payload}
    },
    //更新未读消息数量
    updateNoReadCount(state,action){
      return {...state,noReadCount:action.payload}
    },
  },
}
