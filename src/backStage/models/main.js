import { routerRedux } from 'dva/router'
import {
  testApi,
} from '../services/login';
import {
  pathMap,
  isNull,
  setJurisdictionArr,
  judgeJurisdiction,
} from '../../commons/utils/currencyFunction'
import {
  doLogout,
  getLoginInfo,
} from '../services/main';
import lodash from 'lodash';
const permissions=new Map();
permissions.set('creatEmployee',true);
const initState={
  permissions,
  menuKeys:[{
    title:'首页',
    icon:'setting',
    key:'/indexPage',
  }],
  userInfo:null,
  menuSelectKeys:[],
  openKeys:[],
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },

}
export default {
  namespace: 'main',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname !== '/login'){
         console.log('进入main');
         setTimeout(()=>dispatch({
           type:'locationChange',
           payload:location.pathname,
         }),0);
         if(!window.dispatch){
           window.dispatch=dispatch;
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
    *initMain({payload},{call,select,put}){
      //请求用户信息
      const {data}=yield call(getLoginInfo);
      if(!!data && data.status==='success'){
        const oldPathArr=isNull(data.data.fullPath,'').split('/');
        const newPathArr=[];
        let fullPath='';
        oldPathArr.map((item,index)=>{
          if(index!==0){
            newPathArr.push(item);
          }
        })
        const jurisdictionCodes=isNull(data.data.codes,[]).map(item=>item.code);
        setJurisdictionArr(jurisdictionCodes);
        const newMenuKeys=creatMenuKeys()
        const userInfo={
          name:isNull(data.data.name,''),
          loginAddress:isNull(data.data.lastLoginIp,''),
          deptName:isNull(data.data.deptName,''),
          loginDateTime:isNull(data.data.lastLoginTime,''),
          // centerName:isNull(data.data.tradingCenterName,''),
          // userId:isNull(data.data.userId,''),
          // position:isNull(data.data.position,''),
          // loginName:isNull(data.data.loginName,''),
          // lastLoginTime:isNull(data.data.lastLoginTime,''),
          // lastLoginIp:isNull(data.data.lastLoginIp,''),
          // deptName:isNull(data.data.deptName,''),
          // fullPath:newPathArr.join('-'),
        }
        yield put({
          type:'initUserInfo',
          payload:JSON.stringify(userInfo),
        })
        yield put({
          type:'updateMenuKeys',
          payload:newMenuKeys,
        })
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
      console.log('jinru locationChange>>>>>>>>>>>>>>>>>>>>>');
      const {userInfo,menuSelectKeys}=yield select(({main})=>main);
      if(!!sessionStorage.getItem('anzhu_login') && userInfo===null && payload!=='/login'){
        console.log('执行initMain》》》》》》》》》》》》》》》');
        yield put({type:'initMain'})
      }
      const pathArr=payload.split('/');
      // console.log('pathArr',pathArr);
      if(pathArr.length>=4){
        const selectedKeys=[`/${pathArr[1]}/${pathArr[2]}`];
        // console.log('selectedKeys',selectedKeys);
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
      // yield put({
      //   type:'updateMenuSelectOpenKeys',
      //   payload:{
      //     menuSelectKeys:payload,
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
    initComponent(state,action){
      return lodash.cloneDeep(initState)
    },
    //清除用户信息
    clearUserInfo(state,action){
      return {...state,userInfo:null}
    },
    //更新左侧菜单
    updateMenuKeys(state,action){
      return {...state,menuKeys:action.payload}
    },
    //初始化用户信息
    initUserInfo(state,action){
      return {...state,userInfo:action.payload}
    },
    //更新菜单展开数组
    changeOpenKeys(state,action){
      return {...state,openKeys:action.payload}
    },
  },
}
function creatMenuKeys(){
  const menuKeys=[
    {
      title:'首页',
      icon:'setting',
      key:'/indexPage',
      show:judgeJurisdiction('BACKSTAGE_PAGE'),
    },{
      title: '内容审核',
      icon: 'windows-o',
      key: '/contentCheck',
      show:judgeJurisdiction('BACKSTAGE_CONTENT_AUDIT'),
      child: [
        {
          title: '房源图片审核',
          key: '/contentCheck/houseImgCheck',
          show:judgeJurisdiction('BACKSTAGE_HOUSINGPICTURE_AUDIT'),
        },
        {
          title: '导师注册',
          key: '/contentCheck/advisorRegister',
          show:judgeJurisdiction('BACKSTAGE_MENTOR_REGISTERED'),
        },
        {
          title: '经纪人上传小区',
          key: '/contentCheck/brokerUploadCommunity',
          show:judgeJurisdiction('BACKSTAGE_BROKER_UPLOADCOMMUNITY'),
        },
        {
          title: '解除关系申请',
          key: '/contentCheck/removeRelationApplication',
          show:judgeJurisdiction('BACKSTAGE_REMOVERELATIONSHIP_APPLY'),
        },
        {
          title:'意见反馈',
          key: '/contentCheck/feedback',
          show:judgeJurisdiction('BACKSTAGE_OPINION_FEEDBACK'),
        }, {
          title:'提现申请',
          key: '/contentCheck/applicationWithdrawal',
          show:judgeJurisdiction('BACKSTAGE_WITHDRAWAL_TOAPPLY'),
        }
      ]
    },{
      title: '账号管理',
      icon: 'setting',
      key: '/idManagement',
      show:judgeJurisdiction('BACKSTAGE_ACCOUNT_MANAGEMENT'),
      child: [
        {
          title: '经纪人',
          key: '/idManagement/brokerIdIndex',
          show:judgeJurisdiction('BACKSTAGE_BROKER'),
        }, {
          title: '导师',
          key: '/idManagement/advisorIdIndex',
          show:judgeJurisdiction('BACKSTAGE_TUTOR'),
        }, {
          title: '交易中心',
          key: '/idManagement/dealCenterIdIndex',
          show:judgeJurisdiction('BACKSTAGE_TRADINGCENTER'),
        }, {
          title: '代理商',
          key: '/idManagement/agentIdIndex',
          show:judgeJurisdiction('BACKSTAGE_OPERATOR'),
        },{
          title:'客户',
          key:'/idManagement/customerManagement',
          show:judgeJurisdiction('BACKSTAGE_CUSTOMER'),
        }
      ]
    },
    {
      title:'账户管理',
      icon:'setting',
      key:'/accountManagement',
      show:judgeJurisdiction('BACKSTAGE_LEDGER_MANAGEMENT'),
      child:[
        {
          title:'经纪人',
          key:'/accountManagement/zhangHuGuanLiBroker',
          show:judgeJurisdiction('BACKSTAGE_BROKER_LEDGER'),
        },{
          title:'导师',
          key:'/accountManagement/accountTutor',
          show:judgeJurisdiction('BACKSTAGE_TUTOR_LEDGER'),
        },{
          title:'交易中心',
          key:'/accountManagement/accountDealCenter',
          show:judgeJurisdiction('BACKSTAGE_TRADINGCENTER_LEDGER'),
        },{
          title:'代理商',
          key:'/accountManagement/zhangHuGuanLiAgent',
          show:judgeJurisdiction('BACKSTAGE_OPERATOR_LEDGER'),
        }
      ]
    },
    {
      title: '房源管理',
      icon: 'setting',
      key: '/resourceManagement',
      show:judgeJurisdiction('BACKSTAGE_HOUSING_MANAGEMENT'),
      child: [
         {
          title: '新房项目',
          key: '/resourceManagement/newHousePro',
          show:judgeJurisdiction('BACKSTAGE_NEWHOUSE_PROJECT'),
        }, {
          title: '二手房出售',
          key: '/resourceManagement/secondhandHouseSell',
          show:judgeJurisdiction('BACKSTAGE_SECONDHAND_SELL'),
        }, {
          title: '二手房出租',
          key: '/resourceManagement/secondhandHouseRent',
          show:judgeJurisdiction('BACKSTAGE_SECONDHAND_RENT'),
        }, {
          title: '商铺出售',
          key: '/resourceManagement/storeSell',
          show:judgeJurisdiction('BACKSTAGE_SHOP_SELL'),
        }, {
          title: '商铺出租',
          key: '/resourceManagement/storeRent',
          show:judgeJurisdiction('BACKSTAGE_SHOP_RENT'),
        }, {
          title: '写字楼出售',
          key: '/resourceManagement/officeBuildingSell',
          show:judgeJurisdiction('BACKSTAGE_OFFICE_SELL'),
        }, {
          title: '写字楼出租',
          key: '/resourceManagement/officeBuildingRent',
          show:judgeJurisdiction('BACKSTAGE_OFFICE_RENT'),
        }, {
          title: '下架房源',
          key: '/resourceManagement/soldOutHouse',
          show:judgeJurisdiction('BACKSTAGE_HOUSING_SHELVES'),
        }
      ]
    },{
      title: '楼盘字典',
      icon: 'setting',
      key: '/developmentDictionary',
      show:judgeJurisdiction('BACKSTAGE_BUILDING_DICTIONARY'),
      child:[
        {
          title: '小区',
          key: '/developmentDictionary/residentialArea',
          show:judgeJurisdiction('BACKSTAGE_COMMUNITY'),
        },{
          title: '商铺',
          key: '/developmentDictionary/shopsManagement',
          show:judgeJurisdiction('BACKSTAGE_SHOP'),
        },{
          title: '写字楼',
          key: '/developmentDictionary/officeBuilding',
          show:judgeJurisdiction('BACKSTAGE_OFFICEBUILDING'),
        }
      ],
    },{
      title: '城市管理',
      icon: 'setting',
      key: '/cityManagement',
      show:judgeJurisdiction('BACKSTAGE_CITY_MANAGEMENT'),
      child:[
        {
          title: '开通城市',
          key: '/cityManagement/openCity',
          show:judgeJurisdiction('BACKSTAGE_OPEN_CITY'),
        }
      ],
    },{
      title: '标签管理',
      icon: 'setting',
      key: '/labelManagement',
      show:judgeJurisdiction('BACKSTAGE_LABEL_MANAGEMENT'),
      child:[
        {
          title: '标签配置',
          key: '/labelManagement/labelConfiguration',
          show:judgeJurisdiction('BACKSTAGE_LABEL_CONFIGURATION'),
        }
      ],
    },{
      title: '收益设置',
      icon: 'setting',
      key: '/earningSetting',
      show:judgeJurisdiction('BACKSTAGE_EARNINGS_SET'),
      child: [
        {
          title: '各方收益配比',
          key: '/earningSetting/allEarningsMatching',
          show:judgeJurisdiction('BACKSTAGE_PARTIES_EARNINGS_RATIO'),
        }, {
          title: '佣金配比方案',
          key: '/earningSetting/brokerageMatching',
          show:judgeJurisdiction('BACKSTAGE_COMMISSION_RATIO_PLAN'),
        }, {
          title: '交易服务费配比方案',
          key: '/earningSetting/serviceMatching',
          show:judgeJurisdiction('BACKSTAGE_TRADING_SERVICEFEE_RATIO_PLAN'),
        }
      ]
    },
    {
      title: '财务管理',
      icon: 'setting',
      key: '/financeManagement',
      show:judgeJurisdiction('BACKSTAGE_FINANCIAL_MANAGEMENT'),
      child: [
        {
          title: '平台资金',
          key: '/financeManagement/platformFund',
          show:judgeJurisdiction('BACKSTAGE_PLATFORM_MONEY'),
        }, {
          title: '平台收益结算',
          key: '/financeManagement/platformEarningBalance',
          show:judgeJurisdiction('BACKSTAGE_PLATFORM_EARNINGS_SETTLEMENT'),
        }
      ]
    },
    {
      title: '广告投放',
      icon: 'setting',
      key: '/adManagement',
      show:judgeJurisdiction('BACKSTAGE_ADVERTISING_PUT'),
      child: [
        {
          title: '投放管理',
          key: '/adManagement/putManage',
          show:judgeJurisdiction('BACKSTAGE_PUT_MANAGEMENT'),
        }
      ]
    },{
      title: '培训',
      icon: 'setting',
      key: '/train',
      show:judgeJurisdiction('BACKSTAGE_TRAIN'),
      child: [
        {
          title: '培训内容',
          key: '/train/trainContent',
          show:judgeJurisdiction('BACKSTAGE_TRAIN_CONTENT'),
        }
      ]
    },
    {
      title: '消息管理',
      icon: 'setting',
      key: '/messageManagement',
      show:judgeJurisdiction('BACKSTAGE_INFORMATION_MANAGEMENT'),
      child: [
        {
          title: '系统消息',
          key: '/messageManagement/systemMessage',
          show:judgeJurisdiction('BACKSTAGE_SYSTEM_MESSAGE'),
        },{
          title: '推送消息',
          key: '/messageManagement/pushMessage',
          show:judgeJurisdiction('BACKSTAGE_PUSH_MESSAGE'),
        }
      ]
    },
    {
      title: '合同协议管理',
      icon: 'setting',
      key: '/contractManagement',
      show:judgeJurisdiction('BACKSTAGE_CONTRACT_AGREEMENT_MANAGEMENT'),
      child: [
        {
          title:'合同协议模块管理',
          key: '/contractManagement/contractAgreementModulesManage',
          show:judgeJurisdiction('BACKSTAGE_CONTRACTAGREEMENT_MODULE_MANAGEMENT'),
        }
      ]
    },
    {
      title: '师徒设置',
      icon: 'setting',
      key: '/mentoringSetting',
      show:judgeJurisdiction('BACKSTAGE_TEACHERANDPUPIL_SET'),
      child: [
        {
          title: '晋升师傅要求',
          key: '/mentoringSetting/promoteMaster',
          show:judgeJurisdiction('BACKSTAGE_PROMOTIONMASTER_REQUIREMENTS'),
        },{
          title:'徒弟出师要求',
          key: '/mentoringSetting/promotePrentice',
          show:judgeJurisdiction('BACKSTAGE_PUPIL_FINISH_REQUIREMENTS'),
        }
      ]
    },
    {
      title: '权限管理',
      icon: 'setting',
      key: '/accessManagement',
      show:judgeJurisdiction('BACKSTAGE_AUTHORITY_MANAGEMENT'),
      child: [
       {
          title: '角色管理',
          key: '/accessManagement/jolesManagement',
          show:judgeJurisdiction('BACKSTAGE_ROLE_MANAGEMENT'),
        }
      ]
    },{
      title: '企业架构',
      icon: 'setting',
      key: '/enterpriseFramework',
      show:judgeJurisdiction('BACKSTAGE_ENTERPRISE_ARCHITECTURE'),
      child: [
        {
          title: '人员管理',
          key: '/enterpriseFramework/personnelManage',
          show:judgeJurisdiction('BACKSTAGE_PERSONNEL_MANAGEMENT'),
        }
      ]
    },{
      title: '设置',
      icon: 'setting',
      key: '/setting',
      show:judgeJurisdiction('BACKSTAGE_SET'),
      child: [
        {
          title: '修改密码',
          key: '/setting/modifyPassword',
          show:judgeJurisdiction('BACKSTAGE_EDIT_PASSWORD'),
        }
      ]
    },{
      title: 'Apk版本管理',
      icon: 'setting',
      key: '/apkVersion',
      show:judgeJurisdiction('BACKSTAGE_VERSIONS'),
      child: [
        {
          title: '版本管理',
          key: '/apkVersion/apkManagement',
          show:judgeJurisdiction('BACKSTAGE_VERSIONS'),
        }
      ]
    }
  ];
  return menuKeys;
}
