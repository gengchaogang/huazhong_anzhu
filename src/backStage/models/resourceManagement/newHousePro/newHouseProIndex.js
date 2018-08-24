function _toCascaderOptions(arr){
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: code, label:lable}, children;
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
  getInitDataFetch,
  getInitCitysFetch,
  offLineFetch,
  getDealCenterDataFetch,
} from '../../../services/resourceManagement/newHousePro/newHouseProIndex';
export default {
  namespace: 'newHouseProIndex',
  state: {
    totalElements:null,
    dealCenterData:[],
    areaAndCode:[],
    areaPath:'',
    visible:false,
    currentRecord:[],
    showPicList:[],
    offLineDate:null,
    tableLoading:true,
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
  subscriptions:{
    setup({ dispatch, history }) {
       history.listen(location => {
        if(location.pathname === '/resourceManagement/newHousePro'){
          // dispatch({
          //   type:"getInitData",
          //   payload:{
          //     pageSize:10,
          //     pageNo:0
          //   }
          // })
          // dispatch({
          //   type:"getInitCitys",
          // })
          // dispatch({
          //   type:"getDealCenterData",
          // })
          dispatch({type:'initialFindAll'})
        }
      });
    },
  },
  reducers: {
    initial(state){
      return{...state,defaultValue:'报备'}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    changePicList(state,action){
      return{...state,showPicList:action.payload}
    },
    saveAreaPath(state,action){
      return{...state,...action.payload}
    },
    changeTableLoading(state,action){
      return{...state,...action.payload}
    },
    saveCurrentRecord(state,action){
      return{...state,...action.payload}
    },
    saveDate(state,action){
      return{...state,...action.payload}
    },
    saveAreaCode(state,action){
      return{...state,...action.payload}
    },
    showOffLineModal(state,action){
      return{...state,...action.payload}
    },
    savaTableData(state,action){
      return{...state,...action.payload}
    },
    saveDealCenterData(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *initialFindAll({payload},{call,put}){
      yield put({
        type:"getInitData",
        payload:{
          pageSize:10,
          pageNo:0,
          areaPath:'/河北省/保定市',
          status:'',
        }
      })
      yield put({
        type:"getInitCitys",
      })
      yield put({
        type:"getDealCenterData",
      })
    },
    *getInitData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      const resultData=[];
      if(!!data&&data.status==="success"){
        const totalElements=data.data.totalElements;
        data.data.content.map((item,index)=>{
          resultData.push({
            key:item.id,
            number:index+1,
            areaPath:item.areaPath,
            createDateTime:item.createDateTime,
            createUser:item.createUser,
            discount:item.discount,
            lookNumber:item.lookNumber,
            name:item.name,
            nextStatus:item.nextStatus,
            price:item.price,
            sellTotle:item.sellTotle,
            status:item.status,
            tradingCenterName:item.tradingCenterName,
            transactionsNumber:item.transactionsNumber,
          })
        })
        yield put({
          type:"savaTableData",
          payload:{
            tableData:resultData,
            tableLoading:false,
            totalElements:totalElements,
          }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitCitys({payload},{call,put}){
      const areaAndCode=[];
      const {data}=yield call(getInitCitysFetch)
      if(!!data&&data.status==='success'){
        if(!!data.data){
          const reusltData=_toCascaderOptions(data.data)
          yield put({type:"saveAreaCode",payload:{
            areaAndCode:reusltData
          }})
        }
      }
    },
    *offLine({payload},{call,put}){
      const {data}=yield call(offLineFetch,{...payload})
      if(!!data&&data.status==="success"){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'申请下架成功!',
          visible:true,
          cancelText:"",
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'申请下架失败!',
          visible:true,
          cancelText:"",
          todo:"closeModal"
        }})
      }
    },
    *getDealCenterData({payload},{call,put}){
      const {data}=yield call(getDealCenterDataFetch)
      if(!!data&&data.status==="success"){
        const dealCenterData=[];
        if(!!data.data&&data.data.length!==0){
          data.data.map((item,index)=>{
            dealCenterData.push({
              code:item.code,
              id:item.id,
              name:item.name
            })
          })
        }
        yield put({
          type:"saveDealCenterData",payload:{
            dealCenterData:dealCenterData
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取交易中心数据失败!请重新刷新页面',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  },
}
