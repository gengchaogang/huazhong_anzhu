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
  findAllAreasOpen,findFilterAndOrderHouse,houseOffLine
} from  '../../../services/resourceManagement/officeRent/officeRent'
import {message} from 'antd';
export default{
  namespace:'officeRent',
  state:{
    houseState:'已发布',
    cascaderArr:[],//城市级联数组
    dataSoruce:[],
    keyword:'',
    fullPath:'',
    isCooperationSale:'',
    pageNo:0,
    pageSize:10,
    total:'',
    loading:true,
    offLineStatus:false,//下架模态框
    id:'',
  },
  reducers:{
    setState(state,action){
      return{...state,...action.payload}
    },
    setData(state,action){
      return{...state,...action.payload}
    },
    loading(state,action){
      return{...state,...action.payload}
    },
    offLineClick(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *iniailFindAll({payload},{call,put}){
      yield put({type:'findArea'});
      yield put({
        type:'findAll',
        payload:{
          keyword:'',
          fullPath:'/河北省/保定市',
          isCooperationSale:'',
          houseState:'已发布',
          saleWay:'出租',
          pageNo:0,
          pageSize:10,
          resourcesType:'写字楼',
        }
      })
    },
    *findAll({payload},{call,put}){
      const {data,err}=yield call(findFilterAndOrderHouse,{...payload});
      if(err){
        return message.error('访问出错')
      }
      const dataSoruce=[];
      if(data.data){
        data.data.content.map((item,index)=>(
          dataSoruce.push({
            number:index+1,
            key:item.id,
            areaName:item.areaName,
            houseName:item.houseName,
            floorArea:item.floorArea,
            totlePriceShowName:item.totlePriceShowName,
            price:item.price,
            createDate:item.createDate,
            houseStateShowName:item.houseStateShowName,
          })
        ))
        yield put({
          type:'setData',
          payload:{
            dataSoruce:dataSoruce,
            pageSize:10,
            pageNo:data.data.number+1,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            isCooperationSale:payload.isCooperationSale,
            houseState:payload.houseState,
            total:data.data.totalElements,
            loading:false,
            offLineStatus:false,
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
        yield put({
          type:'findAll',
          payload:{
            keyword:'',
            fullPath:'',
            isCooperationSale:'',
            houseState:'已发布',
            saleWay:'出租',
            resourcesType:'写字楼',
            pageNo:0,
            pageSize:10,
          }
        })
      }
    },
    *findArea({payload},{call,put}){
      const {data,err}=yield call(findAllAreasOpen);
      if(err){
        return message.error('访问出错')
      }
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            cascaderArr:_toCascaderOptions(data.data)
          }
        })
      }else{
        message.error(data.message)
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
       if(location.pathname === '/resourceManagement/officeBuildingRent'){
          dispatch({type:'iniailFindAll'})
       }
      });
    },
  },
}
