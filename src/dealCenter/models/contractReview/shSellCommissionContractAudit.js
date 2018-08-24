import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../services/userFetch'
import {
  getCommissionRefundAuditRecord,
} from '../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  shSellCommissionContractAuditPassFetch,
  shSellCommissionContractAuditRejectFetch,
} from '../../services/contractReview/shContractAudit'
import {
  isNull,
  isNullRate,
  checkJSON,
  isValid,
  renderAuditStatus,
  renderSHAduitRequestAgr,
} from '../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderMoneyStr,
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
  namespace: 'shSellCommissionContractAudit',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/contractReview/secondHandHouseSalesAudit/shSellCommissionContractAudit') {
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
      const {data}=yield call(getCommissionRefundAuditRecord,{applyId:payload});
      if(!!data){
        if(data.status==='success'){
          const {orderinfo,applyinfo,auditinfos}=data.data;
          const showData={
            orderInfo:{
              orderNumber:isNull(orderinfo.orderNumber,'-'),
              payWay:isNull(orderinfo.paymentMethod ,'-'),
              paySerialNumber:isNull(orderinfo.serialNumber,'-'),
              payTime:isNull(orderinfo.paymentDateTime,'-'),
              undertaker:isNull(orderinfo.undertaker,'-'),
              undertakerPhone:isNull(orderinfo.undertakerPhone,'-'),
              totalPrice:renderTotalMoneyStr(orderinfo.totalPrice),
              commissionRatio:isNullRate(orderinfo.commissionRate),
              commissionAmount:renderMoneyStr(orderinfo.commissionAmount),
              payStatus:isNull(orderinfo.paymentStatus,'-'),
              transCode:isNull(orderinfo.transCode,null),
            },
            applyInfo:{
              formData:[
                {
                  label:'退款金额',
                  value:`${isNull(applyinfo.refundCommissionAmount,'')}元`,
                },{
                  label:'退款原因',
                  value:isNull(applyinfo.refundReason,'-'),
                },{
                  label:'退款方式',
                  value:'同卡同出',
                }
              ],
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
          //判断审核状态
          let canAudit = true;
          const auditStatus=renderAuditStatus('commons',isNull(applyinfo.auditStatus,''),'contract');
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
      if(payload==='pass'){
        yield put({type:'changeComponentLoading',payload:true});
        const {data}=yield call(getAuditorList,{name:'二手房退款财务审核'});
        if(!!data && data.status==='success' && data.data.length!==0){
          const auditorList=data.data.map(item=>({
            name:item.name,
            id:`${item.userId}`,
          }));
          yield put({
            type:'openAuditModal',
            payload:{
              visible:true,
              todo:payload,
              auditorList,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:isNull(data.message,'请求失败'),
              title:'获取审核人员列表失败！',
              okText:'确定',
              todo:'changeLoading',
            },
          })
        }
      }else{
        yield put({
          type:'openAuditModal',
          payload:{
            visible:true,
            todo:payload,
          }
        })
      }
    },
    //执行审核
    *doAudit({payload},{select,call,put}){
      yield put({
        type:'changeAuditModalLoading',
        payload:true,
      })
      const {todo}=payload;
      const {recordId}=yield select(({shSellCommissionContractAudit})=>shSellCommissionContractAudit);
      const {data}=yield call((todo==='pass'?shSellCommissionContractAuditPassFetch:shSellCommissionContractAuditRejectFetch),{...renderSHAduitRequestAgr(payload),recordId,});
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
      const {promptObj:{todo,},recordId,applyId,} = yield select(({ shSellCommissionContractAudit }) => shSellCommissionContractAudit);
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