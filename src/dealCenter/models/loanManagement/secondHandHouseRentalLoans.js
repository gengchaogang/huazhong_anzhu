import {
  getInitTableDataFetch,
  getDetailsInfosFetch,
  aduitPassFetch,
  aduitRejectFetch,
  transferPassFetch,
  getPeopleDataFetch,
} from '../../services/loanManagement/secondHandHouseRentalLoans';
import request from '../../../commons/utils/request';
import {
  renderTotalMoneyStr,
} from '../../../commons/utils/publicFunction'
import qs from 'qs';

export default {
  namespace: 'secondHandHouseRentalLoans',
  state: {
    form:null,
    peoples:[],
    tableLoading:true,
    currentPage:0,
    tableData:[],
    totalElements:null,
    detailsModal:{
      visible:false,
      currentRecord:{},
    },
    keyWords:'',
    detailsTableData:[],
    completeBusiness:{},
    transferInformation:{},
    auditinfos:[],
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
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/loanManagement/secondHandHouseRentalLoans') {
        //  dispatch({type:'initComponent'})
        setTimeout(()=>dispatch({
          type:'initComponent',
        }),0);
       }
     });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({
        type: 'getInitTableData',
        payload:{
          pageSize:10,
          pageNo:0,
          keyWords:'',
        }
      });
      yield put({
        type: 'getPeopleData',
        payload:{
          name:"二手房出租分期办理"
        }
      });
    },
    *getPeopleData({payload},{call,put}){
      const {data}=yield call(getPeopleDataFetch,{...payload})
      const peoples=[];
      if(!!data&&data.status==="success"){
        data.data.map(item=>{
          peoples.push({
            id:item.id,
            name:item.name,
            userId:item.userId,
          })
        })
      }
      yield put({
        type:"savePeoples",
        payload:{peoples:peoples}
      })
    },
    *getInitTableData({ payload }, { call, put }){
      const  {data}  = yield call(getInitTableDataFetch, {...payload});
      if(!!data&&data.status==='success'){
        const resultData=[];
        let resourcesInfo
        data.data.content.map((item,index)=>{
          if(!!item.resourcesInfo){
            resourcesInfo =JSON.parse(item.resourcesInfo)
          }
          resultData.push({
            number:index+1,
            key:item.applyId,
            applyAuditStatus:item.applyAuditStatus,
            applyDateTime:item.applyDateTime,
            auditStatus:item.auditStatus,
            communityName:item.communityName,
            customerName:item.customerName,
            customerPhone:item.customerPhone,
            ownerName:item.ownerName,
            ownerPhone:item.ownerPhone,
            customerType:item.customerType,
            loanAmount:`${item.loanAmount}元`,
            propertyType:item.propertyType,
            paymentMethod:resourcesInfo.paymentMethod,
            actualRent:`${parseFloat(resourcesInfo.totlePrice)}元`,
            recordId:item.recordId,
            resourceArea:item.resourceArea,
            resourcesInfo:resourcesInfo.default,
            totalPrice:renderTotalMoneyStr(item.totalPrice),
            transCode:item.transCode,
          })
        })
        yield put({type:"saveInitTableData",payload:{
          tableData:resultData,
          currentPage:data.data.number,
          keyWords:payload.keyWords,
          totalElements:data.data.totalElements
        }})
        yield put({
          type:"closeLoading",
          payload:{
            tableLoading:false
          }
        })
      }
    },
    *getDetailsInfos({payload},{select,call,put}){
      const {data}=yield call(getDetailsInfosFetch,{...payload})
      const detailsTableData={};
      const complete={};
      const transferInformation={};
      let auditinfos;
      if(!!data&&data.status==="success"){
        if(!!data.data){
          auditinfos=data.data.auditinfos;
          const applyinfo=data.data.applyinfo
          const resourcesInfo=JSON.parse(applyinfo.resourcesInfo)
          detailsTableData.key=applyinfo.resourcesId;
          detailsTableData.propertyType=applyinfo.propertyType;
          detailsTableData.communityName=applyinfo.communityName;
          detailsTableData.resourcesInfo=resourcesInfo.default;
          detailsTableData.resourceArea=`${parseFloat(applyinfo.resourceArea)}㎡`;
          detailsTableData.paymentMethod=resourcesInfo.paymentMethod;
          detailsTableData.leaseTerm=!!applyinfo.leaseTerm?`${applyinfo.leaseTerm}月`:"-";
          detailsTableData.rentalMode=!!resourcesInfo.rentalMode?resourcesInfo.rentalMode:"-";
          // detailsTableData.actualRent=applyinfo.actualRent;
          if(applyinfo.propertyType==="住宅"){
            detailsTableData.actualRent=`${parseFloat(resourcesInfo.totlePrice)}元/月`;
          }else if(applyinfo.propertyType==="商铺"||applyinfo.propertyType==="写字楼"){
            detailsTableData.actualRent=`${parseFloat(resourcesInfo.totlePrice)}元/㎡/天`;
          }
          //购房意向
          complete.commissionPaid=applyinfo.commissionPaid;
          complete.intentionPaid=applyinfo.intentionPaid;
          //贷款信息
          transferInformation.customerName=applyinfo.customerName;
          transferInformation.customerPhone=applyinfo.customerPhone;
          transferInformation.loanType=applyinfo.loanType;
          transferInformation.customerMaterials=JSON.parse(applyinfo.customerMaterials).join("、");
          transferInformation.loanAmount=applyinfo.loanAmount;
          transferInformation.loanRate=applyinfo.loanRate;
          transferInformation.loanTerm=applyinfo.loanTerm;
          transferInformation.customerType=applyinfo.customerType;


          yield put({
            type:"saveInitTableData",
            payload:{
              detailsTableData:[detailsTableData],
              completeBusiness:complete,
              transferInformation:transferInformation,
              auditinfos:auditinfos
            }
          })
          yield put({
            type:"toggleShowDetailsModal",
            payload:{
                visible:true,
            }
          })
        }
      }
    },
    *aduitReject({payload},{call,put}){
      if(!payload.oprationPwd){
        payload.oprationPwd = 'null'
      }
      const {data}=yield call(aduitRejectFetch,{...payload})
      if(!!data&&data.status=="success"){
        yield put({
          type:"togglePrompt",
          payload:{
            type:'success',
            title:'成功!',
            description:'驳回成功!',
            visible:true,
            todo:"closeModalAndInit"
          }
        })
      }else{
        yield put({
          type:"togglePrompt",
          payload:{
            type:'error',
            title:'失败!',
            description:`${data.message}`,
            visible:true,
            todo:"closeModal"
          }
        })
      }
    },
    *aduitPass({payload},{call,put}){
      if(!payload.oprationPwd){
        payload.oprationPwd = 'null'
      }
      const {data}=yield call(aduitPassFetch,{...payload})
      if(!!data&&data.status==='success'){
        yield put({
          type:"togglePrompt",
          payload:{
            type:'success',
            title:'成功!',
            description:'受理成功!',
            visible:true,
            todo:"closeModalAndInit"
          }
        })
      }else{
        yield put({
          type:"togglePrompt",
          payload:{
            type:'error',
            title:'失败!',
            description:`${data.message}`,
            visible:true,
            todo:"closeModal"
          }
        })
      }
    },
    *transferPass({payload},{call,put}){
      if(!payload.oprationPwd){
        payload.oprationPwd = 'null'
      }
      const {data}=yield call(transferPassFetch,{...payload})
      if(!!data&&data.status==='success'){
        yield put({
          type:"togglePrompt",
          payload:{
            type:'success',
            title:'成功!',
            description:'完成批款成功!',
            visible:true,
            todo:"closeModalAndInit"
          }
        })
      }else{
        yield put({
          type:"togglePrompt",
          payload:{
            type:'error',
            title:'失败!',
            description:`${data.message}`,
            visible:true,
            todo:"closeModal"
          }
        })
      }
    }
  },
  reducers: {
    saveForm(state,action){
      return{...state,...action.payload}
    },
    closeLoading(state,action){
      return{...state,...action.payload}
    },
    savePeoples(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    toggleShowDetailsModal(state,action){
      return {...state,detailsModal:Object.assign({},state.detailsModal,{...action.payload})}
    },
    saveRecordAndShowModal(state,action){
      return{...state,...action.payload}
    },
    saveInitTableData(state,action){
      return{...state,...action.payload}
    },
    changeSizeCurrent(state,action){
      return { ...state, ...action.payload };
    },
  },
}
