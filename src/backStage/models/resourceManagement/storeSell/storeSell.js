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
} from'../../../services/resourceManagement/newHouseProDetails/detailsIndex'
import {message} from 'antd';
export default{
  namespace:'storeSell',
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
    saleWay:'出售',
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
    saveSellingTableData(state,action){
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
            loading:false,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *getInitSellingData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=[];
        const currentSellingTotal=data.data.totalElements;
        const currentSellingPage=data.data.number;
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
            price:item.price,
          })
        })
        yield put({
          type:"saveSellingTableData",
          payload:{
            tableData:resultData,
            currentSellingTotal:currentSellingTotal,
            currentSellingPage:currentSellingPage,
            loading:false,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            resourcesType:payload.resourcesType,
            houseState:payload.houseState,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            saleWay:'出售',
            isCooperationSale:payload.isCooperationSale,
          }
        })
      }else{
        message.error('出错了，请联系管理员')
      }
    },
    // *getInitSelledData({payload},{call,put}){
    //   const {data}=yield call(getInitDataFetch,{...payload})
    //   if(!!data&&data.status==='success'){
    //     const resultData=[];
    //     const currentSelledTotal=data.data.totalElements;
    //     const currentSelledPage=data.data.number;
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
    //       type:"saveSellingTableData",
    //       payload:{
    //         tableData:resultData,
    //         currentSelledTotal:currentSelledTotal,
    //         currentSelledPage:currentSelledPage,
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
      const {data}=yield call(secoffLineFetch,{...payload})
      if(!!data&&data.status==="success"){
        message.success('下架成功');
        yield put({type:'getInitSellingData',payload:{...payload}})
        yield put({type:'changeTableLoading',payload:{offLineStatus:false}})
      }else{
        message.error('下架失败，请联系管理员');
      }
    },
    *initialFindAll({payload},{call,put}){
      yield put({
        type:"getInitCitys",
      })
      yield put({
        type:"getInitSellingData",
        payload:{
          pageSize:10,
          resourcesType:"商铺",
          pageNo:0,
          houseState:"已发布",
          saleWay:'出售',
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
       if(location.pathname === '/resourceManagement/storeSell'){
         dispatch({type:'initialFindAll'})
        //  dispatch({
        //    type:"getInitCitys",
        //  })
        //  dispatch({
        //    type:"getInitSellingData",
        //    payload:{
        //      pageSize:10,
        //      pageNo:0,
        //      houseState:"已发布",
        //      resourcesType:"商铺",
        //      saleWay:"出售"
        //    }
        //  })
       }
      });
    },
  },

}
