import { routerRedux } from 'dva/router'
import {
  getProjectHousesInfoFetch,
  updateHousesStatusFetch,
}from '../../../services/tradeManagement/newHouseTrade/housesManagement'

const initState={
  loading:true,
  projectId:null,
  projectName:'',
  housesInfoData:[],
  tableLoading:true,
  pageNo:1,
  totalElements:1,
  modalVisible:false,
  selectStatus:'',
  houseId:null,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'housesManagement',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/housesManagement') {
          dispatch({type:'doInitState'})
          if(!!location.state && !!location.state.projectId && !!location.state.projectName){
            dispatch({
              type:'initHouseManagementInfo',
              payload:{
                projectName:location.state.projectName,
                projectId:location.state.projectId,
              },
            })
          }else{
            dispatch({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'请联系管理员',
                title:'获取项目信息失败',
                okText:'确定',
                todo:'defalut',
              },
            });
          }
        }
      });
    },
  },
  effects:{
    //初始化房源销控管理组件
    *initHouseManagementInfo({payload},{call,put}){
      //设置项目名
      yield put({
        type:'setProjectInfo',
        payload,
      })
      yield put({type:'initHousesTableData'});
    },
    //获取销控表数据（传入页码即为翻页）
    *initHousesTableData({payload},{select,call,put}){
      const {projectId,pageNo}=yield select(({housesManagement})=>housesManagement);
      let targetNo=pageNo;
      if(!!payload){
        //分页
        targetNo=payload,
        yield put({
          type:'changeCurrentPage',
          payload,
        })
      }else{
        yield put({
          type:'setTableLoading',
          payload:true,
        })
      }
      //发起获取销控表数据请求
      const {data}=yield call(getProjectHousesInfoFetch,{
        projectId,
        pageNo:targetNo-1,
      })
      if(!!data){
        if(data.status==='success'){
          const tableData=data.data.content.map(item=>({
            number:item.id,
            area:item.area,
            unit:item.unit,
            stairType:item.stairType,
            decoration:item.decoration,
            floor:item.floor,
            totalFloor:item.totalFloor,
            roomNumber:item.roomNumber,
            buildingNumber:item.buildingNumber,
            housingType:item.housingType,
            floorArea:item.floorArea,
            price:item.price,
            totalPrice:item.totalPrice,
            houseTypeName:item.houseTypeName,
            state:item.state,
          }))
          yield put({
            type:'updataTableData',
            payload:{
              pageNo:data.data.number+1,
              totalElements:data.data.totalElements,
              housesInfoData:tableData,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目销控表数据失败！',
              okText:'确定',
              todo:'initTable',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取项目销控表数据失败！',
            okText:'确定',
            todo:'initTable',
          },
        })
      }
    },
    //点击打开切换销控表状态模态框
    *openChangeStatusModal({payload},{select,call,put}){
      yield put({
        type:'openModal',
        payload:{
          selectStatus:payload.status,
          houseId:payload.id,
        }
      })
    },
    //执行改变房源状态请求
    *doChangeHousesStatus({payload},{call,select,put}){
      const {houseId,selectStatus}=yield select(({housesManagement})=>housesManagement);
      if(!houseId || !selectStatus){
        //信息有误
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请重新操作',
            title:'获取房源状态失败！',
            okText:'确定',
            todo:'defalut',
          },
        })
      }else{
        //执行请求
        const{data}=yield call(updateHousesStatusFetch,{
          id:houseId,
          state:selectStatus,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'修改房源状态成功！',
                okText:'确定',
                todo:'closeModal',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'修改房源状态失败！',
                okText:'确定',
                todo:'defalut',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'发起请求失败，请联系管理员！',
              title:'修改房源状态失败！',
              okText:'确定',
              todo:'defalut',
            },
          })
        }
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ housesManagement }) => housesManagement.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'onlyClosePrompt',payload:{visible:false}});
          break;
        case 'closeModal':
          yield put({type:'closeAll'});
          yield put({type:'initHousesTableData'});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({type:'onlyClosePrompt',payload:{visible:false}});
          break;
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
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    setProjectInfo(state,action){
      return {...state,...action.payload,loading:false}
    },
    changeCurrentPage(state,action){
      return {...state,pageNo:action.payload,tableLoading:true}
    },
    setTableLoading(state,action){
      return {...state,tableLoading:action.payload}
    },
    updataTableData(state,action){
      return {...state,...action.payload,tableLoading:false}
    },
    closeModal(state,action){
      return {...state,modalVisible:false,selectStatus:'',houseId:null}
    },
    changeSlectStatus(state,action){
      return {...state,selectStatus:action.payload}
    },
    openModal(state,action){
      return {...state,...action.payload,modalVisible:true,}
    },
    closeAll(state,action){
      return {...state,modalVisible:false,promptObj:{...initState.promptObj}}
    },
  },
}
