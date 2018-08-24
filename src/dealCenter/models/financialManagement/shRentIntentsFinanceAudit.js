import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../services/userFetch'
import {
  getIntentionRefundAuditRecord,
} from '../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  shSellIntentsFinanceAuditPassFetch,
  shSellIntentsFinanceAuditRejectFetch,
} from '../../services/financialManagement/shFinaceAudit'
import {
  isNull,
  checkJSON,
  isValid,
  renderAuditStatus,
  renderSHAduitRequestAgr,
} from '../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
  renderMoneyStr,
  renderRentMeony,
} from '../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
  applyId:null,
  recordId:null,
  loading:true,
  status:'process',
  stepList:[
    {
      title:'申请退款'
    },{
      title:'退款审核'
    },{
      title:'财务审核'
    },{
      title:'执行退款'
    }
  ],
  current:0,
  transCode:null,
  buttonLoading:false,
  auditModal:{
    visible:false,
    todo:'pass',
    confirmLoading:false,
    auditorList:null,
  },
  canAudit:false,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'shRentIntentsFinanceAudit',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/financialManagement/secondHouseLeaseExamine/shRentIntentsFinanceAudit') {
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
      const {applyId,recordId}=payload;
      if(isValid(applyId) && isValid(recordId)){
        yield put({
          type:'keepIds',
          payload,
        })
        yield put({
          type:'getAuditRecodeData',
          payload:applyId,
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
    //获取审核信息
    *getAuditRecodeData({payload},{put,call}){
      const {data}=yield call(getIntentionRefundAuditRecord,{applyId:payload});
      if(!!data){
        if(data.status==='success'){
          const {orderinfo,applyinfo,auditinfos}=data.data;
          const showData={
            orderInfo:{
              orderNumber:isNull(orderinfo.orderNumber,'-'),
              payWay:isNull(orderinfo.paymentMethod ,'-'),
              paySerialNumber:isNull(orderinfo.serialNumber,'-'),
              payTime:isNull(orderinfo.paymentDateTime,'-'),
              payCustomer:isNull(orderinfo.customerName,'-'),
              customerPhone:isNull(orderinfo.customerPhone,'-'),
              unitPrice:`${isNull(orderinfo.unitPrice,'-')}元`,
              totalPrice:renderTotalMoneyStr(orderinfo.totalPrice,'-'),
              intentionRentAmount:renderRentMeony(orderinfo.actualRent,orderinfo.resourceType),
              intentionAmount:renderMoneyStr(orderinfo.amount,'-'),
              payStatus:isNull(orderinfo.paymentStatus,'-'),
              transCode:isNull(orderinfo.transCode,null),
            },
            returnedInfo:[
              {
                label:'收款方',
                value:isNull(applyinfo.returnedToOwner,false)?'业主':'租房者',
              },
              {
                label:'退款方式',
                value:isNull(applyinfo.returnedToOwner,false)?'银联代付':'同卡同出',
              },
            ],
            applyInfo:{
              reason:isNull(applyinfo.refundReason,''),
              applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
                title:'',
                src:item,
                id:`PicKey_${index}`
              })),
            },
            auditInfo:isNull(auditinfos,[]).map(item=>({
              time:isNull(item.auditDateTime,'--'),
              content:isNull(item.auditInfo,'--'),
              remarks:`说明：${isNull(item.reason,'--')}`,
              pics:isNull(item.images,null),
              isReject:isNull(item.auditInfo,'--').indexOf('驳回')!=-1,
            })),
          }
          if(!!applyinfo.returnedToOwner){
            showData.returnedInfo.push({
              label:'业主姓名',
              value:isNull(applyinfo.ownerName,'-'),
            })
            showData.returnedInfo.push({
              label:'业主电话',
              value:isNull(applyinfo.ownerPhone,'-'),
            })
            showData.returnedInfo.push({
              label:'业主银行卡号',
              value:isNull(applyinfo.ownercardNumber,'-'),
            })
            showData.returnedInfo.push({
              label:'开户银行',
              value:isNull(applyinfo.ownerBank,'-'),
            })
            showData.returnedInfo.push({
              label:'开户行所属省市',
              value:`${isNull(applyinfo.ownerBankProvince,'-')}/${isNull(applyinfo.ownerBankCity,'-')}`,
            })
            showData.returnedInfo.push({
              label:'开户支行',
              value:isNull(applyinfo.ownerSubbranch,'-'),
            })
          }
          //判断审核状态
          let canAudit = true;
          const auditStatus=renderAuditStatus('commons',isNull(applyinfo.auditStatus,''),'finance');
          const stepList=[
            {
              title:'申请退款',
            },{
              title:'退款审核',
            },{
              title:'财务审核',
            },{
              title:'执行退款',
            }
          ];
          canAudit=auditStatus.canAudit;
          const {current,status}=auditStatus;
          if(!!isNull(applyinfo.isEnd,false)){
            canAudit = false;
          }
          if(status==='error')stepList[current].description='已驳回';
          yield put({
            type:'initMainData',
            payload:{
              showDataInfo:JSON.stringify(showData),
              stepList,
              canAudit,
              current,
              status,
              transCode:isNull(orderinfo.transCode,null),
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取审核信息失败！',
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
            description:'请求失败',
            title:'获取审核信息失败！',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //切换审核类型,获取审核人员列表
    *updateAudit({payload},{put,call}){
      yield put({
        type:'openAuditModal',
        payload:{
          visible:true,
          todo:payload,
        }
      })
    },
    //执行审核
    *doAudit({payload},{select,call,put}){
      yield put({
        type:'changeAuditModalLoading',
        payload:true,
      })
      const {todo}=payload;
      const {recordId}=yield select(({shRentIntentsFinanceAudit})=>shRentIntentsFinanceAudit);
      const {data}=yield call((todo==='pass'?shSellIntentsFinanceAuditPassFetch:shSellIntentsFinanceAuditRejectFetch),{...renderSHAduitRequestAgr(payload),recordId,});
      if(!!data && data.status==='success'){
        yield put({
          type:'changeAuditModalLoading',
          payload:false,
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'',
            title:`${todo==='pass'?'审核通过成功！':'审核驳回成功！'}`,
            okText:'确定',
            todo:'initComponent',
          },
        })
      }else{
        yield put({
          type:'changeAuditModalLoading',
          payload:false,
        })
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败'),
            title:`${todo==='pass'?'审核通过失败！':'审核驳回失败！'}`,
            okText:'确定',
            todo:'default',
          },
        })
      }

    },
    //放弃执行审核
    *cancelAudit({payload},{put}){
      yield put({
        type:'closeAuditModal',
      })
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {promptObj:{todo,},recordId,applyId,} = yield select(({ shRentIntentsFinanceAudit }) => shRentIntentsFinanceAudit);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        case 'changeLoading':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'changeComponentLoading',payload:false});
          break;
        case 'initComponent':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'closeAuditModal'});
          yield put({type:'initComponent',payload:{
            recordId,
            applyId,
          }});
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
      return{...state,promptObj:lodash.cloneDeep(initState).promptObj}
    },
    //组件loading状态
    changeComponentLoading(state,action){
      return {...state,loading:action.payload}
    },
    //初始化申请信息
    initMainData(state,action){
      return {...state,...action.payload,loading:false}
    },
    //保存applyId,recordId
    keepIds(state,action){
      return {...state,...action.payload}
    },
    //打开审核模态框
    openAuditModal(state,action){
      return {...state,auditModal:{...state.auditModal,...action.payload},loading:false}
    },
    //关闭审核模态框
    closeAuditModal(state,action){
      return {...state,auditModal:{...state.auditModal,visible:false}}
    },
    //审核模态框afterClose
    afterCloseAuditModal(state,action){
      return {...state,auditModal:lodash.cloneDeep(initState).auditModal}
    },
    changeAuditModalLoading(state,action){
      return {...state,auditModal:{...state.auditModal,confirmLoading:action.payload}}
    },
  },
}
