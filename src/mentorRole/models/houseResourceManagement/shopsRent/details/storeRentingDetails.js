import {
  getInitDataFetch,houseOffLine
} from  '../../../../services/newHouseProDetails/detailsDetails'
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'storeRentingDetails',
  state: {
    houseImgs:null,
    pics:null,
    detailsData:{},
    projectId:null,
    modalVisible:false,
    submitLoading:false,
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
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    changeSubmitLoading(state,action){
      return{...state,...action.payload}
    },
    saveDetailsData(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *offLineSecondHouse({payload},{call,put}){
      const {data}=yield call(houseOffLine,{...payload});
      if(data.data){
        // yield put({
        //   type:'getInitData',
        //   payload:{
        //   pageSize:10,
        //   pageNo:0,
        //   houseState:"已发布",
        //   resourcesType:"住宅",
        //   saleWay:"出售",
        // }})
        yield put({type:'saveDetailsData',payload:{modalVisible:false}})
        yield put(routerRedux.goBack());
      }else{
        message.error(data.message)
      }
    },
    *getInitData({payload},{call,put}){
      const {data}=yield call(getInitDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const showData={};
        const pics={};
        const resultData=data.data.houseBaseInfo;
        if(data.data.listOwer.length!==0){
          data.data.listOwer.map(item=>{
            pics.commissionContractPicture=item.commissionContractPicture;
            pics.idPicture=item.idPicture;
            pics.propertyPicture=item.propertyPicture;
          })
        }
        switch (resultData.houseState) {
          case '已发布':showData.houseState='在售'; break;
          case '已售':showData.houseState='已售'; break;
          default:showData.houseState='已下架'; break;
        }
        const houseImgs=[];
        if(!!resultData.outFiles&&!!resultData.outFiles.length!==0){
          resultData.outFiles.map((item,index)=>{
            if(item.isUse==='是'){
              houseImgs.push(item.path)
            }
          })
        }
        showData.resourcesNumber=resultData.resourcesNumber;
        showData.communityName=resultData.communityName;
        showData.areaName=resultData.areaName;
        showData.houseType=resultData.houseType;
        showData.paymentMethod=resultData.paymentMethod;
        showData.floorArea=resultData.floorArea;
        showData.createDate=resultData.createDate;
        showData.rentType=resultData.rentType;
        showData.totlePrice=resultData.totlePrice;
        showData.shopCurrentStatus=resultData.shopCurrentStatus;
        showData.split=resultData.split;
        showData.address=resultData.address;
        showData.rental=resultData.rental;
        showData.innerArea=resultData.innerArea;
        showData.expectPrice=resultData.expectPrice;
        showData.supportMortgage=resultData.supportMortgage;
        showData.decoration=resultData.decoration;
        showData.orientations=resultData.orientations;
        showData.storey=resultData.storey;
        showData.buildingAge=resultData.buildingAge;
        if(!!resultData.roomConfiguration&&resultData.roomConfiguration.length!==0){
          showData.roomConfiguration=JSON.parse(resultData.roomConfiguration);
        }
        if(!!resultData.characteristics&&resultData.characteristics.length!==0){
          showData.characteristics=JSON.parse(resultData.characteristics);
        }
        showData.shopType=resultData.shopType;
        showData.businessCategory=resultData.businessCategory;
        // if(!!resultData.shopType&&resultData.shopType.length!==0){
        //   showData.shopType=JSON.parse(resultData.shopType);
        // }
        // if(!!resultData.businessCategory&&resultData.businessCategory.length!==0){
        //   showData.businessCategory=JSON.parse(resultData.businessCategory);
        // }
        yield put({
          type:"saveDetailsData",
          payload:{
            detailsData:showData,
            pics:pics,
            houseImgs:houseImgs,
          }
        })
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
           if (location.pathname === '/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingDetails') {
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
