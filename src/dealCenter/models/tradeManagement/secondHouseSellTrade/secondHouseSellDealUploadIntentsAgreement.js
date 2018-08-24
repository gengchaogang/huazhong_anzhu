import { routerRedux } from 'dva/router'
import lodash from 'lodash';
import {
  renderSHSellTrackDataJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  uploadIntentsAgreementFetch,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadIntentsAgreement'



const initState={
  transCode:null,
  trackJSON:null,
  loading:true,
  upLoadPicList:[],
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'secondHouseSellDealUploadIntentsAgreement',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }){
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadIntentsAgreement'){
          dispatch({
            type:'doInitComponent',
            payload:location.state,
          })
        }
      })
    }
  },
  effects:{
    //初始化组件状态
    *doInitComponent({payload},{put}){
      yield put({
        type:'doInitState',
      })
      if(!!payload && !!payload.transCode){
        yield put({
          type:'getTrackInfo',
          payload:payload.transCode,
        })
      }else{
        yield put({
          type:'switchPrompt',
          payload:{
            visible:true,
            description:'未获得transCode',
            title:'获取交易数据失败',
            okText:'确定',
            todo:'getOut',
          }
        })
      }
    },
    //获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON:renderSHSellTrackDataJSON(trackDetail,payload),
              transCode:payload,
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              okText:'确定',
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
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ secondHouseSellDealUploadIntentsAgreement }) => secondHouseSellDealUploadIntentsAgreement.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        case 'goIndex':
          yield put(routerRedux.push('/tradeManagement/secondHouseSellTrade'));
          break;
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    //执行上传意向金合同
    *doUpLoad({payload},{select,call,put}){
      const {upLoadPicList,transCode}=yield select(({secondHouseSellDealUploadIntentsAgreement})=>secondHouseSellDealUploadIntentsAgreement);
      if(upLoadPicList.length===0 || !transCode){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有信息填写完整！',
            title:'上传意向金合同失败！',
            okText:'确定',
            todo:'default',
          },
        });
      }else{
        const{data}=yield call(uploadIntentsAgreementFetch,{
          contracts:upLoadPicList.map(item=>item.id),
          transCode,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                title:'上传意向金合同成功！',
                okText:'确定',
                todo:'goIndex',
              },
            });
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'上传意向金合同失败！',
                okText:'确定',
                todo:'default',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'上传意向金合同失败！',
              okText:'确定',
              todo:'default',
            },
          });
        }
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
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
    },
  },
}