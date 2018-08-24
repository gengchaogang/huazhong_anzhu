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
  offLineFetch,secoffLineFetch,
} from  '../../../services/resourceManagement/newHouseProDetails/detailsIndex'
import {message} from 'antd';
export default{
  namespace:'storeRent',
  state:{
    tableData:[],
    loading:false,
    areaAndCode:[],
    resourcesType:"商铺",
    pageNo:0,
    houseState:"已发布",
    keyword:'',
    fullPath:'',
    offLineStatus:false,
    saleWay:'出租',
    isCooperationSale:'',
    total:'',
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
    *offLine({payload},{call,put}){
      const {data}=yield call(secoffLineFetch,{...payload})
      if(data.data){
        message.success('下架成功');
        yield put({type:'getInitRentingData',payload:{...payload}})
        yield put({type:'changeTableLoading',payload:{offLineStatus:false}})
      }else{
        message.error('下架失败，请联系管理员');
      }
    },
    *getInitCitys({payload},{call,put}){
      const {data}=yield call(getInitCitysFetch,{...payload})
      if(!!data&&data.status==='success'){
        const reusltData=_toCascaderOptions(data.data)
        yield put({
          type:"saveAreaPath",
          payload:{
            areaAndCode:reusltData,
            tableLoading:false,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取城市列表失败!',
          visible:true,
          todo:"closeModal"
        }})
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
            resourcesType:"商铺",
            saleWay:'出租',
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            houseState:payload.houseState,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            isCooperationSale:payload.isCooperationSale,
          }
        })
      }else{
        message.error('获取列表失败，请联系管理员')
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
    // *offLine({payload},{call,put}){
    //   const {data}=yield call(offLineFetch,{...payload})
    //   if(!!data&&data.status==="success"){
    //     if(!!data.data.id){
    //       yield put({type:'togglePrompt',payload:{
    //         type:'success',
    //         title:'成功!',
    //         description:'下架成功!',
    //         visible:true,
    //         todo:"closeModalAndFetch"
    //       }})
    //     }
    //   }else{
    //     yield put({type:'togglePrompt',payload:{
    //       type:'error',
    //       title:'失败!',
    //       description:'下架失败!',
    //       visible:true,
    //       todo:"closeModal"
    //     }})
    //   }
    // },
    *initialFindAll({payload},{call,put}){
      yield put({
        type:"getInitCitys",
      })
      yield put({
        type:"getInitRentingData",
        payload:{
          pageSize:10,
          resourcesType:"商铺",
          pageNo:0,
          houseState:"已发布",
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
       if(location.pathname === '/resourceManagement/storeRent'){
         dispatch({
           type:'initialFindAll'
         })
        //  dispatch({
        //    type:"getInitCitys",
        //  })
        //  dispatch({
        //    type:"getInitRentingData",
        //    payload:{
        //      pageSize:10,
        //      pageNo:0,
        //      houseState:"已发布",
        //      resourcesType:"商铺",
        //      saleWay:"出租"
        //    }
        //  })
       }
      });
    },
  },

}
