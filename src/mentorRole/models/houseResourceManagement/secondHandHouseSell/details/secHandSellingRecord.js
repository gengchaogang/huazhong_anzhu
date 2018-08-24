import {
  getInitDataFetch,
} from  '../../../../services/newHouseProDetails/detailsRecord'
import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandSellingRecord',
  state: {
    currentStatus:"",
    tableData:[],
    totalElements:null,
    tableLoading:true,
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
    saveTableData(state,action){
      return{...state,...action.payload}
    },
    saveCurrentStatus(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *getInitData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data.content;
        const tableData=[];
        const totalElements=data.data.totalElements;
        resultData.map((item,index)=>{
          tableData.push({
            number:index+1,
            key:item.id,
            appointmentTime:item.appointmentTime,
            customerBrokerName:item.customerBrokerName,
            customerBrokerPhone:item.customerBrokerPhone,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            guideTime:item.guideTime,
            houseBrokerName:item.houseBrokerName,
            houseBrokerPhone:item.houseBrokerPhone,
            id:item.id,
            status:item.status,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:tableData,
            totalElements:totalElements,
            tableLoading:false,
          }
        })
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
           if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingRecord') {
             dispatch({
               type:"saveCurrentStatus",
               payload:{
                 currentStatus:''
               }
             })
             dispatch({
               type:"saveProjectId",
               payload:{
                 projectId:location.state.projectId
               }
             })
             dispatch({
               type:"getInitData",
               payload:{
                 id:location.state.projectId,
                 pageSize:10,
                 pageNo:0
               }
             })
           }
         });
       },
  }
}
