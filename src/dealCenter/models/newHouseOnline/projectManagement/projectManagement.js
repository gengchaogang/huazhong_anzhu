import { routerRedux } from 'dva/router'
import {
  getInitTableDataFetch,
  offLineFetch,
  getDetailsDataFetch,
  getInitAuditDataFetch,
  getInitOffLineDataFetch,
  projectsAuditOneFetch,
  projectsByOneFetch,
  publishWithdrawFetch,
  projectReleaseFetch,
  getBriefInfoFetch,
  offlineWithdrawFetch,
  getInitEmployeesFetch,
  getEditTableDataFetch,
} from '../../../services/newHouseOnline/projectManagement';
import {
  isNull,
} from '../../../../commons/utils/currencyFunction'
import {
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import lodash from 'lodash';
const initState={
  employees:[],
  showReleasePicList:[],
  releaseAuditVisible:false,
  releaseAuditData:[],
  publishImages:[],
  publishReason:null,
  publishAuditContent:[],
  publishDetailsData:[],
  reEditModal:{
    visible:false,
    projectId:null,
  },
  detailsModal:{
    visible:false,
    currentRecord:{}
  },
  detailsPulishModal:{
    publishVisible:false,
    currentRecord:{}
  },
  offlineReason:null,
  tableLoading:true,
  projectId:null,
  currentPage:null,
  saleItems:[],
  audit:[],
  reasonImages:[],
  underFrameProject:[],
  totalElements:null,
  saleItemsTableData:[],
  auditTableData:[],
  offLineTableData:[],
  eidtTableData:[],
  currentRecord:{},
  detailsTableData:[],
  visible:false,
  auditInfos:[],
  showPicList:[],
  offLineTime:null,
  userName:null,
  currentKey:'saleItems',
  promptObj:{
   visible:false,
   description:'',
   title:'',
   promptFor:'default',
   okText:'确定',
   type:'',
   todo:'',
 },
 keyword:'',
 pagination:{
   current:1,
   total:0,
   pageSize:10,
 },
 activeTabelData:[],
 confirmModal:{
   visible:false,
   title:'',
   description:'',
   todo:'default',
   okText:'',
   cancelText:'',
   agr:null,
 },
}
export default {
  namespace: 'projectManagement',
  state: lodash.cloneDeep(initState),
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    showDetailsModal(state,action){
      return {...state,detailsModal:Object.assign({},state.detailsModal,{...action.payload})}
    },
    showPublishDetailsModal(state,action){
      return {...state,detailsPulishModal:Object.assign({},state.detailsPulishModal,{...action.payload})}
    },
    saveDate(state,action){
      return{...state,...action.payload}
    },
    changeLoading(state,action){
      return{...state,...action.payload}
    },
    showOffLineModal(state,action){
      return{...state,...action.payload}
    },
    releaseAuditModal(state,action){
      return{...state,...action.payload}
    },
    changeReleasePicList(state,action){
      return{...state,showReleasePicList:action.payload}
    },
    changePicList(state,action){
      return{...state,showPicList:action.payload}
    },
    saveUserName(state,action){
      return{...state,...action.payload}
    },
    saveTableData(state,action){
      return{...state,...action.payload}
    },
    saveOffLineData(state,action){
      return{...state,...action.payload}
    },
    changeTableTag(state,action){
      return{...state,...action.payload,pagination:initState.pagination}
    },
    saveDetailsData(state,action){
      return{...state,...action.payload}
    },
    closeReleaseAuditModal(state,action){
      return{...state,...action.payload}
    },
    saveEmployees(state,action){
      return{...state,...action.payload}
    },
    doOpenReEditModal(state,action){
      return {...state,reEditModal:{visible:true,projectId:action.payload}}
    },
    closeReEditModal(state,action){
      return {...state,reEditModal:{...state.reEditModal,visible:false}}
    },
    clearReEditModalProId(state,action){
      return {...state,reEditModal:{...state.reEditModal,projectId:null}}
    },
    updateKeyWords(state,action){
      return {...state,keyword:action.payload,pagination:initState.pagination}
    },
    updatePagination(state,action){
      return {...state,pagination:{...state.pagination,...action.payload}}
    },
    doCloseClearReEditModal(state,action){
      return {...state,reEditModal:lodash.cloneDeep(initState).reEditModal}
    },
    doInitState(state,action){
      return lodash.cloneDeep(initState)
    },
    openConfirmModal(state,action){
      return {...state,confirmModal:{...lodash.cloneDeep(initState).confirmModal,visible:true,...action.payload}}
    },
    closeCofirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,visible:false}}
    },
    initConfirmModal(state,action){
      return {...state,confirmModal:lodash.cloneDeep(initState)}
    },
    setActiveTableData(state,action){
      return {...state,...action.payload}
    },
    changeTableLoading(state,action){
      return {...state,tableLoading:action.paylaod,activeTabelData:[]}
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location => {
        if(location.pathname === '/newHouseOnline/projectManagement'){
          // dispatch({type:'initComponent'})
          setTimeout(()=>dispatch({
            type:'initComponent',
          }),0);
        }
      });
    },
  },
  effects:{
    //【确认模态框】打开模态框
    *renderConfirmModalTodo({payload},{put}){
      console.log('payload',payload);
      const {record,todo} = payload;
      if(todo === 'reEditOfflineApply'){
        yield put({
          type:'openConfirmModal',
          payload:{
            todo,
            title:'提示',
            description:'该项目为再编辑项目，如果该项目正在申请上线，申请下架会直接结束上线申请，是否确认执行下架申请？',
            okText:'确认',
            cancelText:'取消',
            agr:JSON.stringify(record),
          }
        })
      }
      else if(todo === 'offlineApply'){
        yield put({
          type:'openConfirmModal',
          payload:{
            todo,
            title:'提示',
            description:'该项目为已上线项目，是否确认执行下架申请？',
            okText:'确认',
            cancelText:'取消',
            agr:JSON.stringify(record),
          }
        })
      }
    },
    //【确认模态框】确认回调
    *confirmModalOkCallBack({payload},{select,put}){
      const {todo,agr} = yield select(({projectManagement})=>projectManagement.confirmModal)
      if(todo === 'reEditOfflineApply' || todo === 'offlineApply'){
        yield put({
          type:'readyOpenOfflineModal',
          payload:JSON.parse(agr)
        })
        yield put({
          type:'closeCofirmModal'
        })
      }
    },
    //【确认模态框】取消回调
    *confirmModalCancelCallBack({payload},{put}){
      yield put({
        type:'closeCofirmModal'
      })
    },
    //【确认模态框】关闭后回调
    *confirmModalAfterCloseCallBack({payload},{put}){
      yield put({
        type:'initConfirmModal'
      })
    },
    //打开下架申请模态框
    *readyOpenOfflineModal({payload},{select,put}){
      yield put({
        type:'showOffLineModal',
        payload:{
          visible:true,
        }
      })
      yield put({
        type:'saveOffLineData',
        payload:{
          projectId:payload.id,
          currentRecord:payload
        }
      })

    },
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({
        type:'doInitState'
      })
      yield put({
        type:"getInitEmployees",
        payload:{
          name:"项目下架审核"
        }
      })
      if(sessionStorage.getItem('project_manage')){
        const currentKey=sessionStorage.getItem('project_manage');
        yield put({
          type:'changeTableTag',
          payload:{
            currentKey,
            tableLoading:true,
          }
        })
        yield put({
          type:'getActiveTabTableData',
        })
      }else{
        yield put({
          type:'getActiveTabTableData',
        })
      }
    },
    *getInitEmployees({payload},{call,put}){
      const {data}=yield call(getInitEmployeesFetch,{...payload})
      if(!!data&&data.status==='success'){
        const employees=[];
        data.data.map((item)=>{
          employees.push(item)
        })
        yield put({
          type:"saveEmployees",
          payload:{
            employees:employees
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`请求表格数据失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //获取激活tab表格数据
    *getActiveTabTableData({payload},{put,select}){
      const {keyword,currentKey,pagination:{
        current,
        total,
        pageSize,
      }}=yield select(({projectManagement})=>projectManagement);
      yield put({
        type:'changeTableLoading',
        payload:true,
      })
      if(currentKey==='audit'){
        yield put({
          type:'getInitAuditData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
        })
      }
      else if(currentKey==='underFrameProject'){
        yield put({
          type:'getInitOffLineData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
        })
      }
      else if(currentKey==='saleItems'){
        yield put({
          type:'getInitTableData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
        })
      }
      else if(currentKey==='editTable'){
        yield put({
          type:'getEditTableData',
          payload:{
            pageSize,
            pageNo:current-1,
            keyword,
          }
        })
      }
    },
    //分页变化
    *changePage({payload},{put}){
      yield put({
        type:'updatePagination',
        payload:{
          current:payload,
        }
      });
      yield put({
        type:'getActiveTabTableData'
      })
    },
    //tag变化
    *changeActiveTagKeys({payload},{put}){
      const {currentKey}=payload;
      sessionStorage.setItem('project_manage',currentKey)
      yield put({
        type:'changeTableTag',
        payload,
      });
      yield put({
        type:'getActiveTabTableData',
      })
    },
    //打开确认执行再编辑模态框
    *openReEditModal({payload},{put}){
      yield put({
        type:'doOpenReEditModal',
        payload,
      })
    },
    //确认执行项目再编辑
    *doReEditProject({payload},{put}){
      yield put({
        type:'closeReEditModal',
      });
    },
    //关闭并清除项目再编辑模态框
    *closeClearReEditModal({payload},{put}){
      yield put({
        type:'doCloseClearReEditModal',
      });
    },
    //执行跳转到编辑页面
    *goToReEdit({payload},{put,select}){
      const {projectId}=yield select(({projectManagement})=>projectManagement.reEditModal);
      if(!!projectId){
        const id=projectId;
        yield put({type:'clearReEditModalProId'})
        yield put(routerRedux.push({
          pathname:'/newHouseOnline/projectManagement/createProject/basicMessage',
          state:{
            projectId:id,
            reEdit:true,
          }
        }));
      }
    },
    //打开【下架审核】审核详情模态框
    *getProOffLineAuditInfo({payload},{put}){
      console.log('打开【下架审核】审核详情模态框',payload);
      yield put({
        type:'showDetailsModal',
        payload:{
          visible:true,
          currentRecord:payload
        }
      })
      yield put({
        type:"projectsAuditOne",
        payload:{
          id:payload.id
        }
      })
    },
    //打开【上线审核】审核详情模态框
    *getOnSaleAuditInfo({payload},{put}){
      console.log('打开【上线审核】审核详情模态框',payload);
      yield put({
        type:"showPublishDetailsModal",
        payload:{
          publishVisible:true,
          currentRecord:payload
        }
      })
      yield put({
        type:"projectsByOne",
        payload:{
          id:payload.id,
          status:'上架',
        }
      })
    },
    //获取【已上线】表格数据
    *getInitTableData({payload},{call,put}){
      const {data}=yield call(getInitTableDataFetch,{...payload})
      if(!!data && data.status === 'success'){
        const activeTabelData = data.data.content.map(item=>({
          areaPath:isNull(item.areaPath.substring(1),'-'),
          createDateTime:isNull(item.createDateTime,'-'),
          createUser:isNull(item.createUser,'-'),
          discount:isNull(item.discount,'-'),
          employeesName:isNull(item.employeesName,'-'),
          historyId:isNull(item.historyId,'-'),
          id:isNull(item.id,'-'),
          isEditAgain:isNull(item.isEditAgain,false),
          lookNumber:isNull(item.lookNumber,'-'),
          name:isNull(item.name,'-'),
          nextStatus:isNull(item.nextStatus,'-'),
          offlineDate:isNull(item.offlineDate,'-'),
          onsellDateTime:isNull(item.onsellDateTime,'-'),
          price:renderUnitPriceStr(item.price),
          projectStatusType:isNull(item.projectStatusType,'-'),
          isOnline:isNull(item.isOnline,false),
          sellTotle:isNull(item.sellTotle,'-'),
          status:isNull(item.status,'-'),
          tradingCenterName:isNull(item.tradingCenterName,'-'),
          transactions:isNull(item.transactions,'-'),
        }))
        yield put({
          type:'setActiveTableData',
          payload:{
            activeTabelData,
            tableLoading:false,
            totalElements:data.data.totalElements,
            pagination:{
              current:data.data.number+1,
              total:data.data.totalElements,
              pageSize:data.data.size,
            }
          },
        })
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            visible:true,
            todo:"default",
            type:'error',
            title:'获取在售项目列表数据失败！',
            description:!!data?isNull(data.message,'请求失败'):'请求失败',
          }
        })
      }
      // if(!!data&&data.status==="success"){
      //   const resultTableDta=[];
      //   let totalElements=data.data.totalElements;
      //   data.data.content.map((item,index)=>{
      //     resultTableDta.push({
      //       number:index+1,
      //       id:item.id,
      //       key:item.id,
      //       areaPath:item.areaPath.substring(1),
      //       createDateTime:item.createDateTime,
      //       createUser:item.createUser,
      //       discount:item.discount,
      //       id:item.id,
      //       lookNumber:item.lookNumber,
      //       name:item.name,
      //       nextStatus:item.nextStatus,
      //       transactions:item.transactions,
      //       price:item.price,
      //       sellTotle:item.sellTotle,
      //       isEditAgain:item.isEditAgain,
      //       projectStatusType:item.projectStatusType,
      //       status:item.status,
      //       tradingCenterName:item.tradingCenterName,
      //     })
      //   })
      //   yield put({
      //     type:"saveTableData",
      //     payload:{
      //       saleItemsTableData:resultTableDta,
      //       tableLoading:false,
      //       totalElements:totalElements,
      //       pagination:{
      //         current:data.data.number+1,
      //         total:data.data.totalElements,
      //         pageSize:data.data.size,
      //       }
      //     }
      //   })
      // }else{
      //   yield put({type:'togglePrompt',payload:{
      //     type:'error',
      //     title:'失败!',
      //     description:'获取初始数据失败!',
      //     visible:true,
      //     todo:"closeModal"
      //   }})
      // }
    },
    //提示模态框操作判断
    *judgePropTodo({payload},{put}){
      if(payload === 'closeModalAndFetch'){
        yield put({
          type:"togglePrompt",
          payload:{
            visible:false
          }
        })
        yield put({
          type:"showPublishDetailsModal",
          payload:{
            publishVisible:false
          }
        })
        yield put({
          type:"showOffLineModal",
          payload:{
            visible:false
          }
        })
        yield put({
          type:"getActiveTabTableData",
        })
      }
      else if(payload === 'closeModal'){
        yield put({
          type:"togglePrompt",
          payload:{
            visible:false
          }
        })
        yield put({
          type:"getActiveTabTableData",
        })
      }
      else if(payload === 'closeBothModal'){
        yield put({
          type:"togglePrompt",
          payload:{
            visible:false
          }
        })
        yield put({
          type:"releaseAuditModal",
          payload:{
            releaseAuditVisible:false
          }
        })
        yield put({
          type:"getActiveTabTableData",
        })
      }
      else if(payload === 'closeModalAndSendFetch'){
        yield put({
          type:"togglePrompt",
          payload:{visible:false}
        })
        yield put({
          type:"showPublishDetailsModal",
          payload:{publishVisible:false}
        })
        yield put({
          type:"getActiveTabTableData",
        })
      }
      else if(payload === 'default'){
        yield put({
          type:"togglePrompt",
          payload:{
            visible:false
          }
        })
      }
    },
    //获取【编辑中】表格数据
    *getEditTableData({payload},{call,put}){
      const {data}=yield call(getEditTableDataFetch,{...payload});
      // if(!!data){
      //   if(data.status==='success'){
      //     const result=data.data.content;
      //     const tableData=result.map((item,index)=>({
      //       number:isNull(item.id,index),
      //       name:isNull(item.name,'-'),
      //       areaPath:isNull(item.areaPath,'-').substring(1),
      //       createDateTime:isNull(item.createDateTime,'-'),
      //       createUser:isNull(item.createUser,'-'),
      //       status:isNull(item.nextStatus,'-'),
      //       id:isNull(item.id,index),
      //       isEditAgain:item.isEditAgain,
      //       operation:'操作',
      //     }))
      //     yield put({
      //       type:"saveTableData",
      //       payload:{
      //         eidtTableData:tableData,
      //         tableLoading:false,
      //         totalElements:data.data.totalElements,
      //         pagination:{
      //           current:data.data.number+1,
      //           total:data.data.totalElements,
      //           pageSize:data.data.size,
      //         }
      //       }
      //     })
      //   }else{
      //     yield put({type:'togglePrompt',payload:{
      //       type:'error',
      //       title:'失败!',
      //       description:'获取编辑中项目列表数据失败!',
      //       visible:true,
      //       todo:"closeModal"
      //     }})
      //   }
      // }else{
      //   yield put({type:'togglePrompt',payload:{
      //     type:'error',
      //     title:'失败!',
      //     description:'获取编辑中项目列表数据失败!',
      //     visible:true,
      //     todo:"closeModal"
      //   }})
      // }

      if(!!data && data.status === 'success'){
        const activeTabelData = data.data.content.map((item,index)=>({
          number:isNull(item.id,index),
          name:isNull(item.name,'-'),
          areaPath:isNull(item.areaPath,'-').substring(1),
          createDateTime:isNull(item.createDateTime,'-'),
          createUser:isNull(item.createUser,'-'),
          status:isNull(item.nextStatus,'-'),
          id:isNull(item.id,index),
          isEditAgain:item.isEditAgain,
          operation:'操作',
        }))
        yield put({
          type:'setActiveTableData',
          payload:{
            activeTabelData,
            tableLoading:false,
            totalElements:data.data.totalElements,
            pagination:{
              current:data.data.number+1,
              total:data.data.totalElements,
              pageSize:data.data.size,
            }
          },
        })
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            visible:true,
            todo:"default",
            type:'error',
            title:'获取已下架项目列表数据失败！',
            description:!!data?isNull(data.message,'请求失败'):'请求失败',
          }
        })
      }
    },
    //已下线
    *offLine({payload},{call,put}){
      const {data}=yield call(offLineFetch,{...payload})
      if(!!data&&data.status==="success"){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'下架申请成功!',
          description:'请等待相关人员审核',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'下架申请失败!',
          description:isNull(data.message,'请求失败！'),
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //
    *getDetailsData({payload},{call,put}){
      const {data}=yield call(getDetailsDataFetch,{...payload})
      if(!!data&&data.status==='success'){

      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取数据详细信息失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //获取审核中列表数据
    *getInitAuditData({payload},{call,put}){
      const {data}=yield call(getInitAuditDataFetch,{...payload})
      // if(!!data && data.status==="success"){
      //   const resultData=[];
      //   let totalElements=data.data.totalElements;
      //   data.data.content.map((item,index)=>{
      //     resultData.push({
      //       key:item.id,
      //       number:index+1,
      //       areaPath:item.areaPath.substring(1),
      //       projectStatusType:item.projectStatusType,
      //       createDateTime:item.createDateTime,
      //       createUser:item.createUser,
      //       discount:item.discount,
      //       id:item.id,
      //       lookNumber:item.lookNumber,
      //       name:item.name,
      //       nextStatus:item.nextStatus,
      //       isEditAgain:item.isEditAgain,
      //       offlineDate:item.offlineDate,
      //       price:renderUnitPriceStr(item.price),
      //       sellTotle:item.sellTotle,
      //       status:item.status,
      //       auditor:item.employeesName,
      //       onsellDateTime:item.onsellDateTime,
      //       tradingCenterName:item.tradingCenterName,
      //     })
      //   })
      //   yield put({
      //     type:"saveTableData",
      //     payload:{
      //       auditTableData:resultData,
      //       tableLoading:false,
      //       totalElements:totalElements,
      //       pagination:{
      //         current:data.data.number+1,
      //         total:data.data.totalElements,
      //         pageSize:data.data.size,
      //       }
      //     }
      //   })
      // }else{
      //   yield put({type:'togglePrompt',payload:{
      //     type:'error',
      //     title:'失败!',
      //     description:'获取审核中数据失败!',
      //     visible:true,
      //     todo:"closeModal"
      //   }})
      // }


      if(!!data && data.status === 'success'){
        const activeTabelData = data.data.content.map((item,index)=>({
          key:isNull(item.id,'-'),
          number:isNull(index+1,'-'),
          areaPath:isNull(item.areaPath.substring(1),'-'),
          projectStatusType:isNull(item.projectStatusType,'-'),
          createDateTime:isNull(item.createDateTime,'-'),
          createUser:isNull(item.createUser,'-'),
          discount:isNull(item.discount,'-'),
          id:isNull(item.id,'-'),
          lookNumber:isNull(item.lookNumber,'-'),
          name:isNull(item.name,'-'),
          nextStatus:isNull(item.nextStatus,'-'),
          isEditAgain:isNull(item.isEditAgain,false),
          isOnline:isNull(item.isOnline,false),
          offlineDate:isNull(item.offlineDate,'-'),
          price:isNull(renderUnitPriceStr(item.price),'-'),
          sellTotle:isNull(item.sellTotle,'-'),
          status:isNull(item.status,'-'),
          auditor:isNull(item.employeesName,'-'),
          onsellDateTime:isNull(item.onsellDateTime,'-'),
          transactions:isNull(item.transactions,'-'),
          tradingCenterName:isNull(item.tradingCenterName,'-'),
        }))
        yield put({
          type:'setActiveTableData',
          payload:{
            activeTabelData,
            tableLoading:false,
            totalElements:data.data.totalElements,
            pagination:{
              current:data.data.number+1,
              total:data.data.totalElements,
              pageSize:data.data.size,
            }
          },
        })
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            visible:true,
            todo:"default",
            type:'error',
            title:'获取审核中项目列表数据失败！',
            description:!!data?isNull(data.message,'请求失败'):'请求失败',
          }
        })
      }
    },
    //
    *getInitOffLineData({payload},{call,put}){
      const {data}=yield call(getInitOffLineDataFetch,{...payload})
      // if(!!data&&data.status==="success"){
      //   const resultData=[];
      //   let totalElements=data.data.totalElements;
      //   data.data.content.map((item,index)=>{
      //     resultData.push({
      //       number:index+1,
      //       key:item.id,
      //       areaPath:item.areaPath.substring(1),
      //       createDateTime:item.createDateTime,
      //       projectStatusType:item.projectStatusType,
      //       createUser:item.createUser,
      //       discount:item.discount,
      //       id:item.id,
      //       isEditAgain:item.isEditAgain,
      //       lookNumber:item.lookNumber,
      //       name:item.name,
      //       nextStatus:item.nextStatus,
      //       offlineDate:item.offlineDate,
      //       price:item.price,
      //       sellTotle:item.sellTotle,
      //       transactions:item.transactions,
      //       status:item.status,
      //       tradingCenterName:item.tradingCenterName,
      //     })
      //   })
      //   yield put({
      //     type:"saveTableData",
      //     payload:{
      //       offLineTableData:resultData,
      //       tableLoading:false,
      //       totalElements:totalElements,
      //       pagination:{
      //         current:data.data.number+1,
      //         total:data.data.totalElements,
      //         pageSize:data.data.size,
      //       }
      //     }
      //   })
      // }else{
      //   yield put({type:'togglePrompt',payload:{
      //     type:'error',
      //     title:'失败!',
      //     description:'获取已下线数据失败!',
      //     visible:true,
      //     todo:"closeModal"
      //   }})
      // }

      if(!!data && data.status === 'success'){
        const activeTabelData = data.data.content.map((item,index)=>({
          number:isNull(index+1,'-'),
          id:isNull(item.id,'-'),
          key:isNull(item.id,'-'),
          areaPath:isNull(item.areaPath.substring(1),'-'),
          createDateTime:isNull(item.createDateTime,'-'),
          projectStatusType:isNull(item.projectStatusType,'-'),
          isOnline:isNull(item.isOnline,false),
          createUser:isNull(item.createUser,'-'),
          dealNumber:isNull(item.discount,'-'),
          id:isNull(item.id,'-'),
          isEditAgain:isNull(item.isEditAgain,false),
          lookNumber:isNull(item.lookNumber,'-'),
          name:isNull(item.name,'-'),
          nextStatus:isNull(item.nextStatus,'-'),
          offlineDate:isNull(item.offlineDate,'-'),
          price:isNull(item.price,'-'),
          sellTotle:isNull(item.sellTotle,'-'),
          transactions:isNull(item.transactions,'-'),
          status:isNull(item.status,'-'),
          tradingCenterName:isNull(item.tradingCenterName,'-'),
        }))
        yield put({
          type:'setActiveTableData',
          payload:{
            activeTabelData,
            tableLoading:false,
            totalElements:data.data.totalElements,
            pagination:{
              current:data.data.number+1,
              total:data.data.totalElements,
              pageSize:data.data.size,
            }
          },
        })
      }else{
        yield put({
          type:'togglePrompt',
          payload:{
            visible:true,
            todo:"default",
            type:'error',
            title:'获取已下架项目列表数据失败！',
            description:!!data?isNull(data.message,'请求失败'):'请求失败',
          }
        })
      }
    },
    //搜索框触发
    *changeKeyWords({payload},{put}){
      yield put({
        type:'updateKeyWords',
        payload,
      });
      yield put({
        type:'getActiveTabTableData',
      })
    },
    //
    *projectsAuditOne({payload},{call,put}){
      const {data}=yield call(projectsAuditOneFetch,{...payload})
      if(!!data&&data.status==="success"){
        const detailsTableData={};
        const auditInfos=data.data.auditInfo;
        const reasonImages=data.data.credentialsImages;
        const offlineReason=data.data.description;
        detailsTableData.key=data.data.auditModel.id;
        detailsTableData.areaPath=data.data.auditModel.areaPath;
        detailsTableData.createDateTime=data.data.auditModel.createDateTime;
        detailsTableData.createUser=data.data.auditModel.createUser;
        detailsTableData.discount=data.data.auditModel.discount;
        detailsTableData.id=data.data.auditModel.id;
        detailsTableData.name=data.data.auditModel.name;
        detailsTableData.offLineTime=data.data.auditModel.offLineTime;
        detailsTableData.price=data.data.auditModel.price;
        detailsTableData.sellTotle=data.data.auditModel.sellTotle;
        yield put({
          type:"saveDetailsData",
          payload:{
            detailsTableData:[detailsTableData],
            offlineReason:offlineReason,
            reasonImages:reasonImages,
            auditInfos:auditInfos,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取详细信息失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //
    *projectsByOne({payload},{call,put}){
      const {data}=yield call(projectsByOneFetch,{...payload})
      if(!!data&&data.status==="success"){
        const publishDetailsData={};
        const resultTableDta=data.data.auditModel;
        publishDetailsData.areaPath=resultTableDta.areaPath;
        publishDetailsData.createDateTime=resultTableDta.createDateTime;
        publishDetailsData.createUser=resultTableDta.createUser;
        publishDetailsData.discount=resultTableDta.discount;
        publishDetailsData.id=resultTableDta.id;
        publishDetailsData.key=resultTableDta.id;
        publishDetailsData.totle=resultTableDta.totle;
        publishDetailsData.name=resultTableDta.name;
        publishDetailsData.price=resultTableDta.price;
        const auditInfos=data.data.auditInfo;
        const publishReason=data.data.description;
        const publishImages=data.data.credentialsImages;
        yield put({
          type:"saveDetailsData",
          payload:{
            publishDetailsData:[publishDetailsData],
            publishReason:publishReason,
            publishImages:publishImages,
            auditInfos:auditInfos,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取详细信息失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //撤回项目申请
    *publishWithdraw({payload},{call,put}){
      const {data}=yield call(publishWithdrawFetch,{...payload})
      if(!!data&&data.status==='success'){
        if(!!data.data.id){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'撤回成功!',
            visible:true,
            todo:"closeModalAndFetch"
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'撤回项目失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *uploadData({payload},{call,put}){
      const {data}=yield call(projectReleaseFetch,{...payload})
      if(data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'申请上传成功!',
          visible:true,
          todo:"closeBothModal"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'申请上传失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getBriefInfo({payload},{call,put}){
      const {data}=yield call(getBriefInfoFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData={};
        const result=data.data;
        resultData.key=parseInt(result.id);
        resultData.createDateTime=result.createDateTime;
        resultData.createUser=result.createUser;
        resultData.discounts=result.discounts;
        resultData.houseCount=result.houseCount;
        resultData.id=parseInt(result.id);
        resultData.location=result.location;
        resultData.name=result.name;
        resultData.offlineDate=result.offlineDate;
        resultData.onsellDateTime=result.onsellDateTime;
        yield put({
          type:"saveTableData",
          payload:{
            releaseAuditData:[resultData],
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取项目详情失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    //撤回下架申请
    *offlineWithdraw({payload},{call,put}){
      const {data}=yield call(offlineWithdrawFetch,{...payload})
      if(!!data&&data.status==='success'){
        if(!!data.data.id){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'撤回下架成功!',
            visible:true,
            todo:"closeModalAndSendFetch"
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'撤回下架失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  }
}
