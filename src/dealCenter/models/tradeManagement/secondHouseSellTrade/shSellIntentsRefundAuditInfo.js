import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getIntentionRefundAuditRecord,
  checkRevokeRefundFetch,
} from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  isNull,
  checkJSON,
  isValid,
  renderAuditStatus,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
  applyId:null,
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
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  upLoadPicList:[],
  canRevoke:false,
  revokeRefundModal:{//撤回申请模态框
    visible:false,
    transCode:null,
    confirmLoading:false,
    title:'',
    type:'default',
  },
}
export default {
  namespace: 'shSellIntentsRefundAuditInfo',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/shSellIntentsRefundAuditInfo') {
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
      const {applyId,transCode}=payload;
      if(isValid(applyId) && isValid(transCode)){
        yield put({
          type:'getBasicData',
          payload:{
            transCode,
            applyId,
          },
        });
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
        type:'initBasicInfo',
        payload,
      });
      yield put({
        type:'getAuditRecodeData',
      });
    },
    //打开撤回退款模态框
    *readyRevokeApply({payload},{put,select}){
      const {transCode}=yield select(({shSellIntentsRefundAuditInfo})=>shSellIntentsRefundAuditInfo);
      yield put({
        type:'openRevokeRefundModal',
        payload:{
          visible:true,
          title:'撤回意向金退款申请',
          type:'intention',
          transCode,
        }
      })
    },
    //【发起撤回退款申请】
    *postRevokeRefundData({payload},{call,put}){
      yield put({
        type:'setRevokeRefundModalLoading',
        payload:true,
      })
      const {transCode,images,type,cancelReason}=payload;
      const {data}=yield call(checkRevokeRefundFetch(type),{
        cancelReason,
        images,
        transCode,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'撤回退款申请成功！',
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
              title:'撤回退款申请失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'',
            title:'撤回退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //获取审核信息
    *getAuditRecodeData({payload},{select,call,put}){
      const {applyId,current,status}=yield select(({shSellIntentsRefundAuditInfo})=>shSellIntentsRefundAuditInfo);
      const {data}=yield call(getIntentionRefundAuditRecord,{applyId,loadAllAutitRecord:true});
      console.log('data',data);
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
              unitPrice:renderUnitPriceStr(orderinfo.unitPrice,'-'),
              totalPrice:renderTotalMoneyStr(orderinfo.totalPrice,'-'),
              intentionAmount:`${isNull(orderinfo.amount,'-')}元`,
              payStatus:isNull(orderinfo.paymentStatus,'-'),
              transCode:isNull(orderinfo.transCode,null),
            },
            returnedInfo:[
              {
                label:'收款方',
                value:isNull(applyinfo.returnedToOwner,false)?'业主':'购房者',
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
              label:'业主身份证号',
              value:isNull(applyinfo.ownerIDNumber,'-'),
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
          //判断撤回状态
          let canRevoke = false;
          const auditStatus=renderAuditStatus('commons',isNull(applyinfo.auditStatus,''),'apply');
          canRevoke=auditStatus.canRevoke;
          const {current,status}=auditStatus;
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
          if(status==='error')stepList[current].description='已驳回';
          yield put({
            type:'initMainData',
            payload:{
              showDataInfo:JSON.stringify(showData),
              stepList,
              current,
              status,
              canRevoke,
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
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ shSellIntentsRefundAuditInfo }) => shSellIntentsRefundAuditInfo.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
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
      return{...state,promptObj:lodash.cloneDeep(initState).promptObj}
    },
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
    },
    initMainData(state,action){
      return {...state,...action.payload}
    },
    initBasicInfo(state,action){
      return {...state,...action.payload}
    },
    changeButtonLoading(state,action){
      return {...state,buttonLoading:action.payload}
    },
    //是否可撤回
    changeCanRevoke(state,action){
      return {...state,canRevoke:action.payload}
    },//【撤回申请模态框】打开模态框
    openRevokeRefundModal(state,action){
      return {...state,revokeRefundModal:{...action.payload,confirmLoading:false}}
    },
    //【撤回申请模态框】关闭模态框
    closeRevokeRefund(state,action){
      return {...state,revokeRefundModal:lodash.cloneDeep(initState).revokeRefundModal}
    },
    //【撤回申请模态框】切换loading
    setRevokeRefundModalLoading(state,action){
      return {...state,revokeRefundModal:{...state.revokeRefundModal,confirmLoading:action.payload}}
    },
  },
}
