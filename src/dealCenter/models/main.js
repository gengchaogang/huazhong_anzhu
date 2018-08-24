import { routerRedux } from 'dva/router'
import {
  testApi,
} from '../services/login';
import {
  accountLoginFetch,
} from '../services/accountManagement';
import {
  pathMap,
  isNull,
  delCookie,
  creatZoningData,
  setCenterProjectInfo,
  setJurisdictionArr,
  judgeJurisdiction,
  setUserHasOptPwd,
} from '../../commons/utils/currencyFunction'
import {
  doLogout,
  getLoginInfo,
  findMyRemindMsgFetch,
  getMyNoreadCountFetch,
} from '../services/main';
import {
  findAllProvinceAndCityFetch,
}from '../services/userFetch'

import lodash from 'lodash';

const initState={
  menuKeys:[{
    title:'首页',
    icon:'menu_icon_sy',
    key:'/indexPage',
  }],
  userInfo:null,
  noReadCount:0,
  menuSelectKeys:[],
  openKeys:[],
  loginPsdModal:{
    visible:false,
    confirmLoading:false,
  },
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
  state: lodash.cloneDeep(initState),
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname !== '/login'){
        //  dispatch({
        //    type:'locationChange',
        //    payload:location.pathname,
        //  })
        // if(location.pathname === '/indexPage'){
        //   dispatch({
        //     type:'initComponent'
        //   })
        // }
         setTimeout(()=>dispatch({
           type:'locationChange',
           payload:location.pathname,
         }),0);
         if(!window.dispatch){
           window.dispatch=dispatch;
         }
        // dispatch({
        //   type:'getRemindMsg',
        // })
        // if(/indexPage || information){
        //   clearTimeout(timer);
        //   timer=null;
        // }
        if(timer===null){
          dispatch({
            type:'getRemindMsg',
          })
          timer=setInterval(() => {
            dispatch({
              type:'getRemindMsg',
            })
          },5000);
        }
      }else{
        dispatch({
          type:'initComponent'
        })
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
        // const {data}=yield call(findMyRemindMsgFetch);
        if(!!data){
          if(data.status==='success'){
            const noReadCountNo=data.data.noReadCount;
            // if(noReadCountNo===0 || noReadCountNo===noReadCount){
            //   //没有新的未读消息
            // }else{
            //   //有未读消息
            //   yield put({
            //     type:'updateNoReadCount',
            //     payload:isNull(noReadCountNo,0),
            //   })
            //   yield put({type:'getNewMsg'})
            // }
            yield put({
              type:'updateNoReadCount',
              payload:isNull(noReadCountNo,0),
            })
            yield put({type:'getNewMsg'})
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
      const {data}=yield call(findMyRemindMsgFetch);
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
    //初始化main
    *initMain({payload},{call,select,put}){
      //请求用户信息
      const {data}=yield call(getLoginInfo);
      if(!!data){
        if(data.status==='success' && !!data.data && !!data.data.code){
          const oldPathArr=isNull(data.data.businessPath,'').split('/');
          const newPathArr=[];
          let fullPath='';
          oldPathArr.map((item,index)=>{
            if(index!==0){
              newPathArr.push(item);
            }
          });
          if(sessionStorage.getItem('tradeCenter')!==data.data.code){
            //往sessionStorage中注入交易中心数据
            setCenterProjectInfo(data.data.code);
          }
          const lastLoginTime=isNull(data.data.lastLoginTime,'');
          //判断是否是交易中心【管理员】账号
          const isTradingCenter=false;
          const jurisdictionCodes=isNull(data.data.codes,[]).map(item=>item.code);
          if(isTradingCenter){
            setJurisdictionArr(true)
          }else{
            setJurisdictionArr(jurisdictionCodes);
          }
          const userInfo={
            name:isNull(data.data.name,''),
            centerName:isNull(data.data.tradingCenterName,''),
            userId:isNull(data.data.userId,''),
            position:isNull(data.data.position,''),
            loginName:isNull(data.data.loginName,''),
            lastLoginTime,
            phoneNumber:isNull(data.data.phoneNumber,''),
            isTradingCenter:isNull(data.data.isTradingCenter,false),
            lastLoginIp:isNull(data.data.lastLoginIp,''),
            deptName:isNull(data.data.deptName,''),
            fullPath:newPathArr.join('-'),
            needOptPwd:isNull(data.data.needOptPwd,false),
          }
          setUserHasOptPwd(userInfo.needOptPwd)
          const newMenuKeys=creatMenuKeys()
          yield put({
            type:'updateMenuKeys',
            payload:newMenuKeys,
          })
          yield put({
            type:'initUserInfo',
            payload:JSON.stringify(userInfo),
          });
          if(lastLoginTime.length===0){
            yield put({
              type:'openChangeLoginPsd',
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取登录信息失败！',
              todo:'default',
              okText:'确定',
            },
          });
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
    //打开首次登录修改登录密码模态框
    *openChangeLoginPsd({payload},{put}){
      yield put({
        type:'toggleLoginPsdModal',
        payload:true,
      })
    },
    //路由地址变化
    *locationChange({payload},{select,put}){
      const {userInfo,menuSelectKeys}=yield select(({main})=>main);
      if(!!sessionStorage.getItem('anzhu_login') && userInfo===null && payload!=='/login'){
        yield put({type:'initMain'});
        if(!sessionStorage.getItem('all_province_city')){
          yield put({type:'getAllProvinceAndCityData'});
        }
      }
      const pathArr=payload.split('/');
      if(pathArr.length>=4){
        const selectedKeys=[`/${pathArr[1]}/${pathArr[2]}`];
        if(menuSelectKeys[0]!==selectedKeys[0]){
          yield put({
            type:'updateMenuSelectOpenKeys',
            payload:{
              menuSelectKeys:selectedKeys,
              openKeys:[`/${pathArr[1]}`],
            },
          })
        }
      }else{
        if(menuSelectKeys[0]!==payload){
          yield put({
            type:'updateMenuSelectOpenKeys',
            payload:{
              menuSelectKeys:[payload],
              openKeys:[`/${pathArr[1]}`],
            },
          })
        }
      }
    },
    //左侧菜单选择
    *menuSelect({payload},{put}){
      // yield put({
      //   type:'updateMenuSelectOpenKeys',
      //   payload:{
      //     menuSelectKeys:payload,
      //   },
      // })
      yield put(routerRedux.push(payload[0]));
    },
    //获取行政区划数据储存
    *getAllProvinceAndCityData({payload},{call,put}){
      const {data}=yield call(findAllProvinceAndCityFetch);
      if(!!data){
        if(data.status==='success' && !!data.data){
          // const result=creatZoningData(data.data);
          const {treeArr,treeMap} = new creatZoningData(data.data).init(null);
          sessionStorage.setItem('all_province_city',JSON.stringify({arr:treeArr}));
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取行政区划数据失败！',
              todo:'default',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请刷新页面',
            title:'获取行政区划数据失败！',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //左侧菜单展开
    *menuOpen({payload},{put}){
      yield put({
        type:'changeOpenKeys',
        payload:[payload[payload.length-1]],
      })
    },
    //登出
    *logout({payload},{call,put}){
      const {data}=yield call(doLogout);
      if(!!data){
        sessionStorage.removeItem('anzhu_login');
        yield put({
          type:'clearUserInfo',
        });
        yield put(routerRedux.push('/login'));
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:data.message,
            title:'注销登录失败',
            todo:'default',
            okText:'确定',
          },
        });
      }
    },
    //执行更改首次登录更改登录密码
    *doChangeLoginPsw({payload},{call,put}){
      yield put({
        type:'changePsdModalButtonLoading',
        payload:true,
      })
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
              todo:'closePsdModal',
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
            todo:'default',
          },
        });
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
        case 'changePsdFail':
          yield put({type:'onlyClosePrompt'});
          yield put({
            type:'changePsdModalButtonLoading',
            payload:false,
          });
          break;
        case 'closePsdModal':
          yield put({type:'onlyClosePrompt'});
          yield put({type:'closeInitPsdModal'});
          yield put({type:'logout'});
          break;
        default:
          yield put({type:'onlyClosePrompt'});
          break;
      }
    },

  },
  reducers: {
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
    //切换修改登录密码模态框
    toggleLoginPsdModal(state,action){
      return {...state,loginPsdModal:{...initState.loginPsdModal,visible:action.payload,}}
    },
    //切换修改登录密码模态框button loading
    changePsdModalButtonLoading(state,action){
      return {...state,loginPsdModal:{...state.loginPsdModal,confirmLoading:action.payload,}}
    },
    //关闭，初始化更改登录密码模态框
    closeInitPsdModal(state,action){
      return {...state,loginPsdModal:initState.loginPsdModal}
    },
    //更新站内信
    updateNewMsg(state,action){
      return {...state,remindMsg:action.payload}
    },
    //更新未读消息数量
    updateNoReadCount(state,action){
      return {...state,noReadCount:action.payload}
    },
    //更新menusKeys
    updateMenuKeys(state,action){
      return {...state,menuKeys:action.payload}
    },
    initComponent(state,action){
      return lodash.cloneDeep(initState)
    },
    lowerNoReadCount(state,action){
      if(state.noReadCount === 0){
        return {...state,noReadCount:0}
      }else{
        return {...state,noReadCount:(state.noReadCount -1)}
      }
    },
  },
}



