import {getInitTableDataFetch,getDetailsInfosFetch,aduitPassFetch,aduitRejectFetch,transferPassFetch,getPeopleDataFetch} from '../../services/loanManagement/secondHandHouseSolution';
import request from '../../../commons/utils/request';
import {
  renderTotalMoneyStr,
} from '../../../commons/utils/publicFunction'
import qs from 'qs';

export default {
  namespace: 'secondHandHouseSolution',
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
       if (location.pathname === '/loanManagement/secondHandHouseSolution') {
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
          name:"二手房解押贷款办理"
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
            loanAmount:`${item.releaseAmount}元`,
            propertyType:item.propertyType,
            recordId:item.recordId,
            resourceArea:`${parseFloat(item.resourceArea)}㎡`,
            resourcesInfo:resourcesInfo.default,
            totalPrice:renderTotalMoneyStr(item.totalPrice),
            transCode:item.transCode,
          })
        })
        yield put({type:"saveInitTableData",payload:{
          tableData:resultData,
          keyWords:payload.keyWords,
          currentPage:data.data.number,
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
          detailsTableData.resourceArea=`${parseFloat(applyinfo.resourceArea)}`;
          detailsTableData.totalPrice=renderTotalMoneyStr(applyinfo.totalPrice);
          detailsTableData.resourceSupportLoan=!!applyinfo.resourceSupportLoan?'支持':'不支持';
          detailsTableData.applyDateTime=applyinfo.applyDateTime;
          //购房意向
          complete.commissionPaid=applyinfo.commissionPaid;
          complete.firstPayMentPaid=applyinfo.firstPayMentPaid;
          complete.intentionPaid=applyinfo.intentionPaid;
          //贷款信息
          transferInformation.ownerName=applyinfo.ownerName;
          transferInformation.ownerPhone=applyinfo.ownerPhone;
          // transferInformation.loanType=applyinfo.loanType;
          transferInformation.loanAmount=applyinfo.loanAmount;
          // transferInformation.loanTerm=applyinfo.loanTerm;


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
      const {data}=yield call(aduitRejectFetch,{...payload});
      if(!!data){
        if(data.status==='success'){
          yield put({
            type:"togglePrompt",
            payload:{
              type:'success',
              title:'驳回成功!',
              description:'',
              visible:true,
              todo:"closeModalAndInit"
            }
          })
        }else{
          yield put({
            type:"togglePrompt",
            payload:{
              type:'error',
              title:`${data.message}`,
              description:data.message,
              visible:true,
              todo:"closeModal"
            }
          })
        }
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
      const {data}=yield call(aduitPassFetch,{...payload});
      if(!!data){
        if(data.status==='success'){
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
              title:'受理失败!',
              description:data.message,
              visible:true,
              todo:"closeModal"
            }
          })
        }
      }else{
        yield put({
          type:"togglePrompt",
          payload:{
            type:'error',
            title:'受理失败!',
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
      if(!!data){
        if(data.status==='success'){
          yield put({
            type:"togglePrompt",
            payload:{
              type:'success',
              title:'完成解押成功!',
              description:'',
              visible:true,
              todo:"closeModalAndInit"
            }
          })
        }else{
          yield put({
            type:"togglePrompt",
            payload:{
              type:'error',
              title:'解押失败!',
              description:data.message,
              visible:true,
              todo:"closeModal"
            }
          })
        }
      }else{
        yield put({
          type:"togglePrompt",
          payload:{
            type:'error',
            title:'解押失败!',
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
