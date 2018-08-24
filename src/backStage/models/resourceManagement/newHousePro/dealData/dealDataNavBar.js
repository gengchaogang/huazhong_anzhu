import {
  getInitRecordTableDataFetch,
  getViewedTableDataFetch,
  getDiscountTableDataFetch,
  getDealTableDataFetch,
} from '../../../../services/resourceManagement/newHousePro/dealDataNavBar'
import { message} from 'antd';
export default{
  namespace: 'dealDataNavBar',
  state:{
    projectName:null,
    tradingCenterName:null,
    projectId:null,
    businessClassification:"报备",
    totalElements:null,
    tableData:[],
    tableLoading:true,
    reajectReason:null,
    visible:false,
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
   reportstate:'',
   roadioStatus:'',
   pageNo:0,
  },
  subscriptions:{
    setup({ dispatch, history }) {
       history.listen(location => {
        if(location.pathname === '/resourceManagement/newHousePro/dealData'){
          dispatch({
            type:"saveProject",
            payload:{
              projectName:location.state.name,
              tradingCenterName:location.state.tradingCenterName,
              projectId:location.state.projectId,
              businessClassification:"报备",
            }
          })
          dispatch({
            type:"getInitRecordTableData",
            payload:{
              pageSize:10,
              pageNo:0,
              projectId:location.state.projectId,
              reportstate:'',
            }
          })
        }
      });
    },
  },
  reducers:{
    saveProject(state,action){
      return{...state,...action.payload}
    },
    closeModal(state,action){
      return{...state,...action.payload}
    },
    saveTableData(state,action){
      return{...state,...action.payload}
    },
    changeBusinessClassification(state,action){
      return{...state,...action.payload}
    },
    changeLoading(state,action){
      return{...state,...action.payload}
    },
    saveCurrentReason(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
  effects:{
    *getInitRecordTableData({payload},{call,put}){
      const {data,err}=yield call(getInitRecordTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const resultData=[];
      let totalElements;
      if(!!data&&data.status==="success"){
        totalElements=data.data.totalElements;
        data.data.content.map((item,index)=>{
          resultData.push({
            key:item.id,
            number:index+1,
            brokerId:item.brokerId,
            brokerName:item.brokerName,
            createTime:item.createTime,
            customerId:item.customerId,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            customerSex:item.customerSex,
            id:item.id, //报备ID
            intentHouse:item.intentHouse,
            groupKey:item.groupKey,
            intentHouseId:item.intentHouseId,
            project:item.project,
            projectsId:item.projectsId,
            propertyType:item.propertyType,
            reasonForRejection:item.reasonForRejection,
            status:item.status,
            toVisitTime:item.toVisitTime,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:resultData,
            totalElements:totalElements,
            tableLoading:false,
            pageNo:data.data.number+1,
            reportstate:payload.reportstate,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取报备初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getViewedTableData({payload},{call,put}){
      const {data,err}=yield call(getViewedTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==="success"){
        const resultData=[];
        let totalElements;
        data.data.content.map((item,index)=>{
          totalElements=data.data.totalElements;
          resultData.push({
            number:index+1,
            key:item.id,
            brokerId:item.brokerId,
            brokerInfo:item.brokerInfo,
            brokerName:item.brokerName,
            brokerPhone:item.brokerPhone,
            createTime:item.createTime,
            customerId:item.customerId,
            customerInfo:item.customerInfo,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            customerSex:item.customerSex,
            intentHouse:item.intentHouse,
            intentHouseId:item.intentHouseId,
            intentHouseInfo:item.intentHouseInfo,
            groupKey:item.groupKey,
            project:item.project,
            projectsId:item.projectsId,
            propertyType:item.propertyType,
            protectDay:item.protectDay,
            showTime:item.showTime,
            status:item.status,
            updateTime:item.updateTime,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:resultData,
            totalElements:totalElements,
            tableLoading:false,
            pageNo:data.data.number+1,
            roadioStatus:payload.state,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取确看初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getDiscountTableData({payload},{call,put}){
      const {data,err}=yield call(getDiscountTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==="success"){
        const resultData=[];
        let totalElements;
        totalElements=data.data.totalElements;
        data.data.content.map((item,index)=>{
          resultData.push({
            number:index+1,
            key:item.id,
            brokerId:item.brokerId,
            brokerName:item.brokerName,
            customerId:item.customerId,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            groupKey:item.groupKey,
            groupbuyCreateTime:item.groupbuyCreateTime,
            groupbuyMoney:item.groupbuyMoney,
            groupbuyStatus:item.groupbuyStatus,
            house:item.house,
            id:item.id,
            isUploadAgreement:item.isUploadAgreement,
            projectFavorableId:item.projectFavorableId,
            projectFavorableName:item.projectFavorableName,
            propertyType:item.propertyType,
            refundStatus:item.refundStatus,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:resultData,
            totalElements:totalElements,
            tableLoading:false,
            pageNo:data.data.number+1,
            roadioStatus:payload.state,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取电商优惠初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getDealTableData({payload},{call,put}){
      const {data,err}=yield call(getDealTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==="success"){
        const resultData=[]
        let totalElements;
        totalElements=data.data.totalElements;
        data.data.content.map((item,index)=>{
          resultData.push({
            number:index+1,
            key:item.id,
            auditStatus:item.auditStatus,
            brokerId:item.brokerId,
            brokerName:item.brokerName,
            brokerPhone:item.brokerPhone,
            customerId:item.customerId,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            discountId:item.discountId,
            discountName:item.discountName,
            houseId:item.houseId,
            houseName:item.houseName,
            groupKey:item.groupKey,
            houseId:item.houseId,
            houseName:item.houseName,
            id:item.id,
            isAllow:item.isAllow,
            isFinish:item.isFinish,
            projectId:item.projectId,
            projectName:item.projectName,
            propertyType:item.propertyType,
            totalPrice:item.totalPrice,
            txStatus:item.txStatus,
            txTime:item.txTime,
            unitPrice:item.unitPrice,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:resultData,
            totalElements:totalElements,
            tableLoading:false,
            pageNo:data.data.number+1,
            roadioStatus:payload.state,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取成交初始数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  },
}
