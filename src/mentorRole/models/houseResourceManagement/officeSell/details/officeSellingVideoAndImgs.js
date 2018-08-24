import {
  getInitImgDataFetch,
} from  '../../../../services/newHouseProDetails/detailsVideoAndImgs'
import { routerRedux } from 'dva/router';
export default {
  namespace: 'officeSellingVideoAndImgs',
  state: {
    initData:[],
    projectId:null,
    modalVisible:false,
    submitLoading:false,
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
  },
  reducers: {
    saveProjectId(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveInitData(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *getInitImgData({payload},{call,put}){
      const {data}=yield call(getInitImgDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const initData=[];
        const resultData=data.data.houseBaseInfo.outFiles;
        resultData.map((item,index)=>{
          if(!!item.isUse){
            if(item.isUse==='是'){
              item.isUse=true
            }else{
              item.isUse=false
            }
          }
          initData.push({
            key:index+1,
            userName:item.addUserName,
            agentPic:item.addUserLogo,
            uploadTime:item.createDate,
            isAdopt:item.isUse,
            images:item.path.split(),
            picNumber:item.path.length,
          })
        })
        yield put({type:"saveInitData",payload:{initData:initData}})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取初始失败,请重新刷新页面或者联系管理员!',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/officeSell/officeSellingNavBar/officeSellingVideoAndImgs') {
             console.log('loaction',location);
             dispatch({
               type:"saveProjectId",
               payload:{
                 projectId:location.state.projectId
               }
             })
             dispatch({
               type:"getInitImgData",
               payload:{
                 id:location.state.projectId
               }
             })
           }
         });
       },
  }
}
