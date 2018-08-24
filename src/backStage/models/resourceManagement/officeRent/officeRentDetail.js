import {
  findHouseInfoAll,findAllGuideFetch,houseOffLine,getTrackByGroupKeyFetch,
} from  '../../../services/resourceManagement/officeRent/officeRentDetail'
import {message} from 'antd';
import {
  renderSHRentTrackDataJSON,
} from '../../../../commons/utils/currencyFunction'
import { routerRedux } from 'dva/router';
export default{
  namespace:'officeRentDetail',
  state:{
    current:0,
    houseBaseInfo:null,//房源基本信息
    listOwer:null,//业主列表信息
    brokerPromotion:[],//经纪人列表信息
    guideArr:[],
    total:'',
    pageNo:'',
    id:'',
    status:'',
    offLineStatus:false,
    transCode:null,
    trackJSON:null,
  },
  reducers:{
    setState(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *iniailFindAll({payload},{call,put}){
      const {data,err}=yield call(findHouseInfoAll,{...payload});
      if(err){
        return message.error('访问出错')
      }
      if(data.data){
        let houseBaseInfo;
        yield put({
          type:'setState',
          payload:{
            houseBaseInfo:data.data.houseBaseInfo,
            listOwer:data.data.listOwer,
            brokerPromotion:data.data.brokerPromotion,
            transCode:payload.transCode,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *getTrack({payload},{call,put}){
      const {data,err}=yield call(getTrackByGroupKeyFetch,{...payload});
      if(err){
        return message.error('出错了，请联系管理员')
      }
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            trackJSON:renderSHRentTrackDataJSON(data.data.trackDetail,payload.id),
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *findAllGuide({payload},{call,put}){
      const {data,err}=yield call(findAllGuideFetch,{...payload});
      if(err){
        return message.error('访问出错')
      }
      if(data.data){
        const guideArr=[];
        data.data.content.map((item,index)=>(
          guideArr.push({
            key:item.id,
            number:index+1,
            appointmentTime:item.appointmentTime,
            customerBrokerName:item.customerBrokerName,
            customerBrokerPhone:item.customerBrokerPhone,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            guideTime:item.guideTime,
            houseBrokerName:item.houseBrokerName,
            houseBrokerPhone:item.houseBrokerPhone,
            status:item.status,
          })
        ))
        yield put({
          type:'setState',
          payload:{
            guideArr:guideArr,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            id:payload.id,
            status:payload.status,
          }
        })
      }
    },
    *offLineOk({payload},{call,put}){
      const {data,err}=yield call(houseOffLine,{...payload});
      if(err){
        return message.error('访问出错')
      }
      if(data.data){
        yield put({type:'setState',payload:{offLineStatus:false}})
        yield put(routerRedux.goBack());
      }else{
        message.error(data.message)
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
       if(location.pathname === '/resourceManagement/officeBuildingRent/officeRentDetail'){
          dispatch({type:'iniailFindAll',
            payload:{
              id:location.state.id,
              transCode:location.state.transCode,
            }
          })
          dispatch({type:'findAllGuide',
            payload:{
              id:location.state.id
            }
          })
        }
      });
    },
  },
}
