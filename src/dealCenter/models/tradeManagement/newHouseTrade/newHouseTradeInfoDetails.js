import { routerRedux } from 'dva/router'
import {
  renderNHTrackDataJSON,
  getProjectInfoInStorage,
  isNull,
  getNewTypeTrackJSONData,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
const initState={
  groupKey:null,
  trackJSON:null,
  projectInfo:null,
  loading:true,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'newHouseTradeInfoDetails',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/newHouseTradeInfoDetails') {
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
      // yield put({
      //   type:'getProjectInfoData',
      //   payload:getProjectInfoInStorage().projectId,
      // })
      if(!!payload.groupKey){
        yield put({
          type:'getTrackInfo',
          payload:payload.groupKey,
        })
      }else{
        yield put({
          visible:true,
          description:'未获得groupKey',
          title:'获取交易数据失败',
          okText:'确定',
          todo:'getOut',
        })
      }
    },
    //获取项目简要信息
    *getProjectInfoData({payload},{call,put}){
      const {data}=yield call(getProjectDetailFetch,{id:payload});
      if(!!data){
        if(data.status==='success'){
          const projectData=data.data;
          const projectInfo={
            name:isNull(projectData.name,''),
            img:isNull(projectData.isCoverPicPaths,''),
            basicInfos:[
              {
                label:'项目负责人',
                value:isNull(projectData.contact,''),
              },{
                label:'联系电话',
                value:isNull(projectData.phone,''),
              }
            ],
            tradeInfos:[
              {
                label:'已售团购',
                value:`${isNull(projectData.discount,'0')}套`,
              },{
                label:'已成交',
                value:`${isNull(projectData.transactionsNumber,'0')}套`,
              },{
                label:'剩余套数',
                value:`${isNull(projectData.laveNumber,'0')}套`,
              },{
                label:'团购优惠结束时间',
                value:isNull(projectData.endOfProjectActivity,'-'),
              }
            ],
          }
          yield put({
            type:'updateProjectInfo',
            payload:JSON.stringify(projectInfo),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目信息失败',
              okText:'确定',
              todo:'other',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取项目信息失败',
            okText:'确定',
            todo:'other',
          },
        });
      }
    },
    //获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          const trackJSON = renderNHTrackDataJSON(data.data);
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON,
              groupKey:payload,
            },
          })
          yield put({
            type:'getProjectInfoData',
            payload:getNewTypeTrackJSONData(trackJSON,'意向项目').id,
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
      const {todo} = yield select(({ newHouseTradeInfoDetails }) => newHouseTradeInfoDetails.promptObj);
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
      return initState;
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
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
  },
}
