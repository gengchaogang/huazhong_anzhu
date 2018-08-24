import {
  getInitDataFetch,
} from '../../../../../services/resourceManagement/newHouseProDetails/detailsAgentBroker'
import { routerRedux } from 'dva/router';
export default {
  namespace: 'secHandSellingAgentBroker',
  state: {
    agentBrokersData:[],
    projectId:null,
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
    saveBrokersData(state,action){
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
        const agentBrokersData=[];
        const resultData=data.data.brokerPromotion;
        resultData.map((item,index)=>{
          agentBrokersData.push({
            key:index,
            number:index+1,
            agentBrokers:item.brokerName,
            coreSellingPoint:item.coreSellingPoint,
            phone:item.brokerPhone,
            totalPrice:item.totlePrice,
            promotionMode:item.promotionMode,
            commissionAmount:item.commissionAmount,
            tradingCommissions:item.tradingCommissions,
            commissionRate:item.commissionRate,
            commissionAmount:item.commissionAmount,
            logo:item.brokerLogo,
          })
        })
        yield put({type:"saveBrokersData",payload:{agentBrokersData:agentBrokersData}})
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
           if (location.pathname === '/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingAgentBroker') {
             console.log('loaction',location);
             dispatch({
               type:"saveProjectId",
               payload:{
                 projectId:location.state.projectId
               }
             })
             dispatch({
               type:"getInitData",
               payload:{
                 id:location.state.projectId
               }
             })
           }
         });
       },
  }
}
