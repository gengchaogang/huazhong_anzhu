import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getTransactionOrderInfoDataFetch,
  addTransactionsApplyFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatTransactions'
import {
  isNull,
  checkJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  renderUnitPriceStr,
  renderMoneyStr,
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  orderInfo:null,
  commissionInfos:null,
  auditorList:[],
  groupKey:null,
  buttonLoading:false,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  upLoadPicList:[],
}
export default {
  namespace: 'nhCommitApply',
  state:lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/nhCommitApply') {
          dispatch({
            type:'initComponent',
            payload:location.state,
          })
        }
      });
    },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({
        type:'doInitState',
      })
      console.log('payload',payload);
      if(!!payload && !!payload.groupKey){
        yield put({
          type:'getBasicData',
          payload,
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'未获得groupKey',
            title:'获取交易数据失败',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //初始获取基础数据
    *getBasicData({payload},{put}){
      yield put({
        type:'initGroupBuyId',
        payload:{
          groupKey:payload.groupKey,
        }
      });
      yield put({type:'getRefundPreDataJSON',payload,});
      yield put({type:'getAuditorListData'})
    },
    //获取退款预申请信息
    *getRefundPreDataJSON({payload},{call,put,}){
      console.log('获取退款预申请信息payload',payload);
      const {data}=yield call(getTransactionOrderInfoDataFetch,{groupKey:payload.groupKey});
      if(!!data){
        if(data.status==='success' && !!data.data){
          const result=data.data;
          console.log('result',result);
          const orderInfo={
            key:isNull(result.id,'-'),
            project:isNull(result.projectName,'-'),
            propertyType:isNull(result.propertyType,'-'),
            intentionHouse:isNull(result.houseName,'-'),
            groupBuyType:isNull(result.discountName,'-'),
            unitPrice:renderUnitPriceStr(result.unitPrice,''),
            totalPrice:renderTotalMoneyStr(result.totalPrice,''),
            commission:renderMoneyStr(result.brokerage,'-'),
            agent:isNull(result.brokerName,'-'),
            time:isNull(result.createTime,'-'),
            groupKey:isNull(payload.groupKey,null),
          }
          const commissionInfos = [
            {
              label:'成交方式',
              value:isNull(result.commitType,'-'),
            },
            {
              label:'佣金总额',
              value:`${isNull(result.brokerage,'')}元`,
            },
            {
              label:'平台抽佣',
              value:`${isNull(result.commissionRate,0)*100}%`,
            },
            {
              label:'剩余佣金总额',
              value:`${isNull(result.residualCommission,'')}元`,
            },
            {
              label:'佣金分配金额',
              value:`${isNull(result.commissionAmount,'')}元`,
            },
          ]
          yield put({
            type:'initOrderInfo',
            payload:{
              orderInfo:JSON.stringify(orderInfo),
              commissionInfos:JSON.stringify(commissionInfos),
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取预成交信息失败！',
              okText:'确定',
              todo:'getOut',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败！',
            title:'获取预成交信息失败！',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //执行成交申请
    *postRefundApplyData({payload},{call,select,put}){
      yield put({
        type:'changeButtonLoading',
        payload:true,
      })
      const {upLoadPicList,groupKey}=yield select(({nhCommitApply})=>nhCommitApply);
      const {data}=yield call(addTransactionsApplyFetch,{
        attachments:JSON.stringify(upLoadPicList.map(item=>item.id)),
        auditDesc:isNull(payload.reason,''),
        auditUserId:isNull(payload.auditor.key,''),
        auditUserName:isNull(payload.auditor.label,''),
        groupKey,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'新房成交申请成功！',
              okText:'确定',
              todo:'goTradeIndex',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'新房成交申请失败！',
              okText:'确定',
              todo:'closeLoading',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败！',
            title:'新房成交申请失败！',
            okText:'确定',
            todo:'closeLoading',
          },
        })
      }
    },
    //获取审核人员列表
    *getAuditorListData({payload},{call,put}){
      const {data}=yield call(getAuditorList,{name:'新房交易合同审核'});
      if(!!data){
        if(data.status==='success' && !!data.data && data.data.length!==0){
          const auditorList=data.data.map(item=>({
            name:item.name,
            id:`${item.userId}`,
          }));
          yield put({
            type:'initAuditorList',
            payload:auditorList,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取审核人员失败！',
              okText:'确定',
              todo:'getOut',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败！',
            title:'获取审核人员失败！',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ nhCommitApply }) => nhCommitApply.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'closeLoading':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'changeButtonLoading',payload:false});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        case 'goTradeIndex':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put(routerRedux.push({
            pathname:'/tradeManagement/newHouseTrade'
          }));
          break;
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },

  },
  reducers: {
    doInitState(state,action){
      return lodash.cloneDeep(initState);
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return{...state,promptObj:initState.promptObj}
    },
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
    },
    initGroupBuyId(state,action){
      return {...state,...action.payload}
    },
    initOrderInfo(state,action){
      return {...state,...action.payload}
    },
    initAuditorList(state,action){
      return {...state,auditorList:action.payload}
    },
    changeButtonLoading(state,action){
      return {...state,buttonLoading:action.payload}
    },
  },
}
