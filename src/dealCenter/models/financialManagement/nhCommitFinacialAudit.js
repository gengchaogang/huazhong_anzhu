import { routerRedux } from 'dva/router'
import {
  getAuditorList,
}from '../../services/userFetch'
import {
  getNHCommitAuditStatusFetch,
} from '../../services/tradeManagement/newHouseTrade/newHouseTrade'
import {
  getTransactionOrderInfoDataFetch,
}from '../../services/tradeManagement/newHouseTrade/creatTransactions'
import {
  nhCommitFinacialAuditPassFetch,
  nhCommitFinacialAuditRejectFetch,
} from '../../services/financialManagement/nhFinacialAudit'
import {
  isNull,
  checkJSON,
  creatNHCommitAuditInfoData,
} from '../../../commons/utils/currencyFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
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
      title:'执行分佣'
    }
  ],
  current:0,
  applyId:null,
  groupKey:null,
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
  namespace: 'nhCommitFinacialAudit',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/financialManagement/newHouseElectricityExamination/nhCommitFinacialAudit') {
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
      if(!!payload && !!payload.groupKey && !!payload.applyId){
        yield put({
          type:'initBasicInfo',
          payload:{
            groupKey:payload.groupKey,
            applyId:payload.applyId,
          },
        })
        yield put({
          type:'getAuditRecodeData',
          payload:{
            groupKey:payload.groupKey,
          },
        });
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
    //获取审核信息
    *getAuditRecodeData({payload},{put,call}){
      const {data} = yield call(getTransactionOrderInfoDataFetch,{groupKey:payload.groupKey})
      if(!!data && data.status === 'success'){
        const showData = creatNHCommitAuditInfoData(data.data,'financialer')
        console.log('showData',showData);
        yield put({
          type:'initMainData',
          payload:{
            showDataInfo:JSON.stringify(showData),
            stepList:showData.auditStatus.stepList,
            current:showData.auditStatus.current,
            status:showData.auditStatus.status,
            canRevoke:showData.canRevoke,
            canAudit:showData.canAudit,
          }
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败！'),
            title:'获取成交信息失败！',
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
      const {applyId}=yield select(({nhCommitFinacialAudit})=>nhCommitFinacialAudit);
      const auditRequestAgr = {
        auditResultDesc:payload.reason,
        auditResultFile:JSON.stringify(isNull(payload.images,[])),
        id:applyId,
        oprationPwd:isNull(payload.optPassword,'null'),
      };
      const {data}=yield call((todo==='pass'?nhCommitFinacialAuditPassFetch:nhCommitFinacialAuditRejectFetch),auditRequestAgr);
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
      const {promptObj:{todo,},applyId,groupKey,} = yield select(({ nhCommitFinacialAudit }) => nhCommitFinacialAudit);
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
            applyId,
            groupKey,
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
    initBasicInfo(state,action){
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
