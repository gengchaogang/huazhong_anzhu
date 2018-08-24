import { routerRedux } from 'dva/router'
import {
  getGroupBuyRefundInfo,
  revokeGroupBuyRefundApplyFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade'
import {
  isNull,
  checkJSON,
  renderNHGroupBuyRefundAuditData,
} from '../../../../commons/utils/currencyFunction'
import lodash from 'lodash';
const initState={
  showDataInfo:null,
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
  groupKey:null,
  groupBuyId:null,
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
  confirmModal:{//撤回退款
    title:null,
    visible:false,
    description:null,
    okText:null,
    cancelText:null,
  },
}
export default {
  namespace: 'nhGroupBuyRefundAuditInfo',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo') {
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
          type:'initBasicInfo',
          payload:{
            groupKey:payload.groupKey,
            groupBuyId:payload.groupBuyId,
          },
        })
        yield put({
          type:'getBasicData',
          payload:{
            groupKey:payload.groupKey,
            groupBuyId:payload.groupBuyId,
          },
        });
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'未获得groupBuyId',
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
        payload,
      });
      yield put({
        type:'getAuditRecodeData',
        payload,
      });
    },
    //【发起撤回退款申请】
    *postRevokeRefundData({payload},{call,put}){
      yield put({
        type:'setRevokeRefundModalLoading',
        payload:true,
      })
      const {groupBuyId,images,type,cancelReason}=payload;
      const {data}=yield call(revokeGroupBuyRefundApplyFetch(type),{
        cancelReason,
        images,
        groupBuyId,
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
      const {data}=yield call(getGroupBuyRefundInfo,{id:payload.groupBuyId,role:'trader'})
      if(!!data && data.status==='success'){
        const showData = renderNHGroupBuyRefundAuditData(data.data,payload.groupKey,'applyer');
        yield put({
          type:'initMainData',
          payload:{
            showDataInfo:JSON.stringify(showData),
            stepList:showData.auditStatus.stepList,
            current:showData.auditStatus.current,
            status:showData.auditStatus.status,
            canRevoke:showData.canRevoke,
            canAudit:showData.canAudit,
            canReApply:showData.canReApply,
          }
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败！'),
            title:'获取退款信息失败！',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //撤回退款申请
    *onOkComfirmModal({payload},{select,call,put}){
      console.log('撤回退款申请');
      const {groupBuyId}=yield select(({nhGroupBuyRefundAuditInfo})=>nhGroupBuyRefundAuditInfo);
      const {data} = yield call(revokeGroupBuyRefundApplyFetch,{groupbuyId:groupBuyId,});
      if(!!data && data.status==='success' && !!data.data){
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
            description:isNull(data.message,'请求失败！'),
            title:'撤回退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ nhGroupBuyRefundAuditInfo }) => nhGroupBuyRefundAuditInfo.promptObj);
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
    //【确认模态框】关闭
    closeComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,visible:false}}
    },
    //【确认模态框】关闭后回调
    afterCloseComfirmModal(state,action){
      return {...state,confirmModal:lodash.cloneDeep(initState).confirmModal}
    },
    //【确认模态框】打开模态框
    openComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,...action.payload}}
    },
    openRevokeComfirmModal(state,action){
      return {...state,confirmModal:{
        title:'撤回退款',
        visible:true,
        description:'确认撤回退款申请？',
        okText:'确定',
        cancelText:'取消',
      }}
    },
  },
}
