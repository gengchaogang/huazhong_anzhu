import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getOrderTableDataFetch,
  postGroupBuyRefundApply,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
import {
  isNull,
  checkJSON,
} from '../../../../commons/utils/currencyFunction'
import lodash from 'lodash';
const initState={
  orderInfo:null,
  auditorList:[],
  groupBuyId:null,
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
  namespace: 'nhGroupBuyRefundApply',
  state:lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/nhGroupBuyRefundApply') {
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
      if(!!payload && !!payload.groupBuyId){
        yield put({
          type:'getBasicData',
          payload,
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'未获得transCode',
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
          groupBuyId:payload.groupBuyId,
        }
      });
      yield put({type:'getRefundPreDataJSON',payload,});
      yield put({type:'getAuditorListData'})
    },
    //获取退款预申请信息
    *getRefundPreDataJSON({payload},{call,put,}){
      const {data}=yield call(getOrderTableDataFetch,{groupbuyId:payload.groupBuyId});
      if(!!data){
        if(data.status==='success' && !!data.data){
          const result=data.data;
          const orderInfo={
            refundType:'电商团购',
            projectName:isNull(data.data.projectName,'-'),
            orderNumber:isNull(data.data.payOrderNumber,'-'),
            payWay:isNull(data.data.payType,'-'),
            paySerialNumber:isNull(data.data.paySerialNumber,'-'),
            customerName:isNull(data.data.customerName,'-'),
            customerPhone:isNull(data.data.customerPhone,'-'),
            payTime:isNull(data.data.payFinishTime,'-'),
            payAmount:`${isNull(data.data.groupbuyMoney,'-')}元`,
            payStatus:isNull(data.data.status,'-'),
            groupKey:isNull(payload.groupKey,null),
          }
          yield put({
            type:'initOrderInfo',
            payload:JSON.stringify(orderInfo),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取预退款信息失败！',
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
            title:'获取预退款信息失败！',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //执行电商团购退款申请
    *postRefundApplyData({payload},{call,select,put}){
      yield put({
        type:'changeButtonLoading',
        payload:true,
      })
      const {upLoadPicList,groupBuyId}=yield select(({nhGroupBuyRefundApply})=>nhGroupBuyRefundApply);
      const {data}=yield call(postGroupBuyRefundApply,{
        reasonPic:upLoadPicList.map(item=>item.id),
        reason:isNull(payload.reason,''),
        contractReviewUserId:isNull(payload.auditor.key,''),
        contractReviewUserName:isNull(payload.auditor.label,''),
        groupbuyId:groupBuyId,
        refundType:'电商团购',
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'电商团购退款申请成功！',
              okText:'确定',
              todo:'getOut',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'电商团购退款申请失败！',
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
            title:'电商团购退款申请失败！',
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
      const {todo} = yield select(({ nhGroupBuyRefundApply }) => nhGroupBuyRefundApply.promptObj);
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
      return {...state,orderInfo:action.payload}
    },
    initAuditorList(state,action){
      return {...state,auditorList:action.payload}
    },
    changeButtonLoading(state,action){
      return {...state,buttonLoading:action.payload}
    },
  },
}
