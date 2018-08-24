function _toCascaderOptions(arr){
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: lable, label:lable}, children;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
import {
  getInitNewHouDataFetch,findFilterAndOrderHouseFetch,findAllTradingCenterFetch,
  findAllAreasOpenFetch,projectsAuditList,newHouseApply,delProject,
  houseOnLine,deleteHouse
} from  '../../../services/resourceManagement/houseResourceOffline/houseResourceOffline'
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'houseResourceOffline',
  state: {
    radioValue:'出售',
    resourcesType:'新房项目',
    secDataSource:[],
    total:'',
    pageNo:0,
    fullPath:'',
    keyword:'',
    saleWay:'出售',
    cascaderArr:[],//城市级联数组
    loading:true,
    tradingCenterCode:'',
    tradingArrCode:[],
    areaPath:'',//新房用
    id:'',
  },
  reducers: {
    saveProjectId(state,action){
      return{...state,...action.payload}
    },
    setState(state,action){
      return{...state,...action.payload}
    },
    loading(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *listDataSource({ payload }, { call, put }){
      const {data,err}=yield call(findFilterAndOrderHouseFetch,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const secDataSource=[];
        data.data.content.map((item,index)=>(
          secDataSource.push({
            key:item.id,
            number:index+1,
            areaName:item.areaName,
            houseName:item.houseName,
            houseType:item.houseType,
            shopOfficeType:item.shopOfficeType,
            floorArea:item.floorArea,
            totlePriceShowName:item.totlePriceShowName,
            price:item.price,
            isCooperationSale:(item.isCooperationSale=='开启'?'合作':'私有'),
            createDate:item.createDate,
            offiLineTime:item.offiLineTime,
            totlePrice:item.totlePrice,
            rentType:item.rentType,
            transCode:item.transCode,
          })
        ))
        yield put({type:'setState',
          payload:{
            secDataSource:secDataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            fullPath:payload.fullPath,
            keyword:payload.keyword,
            houseState:'已下架',
            resourcesType:payload.resourcesType,
            saleWay:payload.saleWay,
            loading:false,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *findAllTradingCenter({ payload }, { call, put }){
      const {data,err}=yield call(findAllTradingCenterFetch);
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const tradingArrCode=[];
        data.data.map((item,index)=>(
          tradingArrCode.push({
            key:item.id,
            code:item.code,
            name:item.name,
          })
        ))
        yield put({
          type:'setState',
          payload:{
            tradingArrCode:tradingArrCode,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *findArea({ payload }, { call, put }){
      const {data,err}=yield call(findAllAreasOpenFetch);
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const cascaderArr=[];
        yield put({
          type:'setState',
          payload:{
            cascaderArr:_toCascaderOptions(data.data)
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *newHouseList({ payload }, { call, put }){
      const {data,err}=yield call(projectsAuditList,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const newHouseSource=[];
        data.data.content.map((item,index)=>(
          newHouseSource.push({
            key:item.id,
            number:index+1,
            name:item.name,
            areaPath:item.areaPath,
            price:item.price,
            lookNumber:item.lookNumber,
            discount:item.discount,
            createDateTime:item.createDateTime,
            tradingCenterName:item.tradingCenterName,
            sellTotle:item.sellTotle,
          })
        ))
        yield put({
          type:'setState',
          payload:{
            newHouseSource:newHouseSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            tradingCenterCode:payload.tradingCenterCode,
            keyword:payload.keyword,
            areaPath:payload.areaPath,
            loading:false,
            resourcesType:'新房项目',
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *iniailFindAll({ payload }, { call, put }){
      yield put({type:'findAllTradingCenter'});
      yield put({type:'findArea'});
      yield put({type:'newHouseList',payload:{
        keyword:'',
        pageNo:0,
        tradingCenterCode:'',
        areaPath:'/河北省/保定市',//新房用
        status:'已下架',
      }});
    },
    //新房上架
    *upLineNewHouse({ payload }, { call, put }){
      const {data,err}=yield call(newHouseApply,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'newHouseList',
          payload:{
            pageNo:payload.pageNo,
            areaPath:payload.areaPath,
            keyword:payload.keyword,
            tradingCenterCode:payload.tradingCenterCode,
            status:'已下架',
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //删除
    *deleteNewHouse({ payload }, { call, put }){
      const {data,err}=yield call(delProject,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'newHouseList',
          payload:{
            pageNo:payload.pageNo,
            areaPath:payload.areaPath,
            keyword:payload.keyword,
            tradingCenterCode:payload.tradingCenterCode,
            status:'已下架',
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //上架
    *upLineSecHouse({ payload }, { call, put }){
      const {data,err}=yield call(houseOnLine,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'listDataSource',
          payload:{
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            houseState:payload.houseState,
            resourcesType:payload.resourcesType,
            saleWay:payload.saleWay,
            pageNo:payload.pageNo,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //删除
    *deleteSecHouse({ payload }, { call, put }){
      const {data,err}=yield call(deleteHouse,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'listDataSource',
          payload:{
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            houseState:payload.houseState,
            resourcesType:payload.resourcesType,
            saleWay:payload.saleWay,
            pageNo:payload.pageNo,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location =>{
        if (location.pathname === '/resourceManagement/soldOutHouse') {
          dispatch({type:'iniailFindAll'})
        }
      });
    },
  }
}
