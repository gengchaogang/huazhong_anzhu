import {
  getInitDataFetch,
  uploadPicFetch,
  projectReleaseFetch,
  getInitImgFetch,
  editPicFetch,
  getInitEmployeesFetch,
}from '../../../../services/newHouseOnline/createNewProject/uploadAptitude';
import {
  renderUnitPriceStr,
} from '../../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initialState={
  employees:[],
  picId:'',
  editUpload:false,
  resultData:[],
  projectId:null,
  reEdit:null,
  isEdit:null,
  visible:false,
  showInitPicList:[],
  showReleasePicList:[],
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
  namespace: 'uploadAptitude',
  state:initialState,
  subscriptions:{
     setup({ dispatch, history }) {
         history.listen(location => {
          if(location.pathname === '/newHouseOnline/projectManagement/createProject/uploadAptitude'){
            dispatch({
              type:"setDefaultState",
            })
            dispatch({
              type:"getInitEmployees",
              payload:{
                name:"项目发布审核"
              }
            })
            if(!!location.state && !!location.state.projectId){
              dispatch({
                type:"saveIdAndState",
                payload:{
                  projectId:location.state.projectId,
                  isEdit:location.state.isEdit,
                  reEdit:location.state.reEdit,
                }
              })
              dispatch({
                type:"getInitImg",
                payload:{
                  projectId:location.state.projectId
                }
              })
            }else{
              dispatch({
                type:'togglePrompt',
                payload:{
                  type:'error',
                  title:'操作失败!',
                  description:'projectId丢失,请重新创建项目!',
                  visible:true,
                  todo:"closeTipModal"
                }
              })
            }
          }
         });
       },
    },
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    saveResultData(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveIdAndState(state,action){
      return{...state,...action.payload}
    },
    changePicList(state,action){
      return{...state,showInitPicList:action.payload}
    },
    changeReleasePicList(state,action){
      return{...state,showReleasePicList:action.payload}
    },
    showModal(state,action){
      return{...state,...action.payload}
    },
    closeModal(state,action){
      return{...state,...action.payload}
    },
    changeUploadState(state,action){
      return{...state,...action.payload}
    },
    savePicId(state,action){
      return{...state,...action.payload}
    },
    saveEmployees(state,action){
      return{...state,...action.payload}
    },
  },
effects:{
  *getInitEmployees({payload},{call,put}){
    const {data}=yield call(getInitEmployeesFetch,{...payload})
    if(!!data&&data.status==='success'){
      const employees=[];
      data.data.map((item)=>{
        employees.push(item)
      })
      yield put({
        type:"saveEmployees",
        payload:{
          employees:employees
        }
      })
    }else{
      yield put({type:'togglePrompt',payload:{
        type:'error',
        title:'失败!',
        description:`请求表格数据失败:${data.message}`,
        visible:true,
        todo:"closeTipModal"
      }})
    }
  },
  *getInitImg({payload},{call,put}){
      const {data}=yield call(getInitImgFetch,payload)
      if(!!data&&data.status==='success'){
        const showInitPicList=[];
        let picId;
        if(!!data.data){
          const resultData=data.data
          resultData.map(item=>{
            picId=item.id;
            item.credentialsPictures.map(i=>{
              showInitPicList.push({
                name:i.title,
                id:`picID_${i.id}`,
                code:i.accessCode,
                isCover:false,
                src:i.path,
                rename:false
              })
            })
          })
          yield put({
            type:"savePicId",
            payload:{
              picId:picId
            }
          })
          yield put({
            type:"changePicList",payload:showInitPicList
          })
        }
      }
  },
  *showModalAndFetch({payload},{call,put}){
    const {data}=yield call(getInitDataFetch,payload)
    if(!!data&&data.status==='success'){
      if(!!data.data){
        const resultData=[];
        const item=data.data
          resultData.push({
            key:item.id,
            name:item.name,
            location:item.location,
            price:renderUnitPriceStr(item.price),
            houseCount:item.sellTotle,
            discounts:`${item.discounts}个`,
            createUser:item.createUser,
            createDateTime:item.createDateTime,
            offlineDate:item.offlineDate
          })
        yield put({type:'saveResultData',payload:{resultData:resultData}})
      }
      yield put({type:'showModal',payload:{visible:true}})
    }else{
      yield put({type:'togglePrompt',payload:{
        type:'error',
        title:'失败!',
        description:'请求表格数据失败,请重新刷新页面!',
        visible:true,
        todo:"closeTipModal"
      }})
    }
  },
  *uploadPic({payload},{call,put}){
    const {data}=yield call(uploadPicFetch,payload)
    if(!!data&&data.status==='success'){
      yield put({type:"savePicId",payload:{picId:data.data}})
    }else{
      yield put({type:'togglePrompt',payload:{
        type:'error',
        title:'失败!',
        description:'添加项目资质失败,请重新上传图片!',
        visible:true,
        todo:"closeTipModal"
      }})
    }
  },
  *uploadData({payload},{call,put}){
    const {data}=yield call(projectReleaseFetch,{...payload})
    if(!!data&&data.status==='success'){
      yield put({type:'togglePrompt',payload:{
        type:'success',
        title:'成功!',
        description:'项目发布申请已提交，等待审核。',
        visible:true,
        todo:"closeBothModal"
      }})
    }else{
      yield put({type:'togglePrompt',payload:{
        type:'error',
        title:'失败!',
        description:'申请发布失败!',
        visible:true,
        todo:"closeTipModal"
      }})
    }
  },
}
}
