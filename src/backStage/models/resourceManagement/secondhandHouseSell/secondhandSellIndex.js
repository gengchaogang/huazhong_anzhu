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
  secoffLineFetch,
} from  '../../../services/resourceManagement/newHouseProDetails/detailsIndex'
export default{
  namespace:'secondHandSellIndex',
  state:{
    currentRecord:null,
    id:'',
    pageNo:'',
    tableData:[],
    currentSellingPage:null,
    currentSellingTotal:null,
    currentSelledPage:null,
    currentSelledTotal:null,
    activeKey:'selling',
    tableLoading:true,
    areaPath:null,
    areaAndCode:[],
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
   isCooperationSale:'',
   fullPath:'',
   keyword:'',
   offLineStatus:false,
   saleWay:'出售',
   pageNo:'',
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
            saleMode:(item.isCooperationSale=='开启'?'合作':'私有'),
            houseType:item.houseType,
            floorArea:item.floorArea,
            totlePrice:item.totlePrice,
            price:item.price,
            createDate:item.createDate,
            transCode:item.transCode,
          })
        })
        yield put({
          type:"saveSellingTableData",
          payload:{
            tableData:resultData,
            currentSellingTotal:currentSellingTotal,
            currentSellingPage:currentSellingPage,
            pageNo:data.data.number+1,
            tableLoading:false,
            offLineStatus:false,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取在售列表失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getonSearchData({payload},{call,put}){
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
            saleMode:(item.isCooperationSale=='开启'?'合作':'私有'),
            communityName:item.communityName,
            houseType:item.houseType,
            floorArea:item.floorArea,
            createDate:item.createDate,
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
            tableLoading:false,
            pageNo:data.data.number+1,
            isCooperationSale:payload.isCooperationSale,
            fullPath:payload.fullPath,
            keyword:payload.keyword,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取在售列表失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitSelledData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=[];
        const currentSelledTotal=data.data.totalElements;
        const currentSelledPage=data.data.number;
        data.data.content.map((item,index)=>{
          resultData.push({
            key:item.id,
            number:index+1,
            areaName:item.areaName,
            communityName:item.communityName,
            saleMode:(item.isCooperationSale=='开启'?'合作':'私有'),
            houseType:item.houseType,
            floorArea:item.floorArea,
            totlePrice:item.totlePrice,
            price:item.price,
          })
        })
        yield put({
          type:"saveSellingTableData",
          payload:{
            tableData:resultData,
            currentSelledTotal:currentSelledTotal,
            currentSelledPage:currentSelledPage,
            tableLoading:false,
            pageNo:data.data.number+1,
            saleWay:payload.saleWay,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取已售列表失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *offLine({payload},{call,put}){
      const {data}=yield call(secoffLineFetch,{...payload})
      if(!!data&&data.status==="success"){
        if(!!data.data.id){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'下架成功!',
            visible:true,
            todo:"closeModalAndFetch"
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'下架失败!',
          visible:true,
          todo:"closeModal"
        }})
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
          pageNo:0,
          houseState:"已发布",
          resourcesType:"住宅",
          saleWay:"出售",
          fullPath:'/河北省/保定市',
        }
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
       if(location.pathname === '/resourceManagement/secondhandHouseSell'){
        //  dispatch({
        //    type:"getInitCitys",
        //  })
        //  dispatch({
        //    type:"getInitSellingData",
        //    payload:{
        //      pageSize:10,
        //      pageNo:0,
        //      houseState:"已发布",
        //      resourcesType:"住宅",
        //      saleWay:"出售",
        //    }
        //  })
         dispatch({type:'initialFindAll'})
       }
      });
    },
  },

}
