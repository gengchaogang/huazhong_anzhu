import lodash from 'lodash';
import { routerRedux } from 'dva/router'
import{
  uploadFile,
  getLabelDataFetch,
  getInitProjectTableDataFetch,
  deleteHouseResourceFetch,
  bandHouseTypeFetch,
  uploadEditDataFetch,
  getTableOneDataFetch,
  getInitHouseTypeNamesFetch,
  judgeHouseHasHouseTypeFetch,
}from '../../../../services/newHouseOnline/createNewProject/createProjectTable'
const initialState={
    houseTypeName:null,
    houseEditTitle:"房源编辑",
    houseTypeData:[],
    stairType:[],
    decoration:[],
    totalElements:null,
    resultData:[],
    current:0,
    selectedRowKeys: [],  // Check here to configure the default column
    loading: false,
    visible:false,
    projectId:null,
    isEdit:null,
    houseResourceId:null,
    houseTypeNames:[],
    BandHouseTypeModal:false,
    tableOneData:null,
    disabled:null,  //控制编辑和查看表单状态
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
}
export default {
  namespace:'createProjectTable',
  state:initialState,
  reducers:{
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    modifyLoading(state){
      return{...state,loading:!state.loading}
    },
    modifyBoth(state){
      return{...state,selectedRowKeys:[],loading:false}
    },
    modifySelect(state,anction){
      return{...state,selectedRowKeys:anction.payload}
    },
    openModalAndChangeSatae(state,action){
      return{...state,...action.payload}
    },
    closeModal(state,action){
      return{...state,visible:action.payload.visible}
    },
    openBandModal(state,action){
      return{...state,bandModal:action.payload.bandModal}
    },
    closeBandModal(state,action){
      return{...state,bandModal:action.payload.bandModal}
    },
    savetIdAndIsEdit(state,action){
      return{...state,...action.payload}
    },
    changeKey(state,action){
      return{...state,houseResourceId:action.payload.houseResourceId}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveOneData(state,action){
      return{...state,tableOneData:action.payload.tableOneData}
    },
    changePageNumber(state,action){
      return{...state,...action.payload}
    },
    saveResultData(state,action){
      return{...state,...action.payload}
    },
    saveTotalPage(state,action){
      return{...state,...action.payload}
    },
    saveCurrentPage(state,action){
      return{...state,...action.payload}
    },
    saveLabelData(state,action){
      return{...state,...action.payload}
    },
    saveHouseNames(state,action){
      return{...state,...action.payload}
    },
  },
  subscriptions:{
     setup({ dispatch, history }) {
         history.listen(location => {
          if(location.pathname === '/newHouseOnline/projectManagement/createProject/createProjectTable'){
            dispatch({
              type:"setDefaultState",
            })
            dispatch({
              type:'getLabelData',
              payload:{
                groups:[{
                  typeName:'新房物业类型',
                  areaPath:null
                },{
                  typeName:'楼梯类型',
                  areaPath:null
                },{
                  typeName:'装修情况',
                  areaPath:null
                },]
              }
            })
            if(!!location.state && !!location.state.projectId){
              dispatch({
                type:'getInitProjectTableData',
                payload:{
                  pageNo:0,
                  pageSize:10,
                  projectId:location.state.projectId,
                  state:'',
                }
              })
              dispatch({
                type:'savetIdAndIsEdit',
                payload:{
                  projectId:location.state.projectId,
                  isEdit:location.state.isEdit,
                  reEdit:location.state.reEdit,
                }
              })
              dispatch({
                type:"getInitHouseTypeNames",
                payload:{
                  projectId:location.state.projectId
                }
              })
            }else{
              dispatch({
                type:'togglePrompt',
                payload:{
                  type:'error',
                  title:'失败!',
                  description:`projectId丢失,请重新创建项目!`,
                  visible:true,
                  todo:"closeModal"
                }
              })
            }
          }
         });
       },
    },
  effects:{
    *getInitHouseTypeNames({payload},{call,put}){
      const {data}=yield call(getInitHouseTypeNamesFetch,{...payload})
      if(!!data&&data.status==="success"){
        if(!!data.data){
          yield put({type:"saveHouseNames",payload:{
            houseTypeNames:data.data
          }})
        }
      }
    },
    //判断是否全部房源均未绑定户型
    *judgeHouseHasHouseType({payload},{put,select,call}){
      const {projectId,isEdit,houseTypeNames,reEdit}=yield select(({createProjectTable})=>createProjectTable);
      const {data}=yield call(judgeHouseHasHouseTypeFetch,{id:projectId});
      if(!!data){
        if(data.status==='success'){
          console.log('data',data);
          if(data.data){
            //可以通过
            yield put(routerRedux.push({
              pathname:'/newHouseOnline/projectManagement/createProject/createProjectConcessions',
              state:{
                projectId:projectId,
                isEdit:isEdit,
                houseTypeNames:houseTypeNames,
                reEdit,
              }
            }))
          }else{
            yield put({
              type:'togglePrompt',
              payload:{
                title:'您还未绑定房源所属户型！',
                description:'请先绑定房源户型再进行下一步操作，否则房源不能显示',
                visible:true,
                todo:"default"
              }
            })
          }
        }else{
          yield put({
            type:'togglePrompt',
            payload:{
              title:'获取房源销控表绑定户型状态失败！',
              description:data.message,
              visible:true,
              todo:"default"
            }
          })
        }
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            title:'获取房源销控表绑定户型状态失败！',
            description:'请刷新，重新操作！',
            visible:true,
            todo:"default"
          }
        })
      }
    },
    *getInitProjectTableData({payload},{call,put}){
      const {data}=yield call(getInitProjectTableDataFetch,{...payload})
        if(!!data&&data.status==='success'){
          const resultData=[];
          const result=data.data.content;
          result.map((item,index)=>{
            resultData.push({
              key:item.id,
              number:`${index+1}`,
              area:item.area,
              unit:item.unit,
              stairType:item.stairType,
              decoration:item.decoration,
              floor:item.floor,
              totalFloor:item.totalFloor,
              houseNumber:item.roomNumber,
              buildingNumber:item.buildingNumber,
              housingType:item.housingType,
              floorArea:item.floorArea,
              price:item.price,
              totalPrice:item.totalPrice,
              houseTypeName:item.houseTypeName,
              state:item.state
            })
          })
          const totalElements=data.data.totalElements;
          yield put({type:"saveTotalPage",payload:{totalElements:totalElements}})
          yield put({type:'saveResultData',payload:{resultData:resultData}})
        }else{
          yield put({
            type:'togglePrompt',
            payload:{
              type:'error',
              title:'失败!',
              description:`获取销控表初始数据失败:${data.message}!`,
              visible:true,
              todo:"closeModal"
            }})
        }
    },
    *getLabelData({payload},{call,put}){  //得到标签数据
      const {data}=yield call(getLabelDataFetch,{...payload});
      const  houseTypeData=[];
      const  stairType=[];
      const  decoration=[];
      if(data.status==='success'){
        if(!!data.data){
          const resultData=data.data;
          resultData.map(item=>{
            if(item.typeName==='新房物业类型'){
              item.nameAndValues.map(i=>{
                houseTypeData.push(i.name)
              })
            }
            if(item.typeName==='楼梯类型'){
              item.nameAndValues.map(i=>{
                stairType.push(i.name)
              })
            }
            if(item.typeName==='装修情况'){
              item.nameAndValues.map(i=>{
                decoration.push(i.name)
              })
            }
          })
          yield put({type:'saveLabelData',payload:{
            houseTypeData:houseTypeData,
            stairType:stairType,
            decoration:decoration,
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取标签数据失败,请重新刷新页面!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *uploadEditData({payload},{call,put}){
      const {data}=yield call(uploadEditDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'修改数据成功!',
          visible:true,
          todo:"editOkSendFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`修改数据失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *deleteHouseResource({payload},{call,put}){
      const id=[];
      const ids={};
      payload.map(item=>{
        id.push(item)
      });
      ids.ids=id;
      const {data}=yield call(deleteHouseResourceFetch,{...ids})
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'删除房源成功!',
          visible:true,
          todo:"deleteHouseResource"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`删除房源失败:${data.message}`,
          visible:true,
          todo:"deleteHouseResource"
        }})
      }
    },
    *closeAndFetch({payload},{select,call,put}){
        const projectId = yield select(({ createProjectTable }) => createProjectTable.projectId);
        yield put({
          type:'togglePrompt',
          payload:{
            visible:false,
          }
        })
        yield put({
          type:'getInitProjectTableData',
          payload:{
            projectId:projectId
          }
        })
    },
    *bandHouseType({payload},{select,call,put}){
      const projectId = yield select(({ createProjectTable }) => createProjectTable.projectId);
      const current = yield select(({ createProjectTable }) => createProjectTable.current);
      const {data}=yield call(bandHouseTypeFetch,{...payload})
        if(!!data&&data.status==='success'){
          yield put({type:'closeBandModal',payload:{bandModal:false}})
          yield put({type:'getInitProjectTableData',payload:{
            projectId:projectId,
            pageSize:10,
            pageNo:current,
            state:''
          }})
          yield put({type:'modifyBoth'})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`绑定户型失败:${data.message}`,
            visible:true,
            todo:"closeModal"
          }})
        }
    },
    *getTableOneData({payload},{call,put}){
      const uploadData=payload.id;
      const {data}=yield call(getTableOneDataFetch,uploadData)
      if(!!data&&data.status==='success'){
        yield put({type:'saveOneData',payload:{
          tableOneData:data.data
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取当前数据失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *changePage({payload},{select,call,put}){
      const projectId = yield select(({ createProjectTable }) => createProjectTable.projectId);
      const current = yield select(({ createProjectTable }) => createProjectTable.current);
      const {data}=yield call(getInitProjectTableDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        yield put({type:'getInitProjectTableData',payload:{
          projectId:projectId,
          pageSize:10,
          pageNo:current,
          state:''
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`跳转页码失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  },
}