function creatMenuKeys(){
  const menuKeys=[
    {
      title:'首页',
      icon:'menu_icon_sy',
      key:'/indexPage',
      show:true,
    },{
      title:'交易管理',
      icon:'menu_icon_jygl',
      key:'/tradeManagement',
      show:judgeJurisdiction('TRADINGCENTER_TRANSACTION_MANAGEMENT'),
      child:[
        {
          title:'新房交易',
          key:'/tradeManagement/newHouseTrade',
          show:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_DEAL'),
        },{
          title:'二手房出售交易',
          key:'/tradeManagement/secondHouseSellTrade',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE'),
        },{
          title:'二手房出租交易',
          key:'/tradeManagement/secondHouseRentTrade',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT'),
        }
      ]
    },{
      title: '新房电商',
      icon: 'menu_icon_sfds',
      key: '/newHouseOnline',
      show:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_ECOMMERCE'),
      child: [
        {
          title: '项目管理',
          key: '/newHouseOnline/projectManagement',
          show:judgeJurisdiction('TRADINGCENTER_PROJECT_MANAGEMENT'),
        }
      ]
    },{
      title: '合同审核',
      icon: 'menu_icon_htsh',
      key: '/contractReview',
      show:judgeJurisdiction('TRADINGCENTER_DEALORCONTRACT_AUDIT'),
      child: [
        {
          title: '新房项目审核',
          key: '/contractReview/newHouseContractReview',
          show:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_CONTRACT_AUDIT'),
        },{
          title: '新房交易合同审核',
          key: '/contractReview/newhousetransactionContractReview',
          show:judgeJurisdiction('TRADINGCENTER_TRADING_CONTRACT_AUDIT'),
        },{
          title: '二手房出售合同审核',
          key: '/contractReview/secondHandHouseSalesAudit',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_SELL_CONTRACT_AUDIT'),
        },{
          title: '二手房出租合同审核',
          key: '/contractReview/secondHandHouseRentalAudit',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_CONTRACT_APPROVE'),
        }
      ]
    },{
      title: '财务管理',
      icon:'menu_icon_cwgl',
      key: '/financialManagement',
      show:judgeJurisdiction('TRADINGCENTER_FINANCIAL_MANAGEMENT'),
      child: [
        {
          title: '电商交易审核',
          key: '/financialManagement/newHouseElectricityExamination',
          show:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_ELECTRICITY_TRANSACTION_APPROVAL'),
        }, {
          title: '二手房出售审核',
          key: '/financialManagement/secondHouseSellExamine',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE_FINANCIAL_APPROVAL'),
        }, {
          title: '二手房出租审核',
          key: '/financialManagement/secondHouseLeaseExamine',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_APPROVAL'),
        }, {
          title: '新房交易收支管理',
          key: '/financialManagement/newHouseRevenueManagement',
          show:judgeJurisdiction('TRADINGCENTER_NEWHOUSE_DEAL_PAYMENTS_MANAGEMENT'),
        }, {
          title: '二手房交易收支管理',
          key: '/financialManagement/secondHouseRevenueManagement',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_DEAL_PAYMENTS_MANAGEMENT'),
        }, {
          title: '服务费收益管理',
          key: '/financialManagement/ServiceFeeRevenueManagement',
          show:judgeJurisdiction('TRADINGCENTER_SERVICEFEE_REVENUE_MANAGEMENT'),
        }
      ]
    },{
      title: '贷款管理',
      icon: 'menu_icon_dkgl',
      key: '/loanManagement',
      show:judgeJurisdiction('TRADINGCENTER_LOAN_REVENUE_MANAGEMENT'),
      child: [
        {
          title: '二手房解押贷款办理',
          key: '/loanManagement/secondHandHouseSolution',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_SIGN_LOAN'),
        }, {
          title: '二手房贷款办理',
          key: '/loanManagement/secondHandHouseMortgageDeal',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_LOAN'),
        }, {
          title: '二手房出租分期办理',
          key: '/loanManagement/secondHandHouseRentalLoans',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_INSTALLMENT_MANAGEMENT'),
        }
      ]
    },{
      title: '过户管理',
      icon: 'menu_icon_ghgl',
      key: '/transferManagement',
      show:judgeJurisdiction('TRADINGCENTER_CHANGENAME_MANAGEMENT'),
      child:[
        {
          title: '二手房过户办理',
          key: '/transferManagement/secondHandHouseTransfer',
          show:judgeJurisdiction('TRADINGCENTER_SECONDHAND_CHANGENAME'),
        }
      ]
    },{
      title: '数据分析',
      icon: 'menu_icon_sjfx',
      key: '/dataAnalysis',
      show:judgeJurisdiction('TRADINGCENTER_DATA_ANALYZE'),
      child: [
        {
          title: '交易统计',
          key: '/dataAnalysis/tradeStatistics',
          show:judgeJurisdiction('TRADINGCENTER_TRADING_STATISTICAL'),
        },{
          title: '团队统计',
          key: '/dataAnalysis/teamStatistics',
          show:judgeJurisdiction('TRADINGCENTER_TEAM_STATISTICAL'),
        },{
          title: '交易服务费统计',
          key: '/dataAnalysis/commissionStatistics',
          show:judgeJurisdiction('TRADINGCENTER_SERVICEFEE_STATISTICAL'),
        }
      ]
    },{
      title: '企业管理',
      icon: 'menu_icon_qygl',
      key: '/businessManagement',
      show:judgeJurisdiction('TRADINGCENTER_ENTERPRISE_MANAGEMENT'),
      child: [
        {
          title: '企业信息管理',
          key: '/businessManagement/businessInformationManagement',
          show:judgeJurisdiction('TRADINGCENTER_ENTERPRISE_INFORMATION_MANAGEMENT'),
        }, {
          title: '组织架构管理',
          key: '/businessManagement/organizeStructureManagement',
          show:judgeJurisdiction('TRADINGCENTER_ORGANIZATION_STRUCTURE_MANAGEMENT'),
        }, {
          title: '角色管理',
          key: '/businessManagement/roleManagement',
          show:judgeJurisdiction('TRADINGCENTER_GROUPAUTHORITY_MANAGEMENT'),
        }
      ]
    },{
      title: '操作日志',
      icon: 'menu_icon_czrz',
      key: '/operationLog',
      show:judgeJurisdiction('TRADINGCENTER_OPERATION_LOG'),
    },{
      title: '合同模版',
      icon: 'menu_icon_htmb',
      key: '/contractTemplate',
      show:judgeJurisdiction('TRADINGCENTER_CONTRACT_TEMPLATE'),
    },
    // {
    //   title: '使用帮助',
    //   icon: 'menu_icon_ins',
    //   key: '/instructions',
    // show:judgeJurisdiction('TRADINGCENTER_USE_HELP'),
    // },
  ];
  return menuKeys;
}
