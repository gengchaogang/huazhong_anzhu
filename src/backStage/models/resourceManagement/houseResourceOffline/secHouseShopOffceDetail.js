import {
  findHouseInfoAll,findAllGuideFetch,getTrackByGroupKeyFetch
} from  '../../../services/resourceManagement/houseResourceOffline/secHouseShopOffceDetail'
import {
  renderSHSellTrackDataJSON,renderSHRentTrackDataJSON
} from '../../../../commons/utils/currencyFunction'
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'secHouseShopOffceDetail',
  state: {
    current:0,
    houseBaseInfo:null,//房源基本信息
    listOwer:null,//业主列表信息
    brokerPromotion:[],//经纪人列表信息
    guideArr:[],
    total:'',
    pageNo:'',
    id:'',
    transCode:'',
    status:'',
    offLineInfos:null,
    track:'',
    issaleWay:'',
    trackJSON:null,
  },
  reducers: {
    setState(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *iniailFindAll({ payload }, { call, put }){
      const {data,err}=yield call(findHouseInfoAll,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:"setState",
          payload:{
            houseBaseInfo:data.data.houseBaseInfo,
            issaleWay:(data.data.houseBaseInfo?data.data.houseBaseInfo.saleWay:''),
            listOwer:data.data.listOwer,
            brokerPromotion:data.data.brokerPromotion,
            offLineInfos:data.data.offLineInfos[0],
            id:payload.id,
            transCode:payload.transCode,
          }
        })
      }
    },
    *findAllTransCode({payload},{call,put,select}){
      const issaleWay=yield select(({secHouseShopOffceDetail})=>secHouseShopOffceDetail.issaleWay);
      const {data,err}=yield call(getTrackByGroupKeyFetch,{...payload});
      if(err){
        return message.info('出错了')
      }
      if(data.data){
        if(issaleWay=='出售'){
          yield put({
            type:'setState',
            payload:{
              trackJSON:renderSHSellTrackDataJSON(data.data.trackDetail,payload.groupKey),
            }
          })
        }else{
          yield put({
            type:'setState',
            payload:{
              trackJSON:renderSHRentTrackDataJSON(data.data.trackDetail,payload.groupKey),
            }
          })
        }
      }
    },
    *findAllGuide({payload},{call,put}){
      const {data,err}=yield call(findAllGuideFetch,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
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
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location =>{
        if (location.pathname === '/resourceManagement/soldOutHouse/secHouseShopOffceDetail') {
          dispatch({type:'iniailFindAll',
            payload:{
              id:location.state.id,
              returnOffLineInfo:'是',
              transCode:location.state.transCode,
            }
          })
        }
      });
    },
  }
}
