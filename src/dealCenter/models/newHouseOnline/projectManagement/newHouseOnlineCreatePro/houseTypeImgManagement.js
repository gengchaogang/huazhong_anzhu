import lodash from 'lodash';
import{
  findProjectHouseTypes,
  uploadProjectHouseTypes,
  deleteHouseTypes,
  deleteHouseTypesFetch,
  getLabelDataFetch
}from '../../../../services/newHouseOnline/createNewProject/houseTypeImgManagement'
const houseTypes=[];
const initialState={
  totalElements:null,
  hauseTypeSales:[],
  residentialRoom:[],
  data:[],  //请求初始数据成功后返回的数据
  showHouseTypePicList:[],
  createhousetype:true,
  selectedRowKeys: [],  // Check here to configure the default column
  loading: false,
  //一下为弹出框state
  confirmLoading:false,
  reEdit:false,
  visible:false,
  previewVisible:false,
  previewImage:'',
  fileList: [],
  projectId:null,//项目ID
  isEdit:null,
  id:null,//单一户型ID
  houseTypesData:null,
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
export default{
  namespace:'houseTypeImgManagement',
  state:initialState,
  reducers:{
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    saveOkData(state,action){
      return{...state,...action.payload}
    },
    changePicList(state,action){
      return{...state,showHouseTypePicList:action.payload}
    },
    CreateType(state){
      return{...state,createhousetype:!state.createhousetype}
    },
    handleClose(state){
      return{...state,createhousetype:true}
    },
    modifySelect(state,action){
      return{...state,selectedRowKeys:action.payload}
    },
    handleCancel(state){
      return{...state,previewVisible:!state.previewVisible}
    },
    handlePreview(state,anction){
      return{...state,previewImage: anction.payload.url || anction.payload.thumbUrl,previewVisible:!state.previewVisible}
    },
    handleChange(state,anction){
      return{...state,fileList:anction.payload.fileList}
    },
    setState(state,{payload}){
      return {...state,...payload};
    },
    updateId(state,action){
      return{...state,id:action.payload};
    },
    colseCreateHouseTypeModal(state,action){
      return{...state,visible:action.payload}
    },
    savetIdAndIsEdit(state,action){
      return{...state,...action.payload}
    },
    closeModal(state,action){
      return{...state,visible:action.payload.visible}
    },
    openOkModal(state,action){
      return{...state,okVisible:action.payload.okVisible}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    changeState(state,action){
      return{...state,...action.payload}
    },
    clearTableData(state,action){
      return{...state,...action.payload}
    },
    closeAddHouseTypeSuccesModal(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false}),visible:false}
    },
    saveLabelData(state,action){
      return{...state,...action.payload}
    },
 },
 subscriptions:{
   setup({ dispatch, history }) {
       history.listen(location => {
         if(location.pathname === '/newHouseOnline/projectManagement/createProject/houseTypeImgManagement'){
           dispatch({
             type:'doInitComponent',
             payload:location.state,
           })
         }
       })
   }
  },
  effects:{
    *getInitHouseTypesData({payload},{call,put}){ //获取初始table中的值
      const {data}=yield call(findProjectHouseTypes,{...payload});
      if(!!data&&data.status==='success'){
        //数据处理
        if(!!data.data&&data.data.content.length!==0){
          const result=data.data.content
          const showData=[]
          result.map(item=>{
            const characteristics=[];
            const tips=item.characteristics;
            tips.map(key=>{
              characteristics.push(key.name)
            })
            showData.push({
              key:item.id,
              img:item.pictures[0]===undefined?'':item.pictures[0].path,//item.pictures[0].path              
              info:{
                type:item.name,
                tip:characteristics,
                housewear:`${item.houseRoom}室${item.livingRoom}厅${item.cookRoom}厨${item.bathRoom}卫`,
                buildArea:`${item.floorAreaStart}㎡~${item.floorAreaEnd}㎡`,
                houseArea:`${item.innerArea}㎡`,
                referencePrice:`${item.referencePrice}元/㎡`,
                priceTotal:`${item.referenceTotalPriceStart}万~${item.referenceTotalPriceEnd}万`,
                isLead:item.isLead==="true"?true:false,
              },
              date:item.createDateTime
            })
          })
          yield put({type:"saveOkData",payload:{data:showData}})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'请求初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //初始化组件状态
    *doInitComponent({payload},{put}){
      const {
        reEdit,
        isEdit,
        projectId,
      }=payload;
      yield put({
        type:"setDefaultState",
      })
      if(!!payload && !!projectId){
        yield put({  //保存ID和状态
          type:'savetIdAndIsEdit',
          payload:{
            projectId:projectId,
            isEdit:isEdit,
            reEdit:reEdit,
          }
        })
        yield put({  //发送初始数据请求
          type:'getInitHouseTypesData',
          payload:{
            projectId:projectId
          }
        })
        yield put({
          type:"getLabelData",
          payload:{
            groups:[{
              typeName:'户型特色',
              areaPath:null
            },{
              typeName:"住宅居室",
              areaPath:null
            }]
          }
        })
      }
    },
    *uploadHouseType({payload},{call,put}){
      const uploadData=payload;
      const characteristics=[];
      payload.characteristics.map(item=>{
        characteristics.push({name:item})
      })
      uploadData.characteristics=characteristics
      const {data}=yield call(uploadProjectHouseTypes,{...uploadData});
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'户型创建成功!',
            description:'上传成功!',
            visible:true,
            todo:"closeAndSendFetch"
          }})
          yield put({
            type:'changeState',
            payload:{
              isEdit:true
            }
          })
          houseTypes.push({id:data.data,name:payload.name})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'户型创建失败!',
            description:data.message,
            visible:true,
            todo:"closeModal"
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'户型创建失败!',
          description:'请求失败！',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *deleteHouseTypes({payload},{call,put}){
      const ids=[]
      payload.id.map(item=>{
        ids.push({id:item})
      })
      const uploadData={};
      uploadData.ids=ids;
      const {data}=yield call(deleteHouseTypesFetch,{...uploadData})
      if(data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'删除数据成功!',
          visible:true,
          todo:'closeAndSendFetch'
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'删除数据失败!',
          visible:true,
          todo:'closeAndSendFetch'
        }})
      }
    },
    *closeAndSendFetch({payload},{select,call,put}){
        const projectId = yield select(({ houseTypeImgManagement }) => houseTypeImgManagement.projectId);
        yield put({
          type:'togglePrompt',
          payload:{
            visible:false,
          }
        })
        yield put({
          type:"closeModal",
          payload:{
            visible:false
          }
        })
        yield put({
          type:'getInitHouseTypesData',
          payload:{
            projectId,
          }
        })
      },
    *getLabelData({payload},{call,put}){
      const {data}=yield call(getLabelDataFetch,{...payload});
      if(!!data&&data.status==='success'){
        const hauseTypeSales=[];
        const residentialRoom=[];
        if(!!data.data){
          const resultData=data.data;
          resultData.map(item=>{
            if(item.typeName==='户型特色'){
              item.nameAndValues.map(i=>{
                hauseTypeSales.push(i.name)
              })
            }
            if(item.typeName==='住宅居室'){
              item.nameAndValues.map(i=>{
                residentialRoom.push(i.value)
              })
            }
          })
          yield put({type:'saveLabelData',payload:{
            hauseTypeSales:hauseTypeSales,
            residentialRoom:residentialRoom,
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取标签数据失败!,请重新刷新页面!',
          visible:true,
          todo:'closeModal'
        }})
      }
    }
  }
}
