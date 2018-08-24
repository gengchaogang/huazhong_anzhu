import {
  getImgDataFetch,
  upLoadPicFetch,
  editPicFetch
}from '../../../../services/newHouseOnline/createNewProject/uploadProjectPhoto'
import lodash from 'lodash';
const initialState={
  projectId:null,
  isAllUpload:true,
  isEdit:null,
  reEdit:null,
  showEffectPicList:[],
  showEffectPicLoading:false,
  showTrafficPicList:[],
  showTrafficPicLoading:false,
  showSupportingPicList:[],
  showSupportingPicLoading:false,
  photoId:null,
  picId:null,
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
  namespace:'uploadProjectPhoto',
  state:initialState,
  reducers:{
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveIdAndIsEdit(state,action){
      return{...state,...action.payload}
    },
    changeEffectPicList(state,action){
      return{...state,showEffectPicList:action.payload}
    },
    changeTrafficPicList(state,action){
      return{...state,showTrafficPicList:action.payload}
    },
    changeSupportingPicList(state,action){
      return{...state,showSupportingPicList:action.payload}
    },
    savePicId(state,action){
      return{...state,...action.payload}
    },
    changePicLists(state,action){
      return{
        ...state,
        showEffectPicList:action.payload.showEffectPicList,
        showTrafficPicList:action.payload.showTrafficPicList,
        showSupportingPicList:action.payload.showSupportingPicList,
      }
    },
    //回显上传组件状态
    updateUploadLoading(state,action){
      return {...state,...action.payload}
    },
  },
  subscriptions: {
     setup({ dispatch, history }) {
       history.listen(location => {
         if (location.pathname === '/newHouseOnline/projectManagement/createProject/uploadProjectPhoto') {
           dispatch({
             type:"setDefaultState",
           })
           //加入location中state.id有无判断
           if(!!location.state&&!!location.state.projectId){
             dispatch({
               type:'saveIdAndIsEdit',
               payload:{
                 projectId:location.state.projectId,
                 isEdit:location.state.isEdit,
                 reEdit:location.state.reEdit,
               }
             })
             dispatch({
               type:'getImgData',
               payload:{
                 projectId:location.state.projectId,
               }
             })
           }
         }
       });
     },
   },
   effects:{
    *getImgData({payload},{call,put}){
      const {data}=yield call(getImgDataFetch,payload)
      const showTrafficPicList=[];
      const showSupportingPicList=[];
      const showEffectPicList=[];
      let picId;
      if(!!data&&data.status==='success'){
        yield put({type:'changePicLists',payload:{
          showEffectPicList:[],
          showTrafficPicList:[],
          showSupportingPicList:[],
        }})
        const result=data.data[0];
        if(!!data.data[0]){
          picId=data.data[0].id;
          yield put({type:'savePicId',payload:{
            picId:picId
          }})
        }
        if(!!result&&!!result.pictures){
          result.pictures.map(item=>{
            if(!!item.type&&item.type==="1"){
              showEffectPicList.push({
                // pictureId:item.id,
                name:item.title,
                id:item.id.toString(),
                isCover:item.cover,
                src:item.path,
                rename:false
              })
            }
          })
        }
        if(!!result&&!!result.pictures){
          result.pictures.map(item=>{
            if(!!item.type&&item.type==='2'){
              showSupportingPicList.push({
                // pictureId:item.id,
                name:item.title,
                id:item.id.toString(),
                isCover:item.cover,
                src:item.path,
                rename:false
              })
            }
          })
        }
        if(!!result&&!!result.pictures){
          result.pictures.map(item=>{
            if(!!item.type&&item.type==='3')
              showTrafficPicList.push({
                // pictureId:item.id,
                name:item.title,
                id:item.id.toString(),
                isCover:item.cover,
                src:item.path,
                rename:false
              })
          })

          yield put({type:'changePicLists',payload:{
            showEffectPicList:showEffectPicList,
            showTrafficPicList:showTrafficPicList,
            showSupportingPicList:showSupportingPicList,
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'操作失败!',
          description:'请求初始相册失败,请重新刷新页面!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *upLoadPic({payload},{call,put}){
      const effectPic=payload.showEffectPicList;
      const trafficPic=payload.showTrafficPicList;
      const supportingPic=payload.showSupportingPicList;
      const pictures=[];
      const newEffectPic=effectPic.map(item=>{
        return{
          accessCode:item.id,
          isCover:item.isCover,
          title:item.name,
          type:1
        }
      })
      const newTrafficPic=trafficPic.map(item=>{
        return{
          accessCode:item.id,
          isCover:item.isCover,
          title:item.name,
          type:2
        }
      })
      const newSupportingPic=supportingPic.map(item=>{
        return{
          accessCode:item.id,
          isCover:item.isCover,
          title:item.name,
          type:3
        }
      })
      newEffectPic.map(item=>{
        pictures.push({
          accessCode:item.accessCode,
          isCover:item.isCover,
          title:item.title,
          type:item.type
        })
      })
      newSupportingPic.map(item=>{
        pictures.push({
          accessCode:item.accessCode,
          isCover:item.isCover,
          title:item.title,
          type:item.type
        })
      })
      newTrafficPic.map(item=>{
        pictures.push({
          accessCode:item.accessCode,
          isCover:item.isCover,
          title:item.title,
          type:item.type
        })
      })
      let hasCover=false;
      pictures.map(item=>{
        if(item.cover){
          hasCover=true;
        }
      });
      if(!hasCover){
        pictures[0].cover=true;
      }
      const uploadData={
        pictures:pictures,
        projectId:payload.projectId
      }
      const {data}=yield call(upLoadPicFetch,{...uploadData})
      if(data.status==='success'){
        console.log('上传照片成功')
        yield put({
          type:"savePicId",
          payload:{
            picId:data.data
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          title:'上传失败!',
          description:'上传照片失败,请重新上传!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *editPic({payload},{call,put}){
      const effectPic=payload.showEffectPicList;
      const trafficPic=payload.showTrafficPicList;
      const supportingPic=payload.showSupportingPicList;
      const pictures=[];
      const newEffectPic=effectPic.map(item=>{
        if(item.src.indexOf("?")===-1){
          return{
            pictureId:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
            path:item.src,
          }
        }else{
          return{
            accessCode:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
          }
        }
      })
      const newTrafficPic=trafficPic.map(item=>{
        if(item.src.indexOf("?")===-1){
          return{
            pictureId:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
            path:item.src,
          }
        }else{
          return{
            accessCode:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
          }
        }
      })
      const newSupportingPic=supportingPic.map(item=>{
        if(item.src.indexOf("?")===-1){
          return{
            pictureId:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
            path:item.src,
          }
        }else{
          return{
            accessCode:item.id,
            isCover:item.isCover,
            title:item.name,
            type:1,
          }
        }
      })
      newEffectPic.map(item=>{
        if(!!item.accessCode){
          pictures.push({
            accessCode:item.accessCode,
            isCover:item.isCover,
            title:item.title,
            type:'1',
          })
        }else{
          pictures.push({
            id:item.pictureId,
            path:item.path,
            isCover:item.isCover,
            title:item.title,
            type:'1'
          })
        }
      })
      newTrafficPic.map(item=>{
        if(!!item.accessCode){
          pictures.push({
            accessCode:item.accessCode,
            isCover:item.isCover,
            title:item.title,
            type:'3'
          })
        }else{
          pictures.push({
            id:item.pictureId,
            path:item.path,
            isCover:item.isCover,
            title:item.title,
            type:'3'
          })
        }
      })
      newSupportingPic.map(item=>{
        if(!!item.accessCode){
          pictures.push({
            accessCode:item.accessCode,
            isCover:item.isCover,
            title:item.title,
            type:'2'
          })
        }else{
          pictures.push({
            id:item.pictureId,
            path:item.path,
            isCover:item.isCover,
            title:item.title,
            type:'2'
          })
        }
      })
      let hasCover=false;
      pictures.map(item=>{
        if(item.cover){
          hasCover=true;
        }
      });
      if(!hasCover){
        pictures[0].cover=true;
      }
      const uploadData={
        pictures:pictures,
        projectId:payload.projectId,
        id:payload.picId,
      }
      const {data}=yield call(editPicFetch,{...uploadData})
      if(data.status==='success'){
        yield put({
          type:"savePicId",
          payload:{
            picId:data.data
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'编辑上传照片失败!',
          description:'请求初始相册失败,请重新刷新页面!',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
   }
}
