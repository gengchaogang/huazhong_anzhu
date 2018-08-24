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
  getInitCitysFetch,
  getInitDataFetch,
  offLineFetch,
  secondhouseOffLine,
} from'../../../services/resourceManagement/newHouseProDetails/detailsIndex'
import {message} from 'antd';
export default{
  namespace:'secondHandRentIndex',
  state:{
    areaAndCode:[],
    loading:false,
    tableData:[],
    currentRentingTotal:'',
    currentRentingPage:'',
    pageNo:0,
    total:'',
    houseState:"已发布",
    resourcesType:"住宅",
    keyword:'',
    fullPath:'',
    isCooperationSale:'',
    offLineStatus:false,
    id:'',
  },
  reducers:{
    saveAreaPath(state,action){
      return{...state,...action.payload}
    },
    changeTabsKey(state,action){
      return{...state,...action.payload}
    },
    saveRentingTableData(state,action){
      return{...state,...action.payload}
    },
    saveCurrentRecord(state,action){
      return{...state,...action.payload}
    },
    changeTableLoading(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },

  effects:{
    *getInitCitys({payload},{call,put}){
      const {data}=yield call(getInitCitysFetch,{...payload})
      if(!!data&&data.status==='success'){
        const reusltData=_toCascaderOptions(data.data)
        yield put({
          type:"saveAreaPath",
          payload:{
            areaAndCode:reusltData,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *getInitRentingData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=[];
        const currentRentingTotal=data.data.totalElements;
        const currentRentingPage=data.data.number;
        data.data.content.map((item,index)=>{
          resultData.push({
            key:item.id,
            number:index+1,
            areaName:item.areaName,
            communityName:item.communityName,
            houseType:item.houseType,
            createDate:item.createDate,
            saleMode:(item.isCooperationSale=='开启'?'合作':'私有'),
            floorArea:item.floorArea,
            totlePrice:item.totlePrice,
            totlePriceShowName:item.totlePriceShowName,
            price:item.price,
          })
        })
        yield put({
          type:"saveRentingTableData",
          payload:{
            tableData:resultData,
            currentRentingTotal:currentRentingTotal,
            currentRentingPage:currentRentingPage,
            loading:false,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            resourcesType:payload.resourcesType,
            isCooperationSale:payload.isCooperationSale,
            houseState:payload.houseState,
          }
        })
      }else{
        // yield put({type:'togglePrompt',payload:{
        //   type:'error',
        //   title:'失败!',
        //   description:'获取在售列表失败!',
        //   visible:true,
        //   todo:"closeModal"
        // }})
        message.error(data.message)
      }
    },
    // *getInitRentedData({payload},{call,put}){
    //   const {data}=yield call(getInitDataFetch,{...payload})
    //   if(!!data&&data.status==='success'){
    //     const resultData=[];
    //     const currentRentedTotal=data.data.totalElements;
    //     const currentRentedPage=data.data.number;
    //     data.data.content.map((item,index)=>{
    //       resultData.push({
    //         key:item.id,
    //         number:index+1,
    //         areaName:item.areaName,
    //         communityName:item.communityName,
    //         houseType:item.houseType,
    //         floorArea:item.floorArea,
    //         totlePrice:item.totlePrice,
    //         price:item.price,
    //       })
    //     })
    //     yield put({
    //       type:"saveRentingTableData",
    //       payload:{
    //         tableData:resultData,
    //         currentRentedTotal:currentRentedTotal,
    //         currentRentedPage:currentRentedPage,
    //         tableLoading:false,
    //       }
    //     })
    //   }else{
    //     yield put({type:'togglePrompt',payload:{
    //       type:'error',
    //       title:'失败!',
    //       description:'获取已售列表失败!',
    //       visible:true,
    //       todo:"closeModal"
    //     }})
    //   }
    // },
    *offLine({payload},{call,put}){
      const {data}=yield call(secondhouseOffLine,{...payload})
      if(!!data&&data.status==="success"){
        yield put({type:'getInitRentingData',payload:{...payload}})
        yield put({type:'saveRentingTableData',payload:{offLineStatus:false}})
      }else{
        message.error(data.message)
      }
    },
    *initialFindAll({payload},{call,put}){
      yield put({
        type:"getInitCitys",
      })
      yield put({
        type:"getInitRentingData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已发布",
          resourcesType:"住宅",
          saleWay:'出租',
          keyword:'',
          fullPath:'/河北省/保定市',
          isCooperationSale:'',
        }
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
       if(location.pathname === '/resourceManagement/secondhandHouseRent'){
         dispatch({type:'initialFindAll'})
        //  dispatch({
        //    type:"getInitCitys",
        //  })
        //  dispatch({
        //    type:"getInitRentingData",
        //    payload:{
        //      pageSize:10,
        //      pageNo:0,
        //      houseState:"已发布",
        //      resourcesType:"住宅",
        //      saleWay:"出租",
        //    }
        //  })
       }
      });
    },
  },

}
