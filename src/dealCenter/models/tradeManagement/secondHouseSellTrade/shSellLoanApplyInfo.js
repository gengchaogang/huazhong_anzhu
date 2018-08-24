import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getLoanAuditRecord,
  checkRevokeRefundFetch,
} from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  isNull,
  checkJSON,
  isValid,
  renderAuditStatus,
  isNullRate,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderResoucesAreaStr,
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
  applyId:null,
  status:'process',
  stepList:[
    {
      title:'申请解押'
    },{
      title:'办理贷款'
    },{
      title:'已批款'
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
  namespace: 'shSellLoanApplyInfo',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo') {
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
      const {transCode}=yield select(({shSellLoanApplyInfo})=>shSellLoanApplyInfo);
      yield put({
        type:'openRevokeRefundModal',
        payload:{
          visible:true,
          title:'撤回贷款申请',
          type:'loan',
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
              title:'撤回贷款申请成功！',
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
              title:'撤回贷款申请失败！',
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
      const {applyId,current,status}=yield select(({shSellLoanApplyInfo})=>shSellLoanApplyInfo);
      const {data}=yield call(getLoanAuditRecord,{applyId,loadAllAutitRecord:true});
      console.log('data',data);
      if(!!data){
        if(data.status==='success'){
          const {applyinfo,auditinfos}=data.data;
          let houseInfo=null;
          try{
            houseInfo=JSON.parse(applyinfo.resourcesInfo).default;
          }catch(e){
            houseInfo=null;
          }
          const showData={
            orderInfo:{
              propertyType:isNull(applyinfo.propertyType,'-'),
              communityName:isNull(applyinfo.communityName,'-'),
              houseInfo:isNull(houseInfo,'-'),
              resourceArea:renderResoucesAreaStr(applyinfo.resourceArea,'-'),
              totalPrice:renderTotalMoneyStr(applyinfo.totalPrice,'-'),
              unitPrice:renderUnitPriceStr(applyinfo.commissionUnitPrice,'-'),
              resourceSupportLoan:isNull(applyinfo.resourceSupportLoan,false),
              applyTime:isNull(applyinfo.applyDateTime,'-'),
            },
            loanInfo:[
              {
                label:'贷款客户',
                value:isNull(applyinfo.customerName,'-'),
              },{
                label:'贷款人联系电话',
                value:isNull(applyinfo.customerPhone,'-'),
              },{
                label:'贷款类型',
                value:isNull(applyinfo.loanType,'-'),
              },{
                label:'贷款比例',
                value:isNullRate(applyinfo.loanRate,'-'),
              },{
                label:'贷款金额',
                value:renderTotalMoneyStr(applyinfo.loanAmount,'-'),
              },{
                label:'贷款期限',
                value:isNull(applyinfo.loanTerm,'-'),
              }
            ],
            // applyInfo:{
            //   reason:isNull(applyinfo.reason,''),
            //   applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
            //     title:'',
            //     src:item,
            //     id:`PicKey_${index}`
            //   })),
            // },
            auditInfo:isNull(auditinfos,[]).map(item=>({
              time:isNull(item.auditDateTime,'-'),
              content:isNull(item.auditInfo,'-'),
              remarks:`说明：${isNull(item.reason,'-')}`,
              pics:isNull(item.images,null),
              isReject:isNull(item.auditInfo,'-').indexOf('驳回')!=-1,
            })),
            compeleInfo:[],
          }
          if(!!applyinfo.firstPayMentPaid){
            showData.compeleInfo.push('首付款已支付')
          }
          if(!!applyinfo.intentionPaid){
            showData.compeleInfo.push('意向金已支付')
          }
          if(!!applyinfo.commissionPaid){
            showData.compeleInfo.push('中介佣金已支付')
          }
          //判断撤回状态
          let canRevoke = false;
          const auditStatus=renderAuditStatus('sellLoan',isNull(applyinfo.auditStatus,''),'apply');
          canRevoke=auditStatus.canRevoke;
          const {current,status}=auditStatus;
          const stepList=[
            {
              title:'申请贷款'
            },{
              title:'办理贷款'
            },{
              title:'已批款'
            }
          ];
          if(status==='error')stepList[current].description='已驳回';
          yield put({
            type:'initMainData',
            payload:{
              showDataInfo:JSON.stringify(showData),
              stepList,
              status,
              current,
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
      const {todo} = yield select(({ shSellLoanApplyInfo }) => shSellLoanApplyInfo.promptObj);
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
