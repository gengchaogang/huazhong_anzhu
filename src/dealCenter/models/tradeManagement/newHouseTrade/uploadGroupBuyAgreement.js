import { routerRedux } from 'dva/router'
import lodash from 'lodash';
import {
  uploadGroupBuyAgreementFetch,
} from '../../../services/tradeManagement/newHouseTrade/uploadGroupBuyAgreement';
import {
  renderNHTrackDataJSON,
  isNull,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
const initState={
  groupKey:null,
  groupBuyId:null,
  trackJSON:null,
  loading:true,
  projectInfo:null,
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
  namespace: 'uploadGroupBuyAgreement',
  state: lodash.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/uploadGroupBuyAgreement') {
          dispatch({
            type:'doInitState',
          })
          if(!!location.state.groupKey && !!location.state.groupBuyId){
             dispatch({
               type:'getProjectInfoData',
               payload:location.state.projectId,
             })
            dispatch({
              type:'getTrackInfo',
              payload:{
                groupKey:location.state.groupKey,
                groupBuyId:location.state.groupBuyId,
              }
            })
          }
        }
      });
    },
  },
  effects:{
    //获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {groupKey,groupBuyId}=payload;
      yield put({
        type:'setGroupInfo',
        payload:{
          groupKey,
          groupBuyId,
        }
      })
      const {data}=yield call(getTrackInfoFetch,{groupKey:groupKey})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:renderNHTrackDataJSON(data.data),
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
    //获取项目简要信息
    *getProjectInfoData({payload},{call,put}){
      console.log('payload',payload);
      const {data}=yield call(getProjectDetailFetch,{id:payload});
      if(!!data){
        if(data.status==='success'){
          const projectData=data.data;
          if(isNull(projectData.isOffProject,false)){
            clearProjectInfoInStorage()
            yield put(routerRedux.push({
              pathname:'/indexPage'
            }))
          }else{
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
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目信息失败',
              okText:'确定',
              todo:'goTradeIndex',
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
            todo:'goTradeIndex',
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {promptObj:{todo,},groupKey} = yield select(({ uploadGroupBuyAgreement }) => uploadGroupBuyAgreement);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        case 'goTradeIndex':
          yield put(routerRedux.push({
            pathname:'/tradeManagement/newHouseTrade',
          }));
          break;
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    *doUpLoad({payload},{select,call,put}){
      const{groupBuyId,upLoadPicList}=yield select(({uploadGroupBuyAgreement})=>uploadGroupBuyAgreement);
      if(upLoadPicList.length===0 ||groupBuyId==null){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请上传图片',
            title:'你未上传图片！',
            todo:'default',
            okText:'确定',
          },
        })
      }else{
        const agreementPics=upLoadPicList.map(item=>item.id);
        const {data}=yield call(uploadGroupBuyAgreementFetch,{
          agreementPics,
          groupbuyId:groupBuyId,
        })
        if(!!data){
          if(data.status==='success'){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'上传成功！',
                todo:'goTradeIndex',
                okText:'确定',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'上传失败！',
                todo:'default',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败,请联系管理员',
              title:'上传失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }
    },
  },
  reducers: {
    doInitState(state,action){
      return lodash.cloneDeep(initState);
    },
    setGroupInfo(state,action){
      return {...state,...action.payload}
    },
    initTrackData(state,action){
      return {...state,trackJSON:action.payload,loading:false}
    },
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
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
