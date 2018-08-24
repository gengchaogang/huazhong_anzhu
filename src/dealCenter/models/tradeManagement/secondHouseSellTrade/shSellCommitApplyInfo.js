import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getCommitAuditRecord,
  checkRevokeRefundFetch,
} from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  isNull,
  isNullRate,
  checkJSON,
  isValid,
  creatHouseInfo,
  renderAuditStatus,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
  renderMoneyStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
  applyId:null,
  status:'process',
  stepList:[
    {
      title:'申请成交'
    },{
      title:'成交审核'
    },{
      title:'财务审核'
    },{
      title:'分佣'
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
  canReApply:false,
  revokeRefundModal:{//撤回申请模态框
    visible:false,
    transCode:null,
    confirmLoading:false,
    title:'',
    type:'default',
  },
}
export default {
  namespace: 'shSellCommitApplyInfo',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo') {
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
      const {transCode}=yield select(({shSellCommitApplyInfo})=>shSellCommitApplyInfo);
      yield put({
        type:'openRevokeRefundModal',
        payload:{
          visible:true,
          title:'撤回成交申请',
          type:'commit',
          transCode,
        }
      })
    },
    //【发起撤回成交申请】
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
              title:'撤回成交申请成功！',
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
              title:'撤回成交申请失败！',
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
            title:'撤回成交申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //获取审核信息
    *getAuditRecodeData({payload},{select,call,put}){
      const {applyId,current,status}=yield select(({shSellCommitApplyInfo})=>shSellCommitApplyInfo);
      const {data}=yield call(getCommitAuditRecord,{applyId,loadAllAutitRecord:true});
      console.log('data',data);
      if(!!data){
        if(data.status==='success'){
          const {orderinfo,applyinfo,auditinfos}=data.data;
          const showData={
            orderInfo:{
              houseInfo:creatHouseInfo(applyinfo.resourcesInfo),
              propertyType:isNull(applyinfo.propertyType,'-'),
              resourceArea:`${isNull(applyinfo.resourceArea,'-')}㎡`,
              unitPrice:renderUnitPriceStr(applyinfo.pirce,'-'),
              totalPrice:renderTotalMoneyStr(applyinfo.totalPrice,'-'),
              commissionAmount:`${isNull(applyinfo.commissionAmount,'-')}元`,
              ownBroker:isNull(applyinfo.brokerName,'-'),
              customerBroker:isNull(applyinfo.customerBrokerName,'-'),
              commitDate:isNull(applyinfo.applyDateTime,'-'),
              transCode:isNull(applyinfo.transCode,null),
            },
            commitInfo:[
              {
                label:'佣金总额',
                value:renderMoneyStr(applyinfo.commissionAmount,'-'),
              },{
                label:'平台抽佣',
                value:isNullRate(applyinfo.platformCommissionRate,'-'),
              },{
                label:'剩余佣金总额',
                value:renderMoneyStr(`${(1-Number(applyinfo.platformCommissionRate))*Number(applyinfo.commissionAmount)}`),
              },{
                label:'成交方式',
                value:isNull(applyinfo.transactionMode,''),
              }
            ],
            applyInfo:{
              reason:isNull(applyinfo.memo,''),
              applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
                title:'',
                src:item,
                id:`PicKey_${index}`
              })),
            },
            auditInfo:isNull(auditinfos,[]).map(item=>({
              time:isNull(item.auditDateTime,'-'),
              content:isNull(item.auditInfo,'-'),
              remarks:`说明：${isNull(item.reason,'-')}`,
              pics:isNull(item.images,null),
              isReject:isNull(item.auditInfo,'-').indexOf('驳回')!=-1,
            })),
            compeleInfo:[],
            releaseInfo:[],
            ownerInfo:[],
          }
          //判断是否是失败成交
          if(isNull(applyinfo.transactionFailure,false)){
            showData.commitInfo.push({
              label:'成交类型',
              value:'失败成交',
            })
            showData.commitInfo.push({
              label:'失败成交原因',
              value:isNull(applyinfo.transactionFailureReason,''),
            })
          }
          //成交佣金分配
          if(applyinfo.transactionMode==='合作成交'){
            if(isNull(applyinfo.customerBrokerCommissionRate,0) == 0){
              //固定金额
              showData.commitInfo.push({
                label:'业主经纪人佣金金额',
                value:renderMoneyStr(applyinfo.brokerCommissionAmount,'-'),
              })
              showData.commitInfo.push({
                label:'买方经纪人佣金金额',
                value:renderMoneyStr(applyinfo.customerBrokerCommissionAmount,'-'),
              })
            }else{
              showData.commitInfo.push({
                label:'业主经纪人佣金比例',
                value:isNullRate(applyinfo.brokerCommissionRate,'-'),
              })
              showData.commitInfo.push({
                label:'业主经纪人佣金金额',
                value:renderMoneyStr(applyinfo.brokerCommissionAmount,'-'),
              })
              showData.commitInfo.push({
                label:'买方经纪人佣金比例',
                value:isNullRate(applyinfo.customerBrokerCommissionRate,'-'),
              })
              showData.commitInfo.push({
                label:'买方经纪人佣金金额',
                value:renderMoneyStr(applyinfo.customerBrokerCommissionAmount,'-'),
              })
            }
          }else{
            showData.commitInfo.push({
              label:'经纪人佣金比例',
              value:isNullRate(applyinfo.brokerCommissionRate,'-'),
            })
            showData.commitInfo.push({
              label:'经纪人佣金金额',
              value:renderMoneyStr(applyinfo.brokerCommissionAmount,'-'),
            })
          }
          //已完成业务
          if(!!applyinfo.firstpaymentComplete){
            showData.compeleInfo.push('首付款已支付')
          }
          if(!!applyinfo.intentionComplete){
            showData.compeleInfo.push('意向金已支付')
          }
          if(!!applyinfo.commissionComplete){
            showData.compeleInfo.push('中介佣金已支付')
          }
          if(!!applyinfo.loanComplete){
            showData.compeleInfo.push('购房贷款')
          }
          if(!!applyinfo.transferComplete){
            showData.compeleInfo.push('购房过户')
          }
          let releaseInfosArr=null;
          try {
            releaseInfosArr=JSON.parse(applyinfo.releaseInfos);
          } catch (e) {
            releaseInfosArr=null;
          }
          //资金释放
          if(!!releaseInfosArr && releaseInfosArr.length!==0){
            let showOwner=false;
            releaseInfosArr.map(item=>{
              showData.releaseInfo.push({
                label:'资金释放类型',
                value:isNull(item.releaseType,'-'),
              })
              showData.releaseInfo.push({
                label:'资金释放金额',
                value:renderMoneyStr(item.releaseAmount,'-'),
              })
              showData.releaseInfo.push({
                label:'收款方',
                value:isNull(item.releaseOwner,false)?'业主':'购房者',
              })
              if(isNull(item.releaseOwner,false)){
                showOwner=true;
              }
            })
            if(showOwner){
              showData.ownerInfo.push({
                label:'业主姓名',
                value:isNull(applyinfo.ownerName,'-'),
              })
              showData.ownerInfo.push({
                label:'业主电话',
                value:isNull(applyinfo.ownerPhone,'-'),
              })
              showData.ownerInfo.push({
                label:'业主开户行',
                value:isNull(applyinfo.ownerBank,'-'),
              })
              showData.ownerInfo.push({
                label:'业主开户所属省市',
                value:`${isNull(applyinfo.ownerBankProvince,'-')}/${isNull(applyinfo.ownerBankCity,'-')}`,
              })
              showData.ownerInfo.push({
                label:'业主开户行支行',
                value:isNull(applyinfo.ownerSubbranch,'-'),
              })
              showData.ownerInfo.push({
                label:'业主银行卡号',
                value:isNull(applyinfo.ownercardNumber,'-'),
              })
            }
          }
          //判断撤回状态
          let canRevoke = false;
          let canReApply = false;
          const auditStatus=renderAuditStatus('commit',isNull(applyinfo.auditStatus,''),'apply');
          canRevoke = auditStatus.canRevoke;
          canReApply = auditStatus.canReApply;
          const {current,status}=auditStatus;
          const stepList=[
            {
              title:'申请成交',
            },{
              title:'成交审核',
            },{
              title:'财务审核',
            },{
              title:'分佣',
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
              canReApply,
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
      const {todo} = yield select(({ shSellCommitApplyInfo }) => shSellCommitApplyInfo.promptObj);
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
