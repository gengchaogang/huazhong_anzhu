import { routerRedux } from 'dva/router'
import lodash from 'lodash';
import {
  renderSHSellTrackDataJSON,
  getNewTypeTrackJSONData,
} from '../../../../commons/utils/currencyFunction'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getOneReportTransInfo,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  postRelieveLoanApplyFetch,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseRelieveLoan'
import {
  isNull,
  checkJSON,
} from '../../../../commons/utils/currencyFunction'
const initState={
  transCode:null,
  trackJSON:null,
  loading:true,
  applyModal:{
    visible:false,
    houseInfo:null,
    auditorList:[],
    upLoadPicList:[],
  },
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'secondHouseRelieveLoan',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/secondHouseRelieveLoan') {
          dispatch({
            type:'doInitState',
          })
          if(!!location.state && !!location.state.transCode){
            dispatch({
              type:'getTrackInfo',
              payload:location.state.transCode,
            })
          }else{
            dispatch({
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
        }
      });
    },
  },
  effects:{
    //【贷款申请】获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          const trackObj=renderSHSellTrackDataJSON(trackDetail,payload);
          let totalPrice = null;
          try{
            totalPrice = getNewTypeTrackJSONData(trackObj,'意向房源').totalPrice;
          }catch(e){
            totalPrice = null
          }
          if(!!totalPrice){
            yield put({
              type:'initTrackData',
              payload:{
                trackJSON:trackObj,
                transCode:payload,
                totalPrice,
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'获取总价失败',
                okText:'确定',
                todo:'getOut',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              okText:'确定',
              todo:'getOut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取交易数据失败！',
            okText:'确定',
            todo:'getOut',
          },
        });
      }
    },
    //【解押申请】执行解押申请
    *postRelieveLoanApply({payload},{call,select,put}){
      const {transCode,applyModal:{auditorList,upLoadPicList}}=yield select(({secondHouseRelieveLoan})=>secondHouseRelieveLoan);
      if(auditorList.length===0 || transCode===null){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有必填信息填写完整',
            title:'申请贷款失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }else{
        let selectAuditorName;
        auditorList.map(item=>{
          if(item.id===payload.auditor){
            selectAuditorName=item.name;
          }
        })
        const {data}=yield call(postRelieveLoanApplyFetch,{
          ownerName:payload.ownerName,
          ownerPhone:payload.ownerPhone,
          loanAmount:payload.loanAmount,
          images:upLoadPicList.map(item=>item.id),
          toUserId:payload.auditor,
          toUserName:selectAuditorName,
          releaseMemo:payload.explain,
          transCode,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'申请解押成功！',
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
                title:'申请解押失败！',
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
              description:'请求失败，请联系管理员',
              title:'申请解押失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }
    },
    //【解押申请】组织模态框数据
    *getApplyLoanData({payload},{select,call,put}){
      const {transCode,trackJSON}=yield select(({secondHouseRelieveLoan})=>secondHouseRelieveLoan);
      if(!!transCode && !!trackJSON){
        const {data}=yield call(getAuditorList,{name:'二手房解押贷款办理'});
        if(!!data){
          if(data.status==='success'){
            console.log('22222',getNewTypeTrackJSONData(trackJSON,'意向房源'));
            yield put({
              type:'initApplyModal',
              payload:{
                visible:true,
                houseInfo:JSON.stringify(getNewTypeTrackJSONData(trackJSON,'意向房源')),
                auditorList:data.data.map(item=>({
                  name:item.name,
                  id:`${item.userId}`,
                })),
              }
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'获取审核人员失败',
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
              title:'获取审核人员失败',
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
            description:'未获得transCode',
            title:'获取交易数据失败',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ secondHouseRelieveLoan }) => secondHouseRelieveLoan.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'closeApplyModal':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'closeApplyModal'});
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
    initTrackData(state,action){
      return {...state,...action.payload,loading:false}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return{...state,promptObj:initState.promptObj}
    },
    changeUpLoadPicList(state,action){
      return{...state,applyModal:{...state.applyModal,upLoadPicList:action.payload}}
    },
    //【贷款申请】关闭模态框
    closeApplyModal(state,action){
      return {...state,applyModal:lodash.cloneDeep(initState).applyModal}
    },
    //【贷款申请】打开模态框
    initApplyModal(state,action){
      return {...state,applyModal:{...state.applyModal,...action.payload},loading:false}
    },
  },
}
