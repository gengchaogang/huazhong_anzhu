import { routerRedux } from 'dva/router'
import {
  searchHouseFetch,
  // getProjectHousesIntentionFetch,
  postCustomerDolookFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatClient'
import {
  getProjectHousesIntentionSellFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatGroupBuy'
import {
  searchBrokerFetch,
}from '../../../services/borkerFetch'
import {
  treeMenuMap,
  isNull,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
const initState={
  loading:true,
  projectInfo:null,
  btnLoading:false,
  broker:{
    hasBroker:false,
    brokerList:[],
    selectBroker:'',
  },
  houseTreeData:[],
  houseTreeMap:new Map(),
  selectHouseKey:[],
  showHouseObj:{
    picUrl:'',
    id:'defalut',
    areaInfo:'',
    priceInfo:'',
    cellStatus:'',
  },
  chooseBrokerModal:{
    visible:false,
    brokerInfoList:[],
  },
  selectBrokerInfo:{
    show:false,
    id:null,
    name:null,
    phoneNumber:null,
    gender:null,
    pic:null,
    isSelect:false,
  },
  doLookInfoDataJSON:'',
  projectList:[],
  lockProject:true,//限制项目
  projectId:null,
  projectName:null,
  house:{
    areaList:[],
    selectArea:[],
    houseTableData:[],
    selectHouse:[],
  },
  promptObj:{
    visible:false,
    title:'提示',
    description:'',
    todo:'default',
  },
}
export default {
  namespace: 'creatClient',
  state: initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/newHouseTrade/creatClient') {
         //项目相关
         dispatch({type:'doInitState'})
         if(!!location.state && !!location.state.projectId){
            const {projectId,projectName}=location.state;
            //锁定项目
            dispatch({
              type:'lockPojectGetData',
              payload:{
                projectId,
                projectName,
              }
            })
         }else{
           //没有确定项目 获取项目列表
          //  dispatch({
          //    type:'getProjectList',
          //  })

          //直接报错
          console.error('没有确定项目');
          dispatch({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请联系管理员',
              title:'获取项目信息失败',
              okText:'确定',
              type:'error',
            },
          });
         }
       }
     });
   },
  },
  effects:{
    *selectBroker({ payload }, {select, put }){
      const {brokerInfoList} = yield select(({ creatClient }) => creatClient.chooseBrokerModal);
      let selectBrokerInfo={};
      const newList=brokerInfoList.map(item=>{
        if(item.id!==payload){
          return Object.assign({},item,{isSelect:false});
        }else{
          selectBrokerInfo=Object.assign({},item,{show:false});
          return Object.assign({},item,{isSelect:true});
        }
      });
      yield put({
        type:'updateSelectBroker',
        payload:{
          brokerList:newList,
          selectBrokerInfo,
        },
      })
    },
    //锁定项目获取项目销控表数据
    *lockPojectGetData({payload},{call,put}){
      const {projectId,projectName}=payload;
      yield put({
        type:'lockProject',
        payload,
      });
      yield put({
        type:'getProjectInfoData',
        payload:projectId,
      })
      yield put({
        type:'getProjectHousesIntention',
        payload:projectId,
      })
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
              okText:'确定',
              type:'error',
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
            okText:'确定',
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
        const {houseTreeMap}=yield select(({creatClient})=>creatClient);
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


    *toggleHasBroker({ payload }, {select, put }){
      yield put({
        type:'setHasBroker',
        payload:{
          hasBroker:payload,
          searchValue:'',
          brokerList:[],
          selectBroker:'',
        }
      })
    },
    *submitData({ payload }, {select, put ,call}){
      //提交数据 依据payload传来的表单数据，加上state中的项目id和经纪人信息打包传与后台
      const {broker,showHouseObj,selectBrokerInfo,projectId}=yield select(({creatClient})=>creatClient);
      let isCan=true;
      if(broker.hasBroker==true && selectBrokerInfo.id==null && selectBrokerInfo.id==undefined){
        isCan=false;
      }else if(showHouseObj.id=='defalut' || showHouseObj.id===undefined){
        isCan=false;
      }
      if(isCan){
        yield put({
          type:'changeBtnLoading',
          payload:true,
        })
        //可以执行
        const doLookInfoData={
          comments:payload.remarks,
          customerIDNumber:payload.idCart,
          customerName:payload.clientName,
          customerPhone:payload.phone,
          customerSex:payload.gender,
          intentHouseId:showHouseObj.id,
          projectsId:projectId,
        }
        if(broker.hasBroker){
          doLookInfoData.brokerId=selectBrokerInfo.id;
        }
        yield put({type:'postCustomerDolookInfo',payload:JSON.stringify(doLookInfoData)})
      }else{
        //缺少条件
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有必填信息填写完整！',
            title:'执行现场确看失败！',
            okText:'确定',
            todo:'initBtnLoading',
          },
        });
      }
    },
    *getAreaListData({payload},{select,put,call}){

    },
    *getProjectListData({payload},{select,put,call}){

    },
    *postCustomerDolookInfo({payload},{select,call,put}){
      const{data}=yield call(postCustomerDolookFetch,JSON.parse(payload));
      if(!!data){
        if(data.status==='success'){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              title:'现场录客户执行成功！',
              description:'',
              okText:'确定',
              todo:'getOut',
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'现场录客户执行失败！',
              okText:'确定',
              todo:'defalut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'现场录客户执行失败！',
            okText:'确定',
            todo:'defalut',
          },
        });
      }
    },
    *searchBorker({payload},{select,call,put}){
      const {data}=yield call(searchBrokerFetch,{keyword:payload});
      if(!!data){
        if(data.status==='success' && data.data.content){
          const brokerInfoList=data.data.content.map(item=>({
              id:item.id,
              name:item.name,
              phoneNumber:item.phone,
              gender:item.gender,
              pic:item.logo?item.logo:'',
              isSelect:false,
          }));
          yield put({
            type:'updateBrokerList',
            payload:brokerInfoList,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请联系管理员',
              title:'搜索经纪人信息失败',
              okText:'确定',
              todo:'defalut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'请求失败',
            okText:'确定',
            todo:'defalut',
          },
        });
      }
    },
    //关闭提示框行为判断
    *okPrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ creatClient }) => creatClient.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'initBtnLoading':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'changeBtnLoading',payload:false});
          break;
        case 'getOut':
          yield put({type:'changeBtnLoading',payload:false});
          yield put(routerRedux.goBack());
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    *cancelPrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ creatClient }) => creatClient.promptObj);
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
  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
    keepDoLookMsg(state,action){
      return{...state,doLookInfoDataJSON:action.payload}
    },
    changeSelectHouseKey(state,action){
      return {...state,selectHouseKey:action.payload}
    },
    initShowHouseObj(state,action){
      return {...state,showHouseObj:action.payload}
    },
    clearShowHouseObj(state,action){
      return {...state,showHouseObj:{id:'defalut'},selectHouseKey:[]}
    },
    initHouseTreeData(state,action){
      return {...state,...action.payload}
    },
    changeProjectId(state,action){
      return {...state,projectId:action.payload}
    },
    changeSelectBroker(state,action) {
      return {...state,broker:Object.assign({},state.broker,{brokerList:action.payload})};
    },
    changeSelectAreaKeys(state,action){
      return {...state,house:Object.assign({},state,{selectArea:action.payload})}
    },
    changeSelectHouse(state,action){
      return {...state,house:Object.assign({},state,{selectHouse:action.payload})}
    },
    setHasBroker(state,action) {
      return {...state,broker:action.payload};
    },
    initCreatClient(state,action){
      return {...state,...action.payload};
    },
    changeHouseSelect(state,action) {
      return {...state,house:Object.assign({},state.house,{houseSelect:action.payload})};
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    lockProject(state,action){
      return {...state,lockProject:true,...action.payload}
    },
    initChooseBrokerModal(state,action){
      return {...state,chooseBrokerModal:{
        visible:true,
        brokerInfoList:[],
      }}
    },
    updateBrokerList(state,action){
      return {
        ...state,
        chooseBrokerModal:{
          visible:true,
          brokerInfoList:action.payload,
        },
        selectBrokerInfo:{
          id:null,
        },
      }
    },
    updateSelectBroker(state,action){
      return{
        ...state,
        chooseBrokerModal:{
          visible:true,
          brokerInfoList:action.payload.brokerList,
        },
        selectBrokerInfo:action.payload.selectBrokerInfo,
      }
    },
    sureDoSelectBroker(state,action){
      return{
        ...state,
        chooseBrokerModal:{
          brokerInfoList:[],
          visible:false,
        },
        selectBrokerInfo:{
          ...state.selectBrokerInfo,
          show:true,
        }
      }
    },
    giveUpSelectBroker(state,action){
      return{
        ...state,
        chooseBrokerModal:{
          brokerInfoList:[],
          visible:false,
        },
        selectBrokerInfo:{
          id:null,
        }
      }
    },
    changeBtnLoading(state,action){
      return {...state,btnLoading:action.payload}
    },
  },
}
