import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../services/userFetch'
import {
  getCommitAuditRecord,
} from '../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  shSellCommitFinanceAuditPassFetch,
  shSellCommitFinanceAuditRejectFetch,
} from '../../services/financialManagement/shFinaceAudit'
import {
  isNull,
  isNullRate,
  checkJSON,
  isValid,
  renderAuditStatus,
  creatHouseInfo,
  renderSHAduitRequestAgr,
} from '../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderMoneyStr,
  renderUnitPriceStr,
  renderResoucesAreaStr,
  floorTwoNumber,
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
  namespace: 'shSellCommitFinanceAudit',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/financialManagement/secondHouseSellExamine/shSellCommitFinanceAudit') {
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
      });
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
      const {data}=yield call(getCommitAuditRecord,{applyId:payload});
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
              commissionAmount:renderMoneyStr(applyinfo.commissionAmount),
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
                value:renderMoneyStr(floorTwoNumber(`${(1-Number(applyinfo.platformCommissionRate))*Number(applyinfo.commissionAmount)}`)),
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
            // showData.commitInfo.push({
            //   label:'经纪人佣金比例',
            //   value:isNullRate(applyinfo.brokerCommissionRate,'-'),
            // })
            showData.commitInfo.push({
              label:'经纪人佣金金额',
              value:renderMoneyStr(applyinfo.brokerCommissionAmount,'-'),
            })
          }
          //已完成业务
          // if(!!applyinfo.firstpaymentComplete){
          //   showData.compeleInfo.push('首付款已支付')
          // }
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
                value:renderMoneyStr(item.releaseAmount),
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
          //判断审核状态
          let canAudit = true;
          const auditStatus=renderAuditStatus('commit',isNull(applyinfo.auditStatus,''),'finance');
          const stepList=[
            {
              title:'申请成交'
            },{
              title:'成交审核'
            },{
              title:'财务审核'
            },{
              title:'分佣'
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
              transCode:isNull(applyinfo.transCode,null),
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
      const {recordId}=yield select(({shSellCommitFinanceAudit})=>shSellCommitFinanceAudit);
      const {data}=yield call((todo==='pass'?shSellCommitFinanceAuditPassFetch:shSellCommitFinanceAuditRejectFetch),{...renderSHAduitRequestAgr(payload),recordId,});
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
      const {promptObj:{todo,},recordId,applyId,} = yield select(({ shSellCommitFinanceAudit }) => shSellCommitFinanceAudit);
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
