import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getPayDownRefundPreData,
  postPayDownRefundApplyFetch,
} from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  isNull,
  checkJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  orderInfo:null,
  auditorList:[],
  transCode:null,
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
  namespace: 'shSellDownPaymentRefundApply',
  state:lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/shSellDownPaymentRefundApply') {
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
      if(!!payload && !!payload.transCode){
        yield put({
          type:'getBasicData',
          payload:payload.transCode,
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
      yield put({type:'initTransCode',payload,});
      yield put({type:'getRefundPreDataJSON',payload,});
      yield put({type:'getAuditorListData'})
    },
    //获取退款预申请信息
    *getRefundPreDataJSON({payload},{call,put,}){
      const {data}=yield call(getPayDownRefundPreData,{transCode:payload});
      if(!!data){
        if(data.status==='success' && !!data.data){
          const result=data.data;
          const orderInfo={
            orderNumber:isNull(result.orderNumber,'-'),
            payWay:isNull(result.paymentMethod ,'-'),
            paySerialNumber:isNull(result.serialNumber,'-'),
            payTime:isNull(result.paymentDateTime,'-'),
            payCustomer:isNull(result.customerName,'-'),
            customerPhone:isNull(result.customerPhone,'-'),
            unitPrice:renderUnitPriceStr(result.firstpayment.unitPrice,'-'),
            totalPrice:renderTotalMoneyStr(result.firstpayment.totalPrice,'-'),
            payDownRatio:isNull(result.firstpayment.firstpaymentRatio,'-'),
            deductedIntention:isNull(result.firstpayment.isDeductedIntention,false)?isNull(result.firstpayment.intentionAmount,'-'):'-',
            payAmount:`${isNull(result.firstpayment.firstpaymentAmount,'-')}元`,
            payStatus:isNull(result.paymentStatus,'-'),
            transCode:isNull(result.firstpayment.transCode,null),
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
    //执行首付款退款申请
    *postRefundApplyData({payload},{call,select,put}){
      yield put({
        type:'changeButtonLoading',
        payload:true,
      })
      const {upLoadPicList,transCode}=yield select(({shSellDownPaymentRefundApply})=>shSellDownPaymentRefundApply);
      const {data}=yield call(postPayDownRefundApplyFetch,{
        images:upLoadPicList.map(item=>item.id),
        ownerName:isNull(payload.ownerName,''),
        ownerPhone:isNull(payload.ownerPhone,''),
        ownercardNumber:isNull(payload.ownerBankCard,''),
        ownerBank:isNull(payload.ownerBank,''),
        ownerSubbranch:isNull(payload.ownerBankSubbranch,''),
        ownerIDNumber:isNull(payload.ownerIDNumber,''),
        ownerBankProvince:isNull(payload.ownerBankProvinceCity,['',''])[0],
        ownerBankCity:isNull(payload.ownerBankProvinceCity,['',''])[1],
        refundReason:isNull(payload.reason,''),
        firstpaymentReturnedToOwner:isNull(payload.refundTo,'购房者')==='业主',
        toUserId:isNull(payload.auditor.key,''),
        toUserName:isNull(payload.auditor.label,''),
        transCode,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'首付款退款申请成功！',
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
              title:'首付款退款申请失败！',
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
            title:'首付款退款申请失败！',
            okText:'确定',
            todo:'closeLoading',
          },
        })
      }
    },
    //获取审核人员列表
    *getAuditorListData({payload},{call,put}){
      const {data}=yield call(getAuditorList,{name:'二手房退款合同审核'});
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
      const {todo} = yield select(({ shSellDownPaymentRefundApply }) => shSellDownPaymentRefundApply.promptObj);
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
    initTransCode(state,action){
      return {...state,transCode:action.payload}
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