import { routerRedux } from 'dva/router'
import {
  renderNHTrackDataJSON,
  judgeResponse,
  treeMenuMap,
  isValid,
  isNull,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'

import {
  searchHouseFetch,
  // getProjectHousesIntentionFetch,
  postCustomerDolookFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatClient'
import {
  getProjectHousesIntentionSellFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatGroupBuy'
import {
  reportDoVisitFetch,
  addDoVisitFetch,
}from '../../../services/tradeManagement/newHouseTrade/customerDoLook'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
const initState={
  loading:true,
  groupKey:null,
  houseTreeData:null,
  projectInfo:null,
  houseTreeMap:new Map(),
  selectHouseKey:[],
  showHouseObj:{
    picUrl:'',
    id:'defalut',
    areaInfo:'',
    priceInfo:'',
    cellStatus:'',
  },
  type:'default',
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  transactionDetails:null,
  visitRemarks:'',
  trackJSON:null,
}
export default {
  namespace: 'customerDoLook',
  state: initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/newHouseTrade/customerDoLook'){
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
      yield put({type:'doInitState'});
      if(isValid(payload) && isValid(payload.groupKey)){
        yield put({
          type:'getProjectInfoData',
          payload:payload.projectId,
        })
        if(payload.hasIntentHouse){
          //有意向房源
          yield put({
            type:'setGroupKey',
            payload:payload.groupKey,
          })
          yield put({
            type:'findTrackByGroupKey',
            payload:payload.groupKey,
          });
        }else{
          //没有意向房源
          yield put({
            type:'setGroupKeyNoHouse',
            payload:{
              groupKey:payload.groupKey,
              projectId:payload.projectId,
            },
          })
          yield put({
            type:'findTrackByGroupKey',
            payload:payload.groupKey,
          });
        }
      }else{
        yield put({
          type: 'notGetGroupId',
          payload:{
            visible:true,
            content:'请联系管理员',
            title:'获取groupKey失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    //获取项目简要信息
    *getProjectInfoData({payload},{call,put}){
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
    //初始化组件，无意向房源
    *setGroupKeyNoHouse({payload},{put,call}){
      yield put({
        type:'initNoHouseType',
        payload:{
          groupKey:payload.groupKey,
          type:'noHouse',
        }
      })
      yield put({
        type:'getProjectHousesIntention',
        payload:payload.projectId,
      })
    },
    //获取客户意向房源数据
    *getProjectHousesIntention({payload},{call,put}){
      const {data}=yield call(getProjectHousesIntentionSellFetch,{projectId:payload});
      if(!!data){
        if(data.status==='success'){
          const areaMap=new Map();
          const intentionMap=new Map();
          const areaSet=new Set();
          const result=data.data;
          result.map(item=>{
            areaSet.add(`${item.area}/${item.buildingNumber}/${item.unit}/${item.roomNumber}`);
            intentionMap.set(`${item.area}/${item.buildingNumber}/${item.unit}/${item.roomNumber}`,{
              area:item.area,
              bathRoom:item.bathRoom,
              buildingNumber:item.buildingNumber,
              cookRoom:item.cookRoom,
              floorArea:item.floorArea,
              housePic:item.housePic,
              houseRoom:item.houseRoom,
              houseTypeName:item.houseTypeName,
              id:item.id,
              isLead:item.isLead,
              livingRoom:item.livingRoom,
              price:item.price,
              projectId:item.projectId,
              roomNumber:item.roomNumber,
              state:item.state,
              totalPrice:item.totalPrice,
              unit:item.unit,
            })
          })
          areaSet.forEach((value, key)=>{
            value.split('/').reduce((prev,next,index,arr)=>{
              if(index===0){
                areaMap.set(next,{
                  key:next,
                  parentKey:'root',
                  title:arr[index],
                });
                return next;
              }else if(index===arr.length-1){
                areaMap.set(`${prev}/${next}`,{
                  key:`${prev}/${next}`,
                  parentKey:prev,
                  title:arr[index],
                });
              }else{
                areaMap.set(`${prev}/${next}`,{
                  key:`${prev}/${next}`,
                  parentKey:prev,
                  title:arr[index],
                });
                return `${prev}/${next}`;
              }
            },'');
          });
          const treeArr=[];
          areaMap.forEach((areaItem,key)=>{
            treeArr.push({
              label:areaItem.title,
              value:areaItem.title,
              key:areaItem.key,
              parentKey:areaItem.parentKey,
            });
          });
          const treeObj=new treeMenuMap(treeArr).init('root');
          yield put({
            type:'initHouseTreeData',
            payload:{
              houseTreeData:treeObj.treeArr,
              houseTreeMap:intentionMap,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'查询意向户源列表失败',
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
            title:'查询意向户源列表失败',
            todo:'getOut',
          },
        });
      }
    },
    //选择客户意向房源
    *doSelectHouseKey({payload},{select,put}){
      yield put({
        type:'changeSelectHouseKey',
        payload,
      })
      if(payload.length===0){
        const showHouseObj={
          picUrl:'',
          key:'defalut',
          areaInfo:'',
          priceInfo:'',
          cellStatus:'',
        };
        yield put({type:'clearShowHouseObj'})
      }else{
        const selectKey=payload.join('/');
        const {houseTreeMap}=yield select(({customerDoLook})=>customerDoLook);
        const selectObj=houseTreeMap.get(selectKey);
        const showHouseObj={
          id:selectObj.id,
          area:selectObj.area,
          bathRoom:selectObj.bathRoom,
          buildingNumber:selectObj.buildingNumber,
          cookRoom:selectObj.cookRoom,
          floorArea:selectObj.floorArea,
          houseRoom:selectObj.houseRoom,
          imgUrl:selectObj.housePic[0],
          livingRoom:selectObj.livingRoom,
          price:selectObj.price,
          roomNumber:selectObj.roomNumber,
          totalPrice:selectObj.totalPrice,
          unit:selectObj.unit,
          cellStatus:`销售状态：${selectObj.state}`,
        };
        yield put({type:'initShowHouseObj',payload:showHouseObj})
      }
    },


    *notGetGroupId({payload},{put,call}){
      yield put({
        type:'switchPrompt',
        payload,
      })
    },
    *findTrackByGroupKey({payload},{put,call}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload});
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
            description:'请联系管理员',
            title:'获取交易数据失败',
            okText:'确定',
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ customerDoLook }) => customerDoLook.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    *postRemarks({payload},{call,put,select}){
      const {groupKey,type,showHouseObj} = yield select(({ customerDoLook }) => customerDoLook);
      if(type==='noHouse'){
        if(showHouseObj.id!=='defalut'){
          const {data}=yield call(addDoVisitFetch,{comments:payload,groupKey,intentHouseId:showHouseObj.id});
          if(!!data){
            if(data.status==='success'){
              yield put({type:'switchPrompt',payload:{
                todo:'getOut',
                visible:true,
                title:'确看成功！',
                description:'',
              }})
            }else{
              yield put({type:'switchPrompt',payload:{
                todo:'default',
                visible:true,
                title:'确看失败！',
                description:data.message,
              }})
            }
          }else{
            yield put({type:'switchPrompt',payload:{
              todo:'default',
              visible:true,
              title:'确看失败！',
              description:'与服务器连接异常！',
            }})
          }
        }else{
          yield put({type:'switchPrompt',payload:{
            todo:'default',
            visible:true,
            title:'确看失败！',
            description:'未选择意向房源',
          }})
        }
      }else{
        const {data}=yield call(addDoVisitFetch,{comments:payload,groupKey,});
        if(!!data){
          if(data.status==='success'){
            yield put({type:'switchPrompt',payload:{
              todo:'getOut',
              visible:true,
              title:'确看成功！',
            }})
          }else{
            yield put({type:'switchPrompt',payload:{
              todo:'default',
              visible:true,
              title:'确看失败！',
              description:data.message,
            }})
          }
        }else{
          yield put({type:'switchPrompt',payload:{
            todo:'default',
            visible:true,
            title:'确看失败！',
            description:'与服务器连接异常！',
          }})
        }
      }

    },
  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setGroupKey(state,action){
      return {...state,groupKey:action.payload}
    },
    clearShowHouseObj(state,action){
      return {...state,showHouseObj:{id:'defalut'},selectHouseKey:[]}
    },
    changeSelectHouseKey(state,action){
      return {...state,selectHouseKey:action.payload}
    },
    initTrackData(state,action){
      return {...state,trackJSON:action.payload,loading:false}
    },
    initNoHouseType(state,action){
      return {...state,...action.payload}
    },
    initHouseTreeData(state,action){
      return {...state,...action.payload}
    },
    initShowHouseObj(state,action){
      return {...state,showHouseObj:action.payload}
    },
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
  },
}
