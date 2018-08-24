import { routerRedux } from 'dva/router'
import {
  getProjectListFetch,
  getProjectDetailFetch,
  getHasReportedTableData,
  getHasConfirmedTableData,
  getHasGroupPurchaseTableData,
  getHasTradedTableData,
  getHasMissTableData,
  getHasRevokeTableData,
  uploadRejectFetch,
  acceptReportFetch,
  getOrderTableDataFetch,
  postGroupBuyRefundApply,
  getGroupBuyRefundInfo,
  revokeGroupBuyRefundApplyFetch,
  revokeCommitApplyFetch,
  cancelGroupBuyOrderFetch,
  verifiExportExcelFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
import lodash from 'lodash';
import {
  getTransactionOrderInfoDataFetch,
  addTransactionsApplyFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatTransactions'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  isNull,
  judgeJurisdiction,
  getProjectInfoInStorage,
  setProjectInfoInStorage,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'
// import {
//   creatDownLoadBtn,
// } from '../../../../commons/utils/publicFunction'
import {
  getOrderInfoFetch,
  payGroupBuyFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatGroupBuy'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {parse} from 'qs';
const entranceData=new Map();
entranceData.set('creatClient',{
  title:'录客户',
  path:'creatClient',
});
entranceData.set('creatGroupBuy',{
  title:'录团购',
  path:'creatGroupBuy',
});
entranceData.set('creatTransactions',{
  title:'录成交',
  path:'creatTransactions',
});
entranceData.set('projectDetails',{
  title:'项目详情',
  path:'projectDetails',
});
entranceData.set('housesManagement',{
  title:'房源销控',
  path:'housesManagement',
});
//传入tabs的key返回请求对应的表格数据的fetch调用函数
const checkTableFetchType=(type)=>{
  switch (type) {
    case 'hasReported':
      return getHasReportedTableData;
    case 'hasConfirmed':
      return getHasConfirmedTableData;
    case 'hasGroupPurchase':
      return getHasGroupPurchaseTableData;
    case 'hasTraded':
      return getHasTradedTableData;
    case 'hasMiss':
      return getHasMissTableData;
    case 'hasRevoke':
      return getHasRevokeTableData;
    default:
      return getHasReportedTableData;
  }
}
//组装map数据
const setTableMap=(arr)=>{
  const resultMap=new Map();
  arr.map(item=>{
    resultMap.set(item.id,item)
  });
  return resultMap;
}
//传入tabs的key和响应的数据返回对应的表格数据格式
const checkTableData=(type,datas)=>{
  switch (type) {
    case 'hasReported':
      return datas.map((item)=>({
        key: `report_${item.id}`,
        serialNumber:item.id,
        filingBroker: item.brokerName,
        reportCustomer: item.customerName,
        customerPhoneNumber: item.customerPhone,
        Gender: item.customerSex,
        reportTime: item.createTime,
        groupKey:item.groupKey,
        bookingRoomTime: item.toVisitTime,
        propertyType: item.propertyType,
        intentionHousingResources:item.intentHouse,
        reasonForRejection:item.reasonForRejection,
        status: item.status,
        hasClass:item.status==='待受理',
        operation: item,
      }));
    case 'hasConfirmed':
      return datas.map((item)=>({
        key: `confirm_${item.id}`,
        serialNumber:item.id,
        groupKey:item.groupKey,
        agent: item.brokerName,
        customer: item.customerName,
        intentHouseId: item.intentHouseId,
        agentPhoneNumber: item.brokerPhone,
        customerPhoneNumber: item.customerPhone,
        protectionPeriod: `剩余${item.protectDay}天`,
        houseStatus: item.status,
        houseTime: item.showTime,
        propertyType: item.propertyType,
        intentionHousingResources: item.intentHouse,
        operation: '业务办理',
      }));
    case 'hasGroupPurchase':
      return datas.map((item)=>({
        key: `key_${item.id}`,
        serialNumber:item.id,
        customer: isNull(item.customerName,'-'),
        customerPhoneNumber: isNull(item.customerPhone,'-'),
        hasGroupBuy: isNull(item.projectFavorableName,'-'),
        houseStatus: isNull(item.groupbuyStatus,'-'),
        groupBuyTime: isNull(item.groupbuyCreateTime,'-'),
        propertyType: isNull(item.propertyType,'-'),
        status:item.groupbuyStatus,
        groupBuyAmount:`${item.groupbuyMoney}元`,
        intentionHousingResources: item.house,
        groupbuyStatus:item.groupbuyStatus,
        isUploadAgreement:isNull(item.isUploadAgreement,false),
        refundStatus:item.refundStatus,
        groupBuyId:item.id,
        operation:'',
        groupKey:item.groupKey,
      }));
    case 'hasTraded':
      return datas.map((item,index)=>({
        key: isNull(item.id,`key_${index}`),
        serialNumber:isNull(item.id,index),
        agent: isNull(item.brokerName,''),
        customer: isNull(item.customerName,''),
        customerPhoneNumber:isNull(item.customerPhone,''),
        dealHousingResources:isNull(item.houseName,''),
        houseStatus:isNull(item.txStatus,''),
        auditStatus:isNull(item.auditStatus,''),
        dealTime:isNull(item.txTime,''),
        dealType:isNull(item.propertyType,''),
        dealStatus:isNull(item.auditStatus,''),//显示字段
        txStatus:isNull(item.txStatus,''),//成交状态
        isAllow:isNull(item.isAllow,false),//是否通过审核
        isFinish:isNull(item.isFinish,false),//是否完成
        dealDiscount:isNull(item.discountName,''),
        groupKey:isNull(item.groupKey,''),
        dealAmount:`均价${isNull(item.unitPrice,'-')}元/㎡ 总价${isNull(item.totalPrice/10000,'')}万`,
      }));
    case 'hasMiss':
      return datas.map((item)=>({
        key:'001',
        refindPic:"电商团购",
        paymentItems:"远洋山水",
        orderNumber:332005469041,
        payAway:"POS机支付/工商银行",
        paySerialNumber:65535,
        payCustomer:"张三",
        customerPhone:"15120050558",
        payTime:"2016-10-24 19:00",
        payCash:"10000元",
        payStatus:"已支付",
        operation:"交易详情"
      }));
    case 'hasRevoke':
      return datas.map((item)=>({
        key:'001',
        refindPic:"电商团购",
        paymentItems:"远洋山水",
        orderNumber:332005469041,
        payAway:"POS机支付/工商银行",
        paySerialNumber:65535,
        payCustomer:"张三",
        customerPhone:"15120050558",
        payTime:"2016-10-24 19:00",
        payCash:"10000元",
        payStatus:"已支付",
        operation:"交易详情"
      }));
    default:
      return datas.map((item)=>({
        key: item,
        serialNumber:item,
        filingBroker: `名字 ${item}`,
        reportCustomer: `名字22 ${item}`,
        customerPhoneNumber: '120533253555',
        Gender: '男',
        reportTime: '06-10 19:00',
        bookingRoomTime: '06-20 19:00',
        propertyType: '普通住宅',
        intentionHousingResources: 'A区域/1号楼/1单元/1003室',
        status: '带看房',
        operation: '业务办理',
      }));
  }
}

const initState={
  loading:false,
  lockProject:false,
  selectProject:null,
  keyword:'',
  projectName:null,
  projectInfo:null,
  selectProjectModal:{
    visible:false,
    projectList:[],
  },
  rejectModel:{
    visible:false,
    type:'add',
    value:'',
    id:'',
  },
  confirmModal:{//确认模态框
    title:null,
    visible:false,
    description:null,
    okText:null,
    cancelText:null,
    agrs:null,
  },
  searchValue:'',
  entrance:[],//录团购等入口
  tabsActiveKey:'hasReported',
  tableLoading:true,
  activeTableData:[],
  pagination:{
    total:1,
    current:1,
  },
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
  payModal:{
    visible:false,
    orderInfo:null,
    loading:true,
    serialNumber:'',
    groupBuyId:null,
    groupKey:null,
    title:'',
  },
  stepsAuditingModalState:{//审核步骤通用模态框
    title:'',
    visible:false,
    type:'default',
    stepList:[],//step数组
    width:1000,//模态框宽度
    stepStatus:'process',//当前进度状态
    current:0,//审核进度
    showDataInfo:null,//JSON
    inputValue:'',
    upLoadPicList:[],
    selectList:[],
    selectValue:null,
    groupKey:null,
  },
  exportModal:{//导出模态框
    visible:false,
  },
}
export default {
  namespace:'newHouseTrade',
  state:lodash.cloneDeep(initState),
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/newHouseTrade') {
         setTimeout(()=>dispatch({
           type:'initComponent',
         }),0);
        //  dispatch({type:'initComponent'})
        //  if(projectObj.projectId){
        //    dispatch({
        //      type:'setSelectProject',
        //      payload:{
        //        selectId:projectObj.projectId,
        //        selectProject:projectObj.projectName,
        //      }
        //    })
        //  }
        //  if(!!sessionStorage.getItem('anzhu_nh_project')){
        //    dispatch({
        //      type:'setSelectProject',
        //      payload:JSON.parse(sessionStorage.getItem('anzhu_nh_project'))
        //    })
        //  }
       }
     });
   },
  },
  effects:{
    //初始化组件
    *initComponent({payload},{put}){
      yield put({type:'doInitState'})
      yield put({type:'setEntrance'})
      if(sessionStorage.getItem('nh_trade_tab')){
        yield put({
          type:'setTabsActiveKey',
          payload:sessionStorage.getItem('nh_trade_tab'),
        })
      }
      yield put({type:'checkLocalProject'})
    },
    //切换tab
    *updateTabsActiveKey({payload},{put}){
      sessionStorage.setItem('nh_trade_tab',payload);
      yield put({
        type:'setTabsActiveKey',
        payload,
      })
      yield put({
        type:'initTableData'
      })
    },
    //获取项目列表数据
    *getProjectListData({payload},{call,put}){
      yield put({
        type:'setLoading',
        payload:true,
      })
      const { data } = yield call(getProjectListFetch);
      if(!!data){
        if(data.status==='success'){
          const projectResult=data.data.map((item)=>{
            return {
              value:String(item.id),
              label:item.name,
            }
          });
          yield put({
            type:'openSelectProjectModal',
            payload:projectResult,
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目列表失败',
              todo:'defaultCloseLoading',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取项目列表失败',
            todo:'defaultCloseLoading',
          },
        });
      }
    },
    //获取项目简略信息
    *getProjectInfo({payload},{select,call,put}){
      const {data}=yield call(getProjectDetailFetch,{id:payload});
      if(!!data){
        if(data.status==='success'){
          const projectData=data.data;
          if(isNull(projectData.isOffProject,false)){
            clearProjectInfoInStorage()
            yield put(routerRedux.push({
              pathname:'/indexPage'
            }))
          }else{
            const projectInfo={
              name:isNull(projectData.name,''),
              img:isNull(projectData.isCoverPicPaths,''),
              basicInfos:[
                {
                  label:'项目负责人',
                  value:isNull(projectData.contact,''),
                },{
                  label:'联系电话',
                  value:isNull(projectData.phone,''),
                }
              ],
              tradeInfos:[
                {
                  label:'已售团购',
                  value:`${isNull(projectData.discount,'0')}套`,
                },{
                  label:'已成交',
                  value:`${isNull(projectData.transactionsNumber,'0')}套`,
                },{
                  label:'剩余套数',
                  value:`${isNull(projectData.laveNumber,'0')}套`,
                },{
                  label:'团购优惠结束时间',
                  value:isNull(projectData.endOfProjectActivity,'-'),
                }
              ],
            }
            yield put({
              type:'updateProjectInfo',
              payload:JSON.stringify(projectInfo),
            })
          }

        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目信息失败',
              okText:'确定',
              todo:'other',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取项目信息失败',
            okText:'确定',
            todo:'other',
          },
        });
      }
    },
    //设置入口权限
    *setEntrance({ payload }, {select, call, put ,takeLatest}){
      // //从mian里获取权限
      // const entrance=[];
      // if(judgeJurisdiction('')){
      //
      // }
      // entrance.push(entranceData.get('creatClient'));
      // entrance.push(entranceData.get('creatGroupBuy'));
      // entrance.push(entranceData.get('creatTransactions'));
      // entrance.push(entranceData.get('projectDetails'));
      // entrance.push(entranceData.get('housesManagement'));
      // yield put({
      //   type:'updateEntrance',
      //   payload:entrance,
      // });
      const {
        userInfo,
      }=yield select(({main})=>main);
      function *getEntranceFun(){
        const {
          userInfo,
        }=yield select(({main})=>main);
        yield put({
          type:'setEntranceData',
        })
      }
      if(!!userInfo){
        yield put({
          type:'setEntranceData',
        })
      }else{
        yield takeLatest('main/initUserInfo',getEntranceFun)
      }
    },
    //过滤入口数据
    *setEntranceData({payload},{put}){
      const entrance=[];
      if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_RECORDCUSTOMER')){
        entrance.push(entranceData.get('creatClient'));
      }
      if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_RECORDGROUPPURCHASE')){
        entrance.push(entranceData.get('creatGroupBuy'));
      }
      if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_RECORDTRANSACTION')){
        entrance.push(entranceData.get('creatTransactions'));
      }
      entrance.push(entranceData.get('projectDetails'));
      entrance.push(entranceData.get('housesManagement'));
      yield put({
        type:'updateEntrance',
        payload:entrance,
      });
    },
    //初始化表格的数据
    *initTableData({ payload }, {select, call, put }){
      yield put({
        type:'switchTableLoading',
        payload:true,
      });
      const {tabsActiveKey,selectProject,keyword} = yield select(({ newHouseTrade }) => newHouseTrade);
      const {data}=yield call(checkTableFetchType(tabsActiveKey),{
        projectId:Number(selectProject),
        pageNo:0,
        pageSize:10,
        keyword:keyword,
      });
      if(!!data){
        if(data.status==='success'){
          //虚拟数据
          let result=data.data;
          yield put({
            type:'initActiveTableData',
            payload:{
              activeTableData:checkTableData(tabsActiveKey,result.content),
              tableLoading:false,
              pagination:{
                total:result.totalElements,
                current:result.number+1,
              },
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取数据失败',
              okText:'确定',
              todo:'other',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员，无法获取表格数据',
            title:'连接服务器失败！',
            okText:'确定',
            todo:'other',
          },
        });
      }

    },
    //搜索
    *filterTableData({ payload }, {select, call, put }){
      yield put({
        type:'switchTableLoading',
        payload:true,
      });
      const {tabsActiveKey,selectProject} = yield select(({ newHouseTrade }) => newHouseTrade);
      const {data}=yield call(checkTableFetchType(tabsActiveKey),{
        projectId:selectProject,
        pageNo:0,
        pageSize:10,
        keyword:payload,
      });
      if(!!data){
        if(data.status==='success'){
          //虚拟数据
          let result=data.data;
          yield put({
            type:'doFilterTableData',
            payload:{
              activeTableData:checkTableData(tabsActiveKey,result.content),
              tableLoading:false,
              pagination:{
                total:result.totalElements,
                current:result.number+1,
              },
              keyword:payload,
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取数据失败',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员，无法获取表格数据',
            title:'连接服务器失败！',
            okText:'确定',
            type:'error',
          },
        });
      }

    },
    //驳回模态框上传驳回数据
    *uploadReject({ payload }, { select,call, put }){
      const rejectModel = yield select(({ newHouseTrade }) => newHouseTrade.rejectModel);
      if(rejectModel.value.length===0){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            content:'请从新输入',
            title:'您输入的驳回理由为空',
            okText:'确定',
            type:'error',
          },
        });
      }else{
        const {data}=yield call(uploadRejectFetch,{id:rejectModel.id,reasonForRejection:rejectModel.value});
        if(data.status==='success'){
          yield put({
            type:'closeRejectModal'
          });
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'驳回成功！',
              okText:'确定',
              type:'success',
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'驳回失败！',
              okText:'确定',
              type:'error',
            },
          });
        }
      }

    },
    //报备受理
    *acceptReport( {payload }, { call, put }){
      const {data}=yield call(acceptReportFetch,{id:payload});
      if(data.status==='success'){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:data.message,
            title:'受理成功！',
            okText:'确定',
            type:'success',
          },
        });
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:data.message,
            title:'受理失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    //根据分页变化获取对应页码的数据
    *getPageTableData({ payload }, { select,call, put }){
      yield put({
        type:'switchTableLoading',
        payload:true,
      });
      const {tabsActiveKey,selectProject,keyword} = yield select(({ newHouseTrade }) => newHouseTrade);
      const {data}=yield call(checkTableFetchType(tabsActiveKey),{
        projectId:selectProject,
        pageNo:payload-1,
        pageSize:10,
        keyword:keyword,
      });
      if(!!data){
        if(data.status==='success'){
          //虚拟数据
          let result=data.data;
          yield put({
            type:'initActiveTableData',
            payload:{
              activeTableData:checkTableData(tabsActiveKey,result.content),
              tableLoading:false,
              pagination:{
                total:result.totalElements,
                current:result.number+1,
              },
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取数据失败',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员，无法获取表格数据',
            title:'连接服务器失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    //打开驳回模态框
    *openRejectModal({payload }, {select, call, put }){
      if(payload.type==='add'){
        yield put({
          type:'showRejectModal',
          payload,
        });
      }else{
        yield put({
          type:'showRejectModal',
          payload,
        });
        yield put({
          type:'changeRejectModalValue',
          payload:payload.reson,
        });
      }
    },
    //关闭提示模态框判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({newHouseTrade})=>newHouseTrade.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'initTableData'
          });
          break;
        case 'closeStepsModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'closeStepsAuditingModal'
          });
          yield put({
            type:'initTableData'
          });
          break;
        case 'defaultLoading':
          yield put({
            type:'setLoading',
            payload:false,
          });
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'closeRefundModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'initRefunModal'
          });
          yield put({
            type:'initTableData'
          });
          break;
        case 'defaultCloseLoading':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'setLoading',
            payload:false,
          });
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
    //从localStorage中取出项目信息
    *checkLocalProject({payload},{select,put}){
      const {selectProject}=yield select(({newHouseTrade})=>newHouseTrade);
      const projectObj=getProjectInfoInStorage();
      if(!!projectObj && selectProject!==projectObj.projectId){
        const {projectName,projectId}=projectObj;
        yield put({
          type:'changeProject',
          payload:{
            selectId:projectId,
            selectProject:projectName,
          },
        });
        yield put({
          type:'getProjectInfo',
          payload:projectId,
        });
        yield put({
          type:'initTableData'
        });
      }
    },
    //改变项目选择
    *setSelectProject({payload},{put}){
      const {selectId,selectProject,}=payload;
      setProjectInfoInStorage(selectId,selectProject);
      yield put({
        type:'changeProject',
        payload,
      });
      yield put({
        type:'getProjectInfo',
        payload:selectId,
      });
      yield put({
        type:'initTableData'
      });
    },
    //支付团购
    *payGroupBuy({payload},{call,put}){
      const {data}=yield call(payGroupBuyFetch,{
        customerIDNumber:payload.idNumber,
        customerName:payload.customerName,
        customerPhone:payload.phoneNumber,
        groupbuyId:payload.payId,
        payType:payload.payWay,
        unionpayNumber:payload.bankCard,
      })
      if(!!data){
        if(data.status==='success' && !!data.data.payOrderNumber){
          const serialNumber=data.data.payOrderNumber;
          yield put({
            type:'initSerialNumber',
            payload:serialNumber,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请联系管理员',
              title:'获取团购流水号失败',
              todo:'payAgain',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取团购流水号失败',
            todo:'payAgain',
            okText:'确定',
          },
        });
      }
    },
    //依据团购ID生成支付订单
    *getGroupBuyPayCode({payload},{call,put}){
      const {data}=yield call(getOrderInfoFetch,{groupbuyId:payload.groupBuyId});
      if(!!data){
        if(data.status==='success'){
          const resInfo=data.data;
          const orderInfo={
            discountName:!!resInfo.projectFavorableName?resInfo.projectFavorableName:'',
            amount:!!resInfo.groupbuyMoney?resInfo.groupbuyMoney:'',
            orderNumber:!!resInfo.payOrderNumber?resInfo.payOrderNumber:'',
            bankCard:!!resInfo.unionpayNumber?resInfo.unionpayNumber:'',
            idNumber:!!resInfo.customerIDNumber?resInfo.customerIDNumber:'',
            customerName:!!resInfo.customerName?resInfo.customerName:'',
            phoneNumber:!!resInfo.customerPhone?resInfo.customerPhone:'',
            payId:!!resInfo.groupbuyId?resInfo.groupbuyId:'',
          };
          yield put({
            type:'setOrderInfo',
            payload:{
              visible:true,
              orderInfo:JSON.stringify(orderInfo),
              loading:false,
              groupKey:payload.groupKey,
              groupBuyId:payload.groupBuyId,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取团购订单失败！',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取团购订单失败！',
            okText:'确定',
            todo:'closePayModal',
          },
        });
      }
    },
    //打开申请退款模态框
    *applyRefun({payload},{select,call,put}){
      //打开模态框
      yield put({
        type:'openApplyRefunModal',
        payload:{
          visible:true,
          stepList:[
            {
              title:'申请退款'
            },{
              title:'退款审核'
            },{
              title:'财务审核'
            },{
              title:'执行退款'
            }
          ],
          type:'applyGroupBuy',
          current:0,
          groupBuyId:payload.groupBuyId,
        }
      })
      yield put({
        type:'getOrderTableData',
        payload:payload,
      })
    },
    //获取订单信息
    *getOrderTableData({payload},{call,put,select}){
      const {data}=yield call(getOrderTableDataFetch,{groupbuyId:payload.groupBuyId});
      if(!!data){
        if(data.status==='success' && !!data.data){
          const order={
            refundType:'电商团购',
            projectName:data.data.projectName,
            orderNumber:data.data.payOrderNumber,
            payWay:data.data.payType,
            paySerialNumber:data.data.paySerialNumber,
            customerName:data.data.customerName,
            customerPhone:data.data.customerPhone,
            payTime:data.data.payFinishTime,
            payAmount:data.data.groupbuyMoney,
            payStatus:data.data.status,
            groupKey:payload.groupKey,
          }
          yield put({
            type:'updataRefundModalOrderTableData',
            payload:JSON.stringify(order),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.status,
              title:'获取订单信息失败！',
              okText:'确定',
              todo:'defaut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取订单信息失败！',
            okText:'确定',
            todo:'defaut',
          },
        });
      }
    },
    //【步骤模态框】加载模态框初始数据
    *getStepsModalData({payload},{select,call,put}){
      yield put({type:'setLoading',payload:true});
      //成交申请
      if(payload.type==='applyTrans'){
        const {data}=yield call(getTransactionOrderInfoDataFetch,{groupKey:payload.record.groupKey});
        if(!!data){
          if(data.status==='success' && !!data.data.id){
            const stepData=judgeStepsModalType(payload,data.data);
            yield put({
              type:'initStepsModalData',
              payload:stepData,
            });
            if(stepData.type==='transApply'){
              //成交申请，获取审核人员数据
              yield put({type:'getAuditingManList'})
            }
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取成交信息失败！',
                todo:'defaultLoading',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取成交信息失败！',
              todo:'defaultLoading',
              okText:'确定',
            },
          })
        }
      }else if(payload.type=='applyGroupBuyRefund'){//团购退款申请
        const {data}=yield call(getGroupBuyRefundInfo,{groupbuyId:payload.record.groupBuyId});
        if(!!data){
          if(data.status==='success' && !!data.data){
            const stepData=judgeStepsModalType(payload,data.data);
            yield put({
              type:'initStepsModalData',
              payload:stepData,
            });
            //团购退款申请，获取审核人员数据
            yield put({type:'getAuditingManList'})
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取团购退款审核详情失败！',
                todo:'defaultLoading',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取团购退款审核详情失败！',
              todo:'defaultLoading',
              okText:'确定',
            },
          })
        }
      }else if(payload.type==='groupBuyRefundInfo'){
        const {data}=yield call(getGroupBuyRefundInfo,{groupbuyId:payload.record.groupBuyId});
        if(!!data){
          if(data.status==='success' && !!data.data){
            const stepData=judgeStepsModalType(payload,data.data);
            yield put({
              type:'initStepsModalData',
              payload:stepData,
            });
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取团购退款审核详情失败！',
                todo:'defaultLoading',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取团购退款审核详情失败！',
              todo:'defaultLoading',
              okText:'确定',
            },
          })
        }
      }else if(payload.type==='applyTransAuditing'){
        const {data}=yield call(getTransactionOrderInfoDataFetch,{groupKey:payload.record.groupKey});
        if(!!data){
          if(data.status==='success' && !!data.data){
            const response=yield call(getTrackInfoFetch,{groupKey:payload.record.groupKey});
            if(!!response.data){
              if(response.data.status==='success'){
                let transApplyAuditingInfo=null;
                try{
                  const trackArr=response.data.data.trackDetail;
                  trackArr.map(item=>{
                    if(item.detailType==='成交审核'){
                      transApplyAuditingInfo=JSON.parse(item.detailContent);
                    }
                  });
                }catch(e){
                  transApplyAuditingInfo=null;
                }
                if(!!transApplyAuditingInfo){
                  const stepData=judgeStepsModalType(Object.assign({},payload,{recordList:transApplyAuditingInfo}),data.data);
                  yield put({
                    type:'initStepsModalData',
                    payload:stepData,
                  });
                }else{
                  yield put({
                    type: 'switchPrompt',
                    payload:{
                      visible:true,
                      description:'',
                      title:'获取成交申请审核信息失败！',
                      todo:'defaultLoading',
                      okText:'确定',
                    },
                  })
                }
              }else{
                yield put({
                  type: 'switchPrompt',
                  payload:{
                    visible:true,
                    description:data.message,
                    title:'获取成交申请审核信息失败！',
                    todo:'defaultLoading',
                    okText:'确定',
                  },
                })
              }
            }else{
              yield put({
                type: 'switchPrompt',
                payload:{
                  visible:true,
                  description:'获取track信息失败',
                  title:'获取成交申请审核信息失败！',
                  todo:'defaultLoading',
                  okText:'确定',
                },
              })
            }
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取成交申请审核信息失败！',
                todo:'defaultLoading',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取成交申请审核信息失败！',
              todo:'defaultLoading',
              okText:'确定',
            },
          })
        }
      }

    },
    //【步骤模态框】获取审核人员列表数据
    *getAuditingManList({payload},{call,select,put}){
      // testAuditorList
      const{data}=yield call(getAuditorList,{name:'新房交易合同审核'});
      if(!!data){
        if(data.status==='success'){
          const auditorList=data.data.map(item=>({
            name:item.name,
            id:`${item.userId}`,
          }));
          yield put({
            type:'initStepsAuditingModalStateAuditingManList',
            payload:auditorList,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取审核人员列表失败！',
              okText:'确定',
              todo:'closeStepModal',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败',
            title:'获取审核人员列表失败！',
            okText:'确定',
            todo:'closeStepModal',
          },
        })
      }
    },
    //【步骤模态框】执行成交申请
    *postTransApplyData({payload},{call,select,put}){
      const {
        inputValue,
        upLoadPicList,
        selectList,
        selectValue,
        groupKey,
      }=yield select(({newHouseTrade})=>newHouseTrade.stepsAuditingModalState);
      const selectAuditorId=selectValue;
      let selectAuditorName;
      selectList.map(item=>{
        if(item.id===selectAuditorId){
          selectAuditorName=item.name;
        }
      })
      if(!!inputValue && !!selectAuditorId && !!upLoadPicList && !!groupKey && !!selectAuditorName){
        const {data}=yield call(addTransactionsApplyFetch,{
          attachments:JSON.stringify(upLoadPicList.map(item=>item.id)),
          auditDesc:inputValue,
          auditUserId:selectAuditorId,
          auditUserName:selectAuditorName,
          groupKey,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:' ',
                title:'提交成交申请成功！',
                todo:'closeStepsModal',
                okText:'确定',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'提交成交申请失败！',
                todo:'default',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'提交成交申请失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认需填信息填写完整',
            title:'提交成交申请失败！',
            todo:'default',
            okText:'确定',
          },
        })
      }
    },
    //【步骤模态框】执行团购退款申请
    *postGroupBuyRefundApply({payload},{call,select,put}){
      const {
        inputValue,
        upLoadPicList,
        selectList,
        selectValue,
        groupKey,
        groupBuyId,
      }=yield select(({newHouseTrade})=>newHouseTrade.stepsAuditingModalState);
      const selectAuditorId=selectValue;
      let selectAuditorName;
      selectList.map(item=>{
        if(item.id===selectAuditorId){
          selectAuditorName=item.name;
        }
      })
      if(!!inputValue && !!selectAuditorId && !!upLoadPicList && !!groupBuyId && !!selectAuditorName){
        const {data}=yield call(postGroupBuyRefundApply,{
          reasonPic:upLoadPicList.map(item=>item.id),
          reason:inputValue,
          contractReviewUserId:selectAuditorId,
          contractReviewUserName:selectAuditorName,
          groupbuyId:groupBuyId,
          refundType:'电商团购',
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'提交团购退款申请成功！',
                todo:'closeStepsModal',
                okText:'确定',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'提交团购退款申请失败！',
                todo:'default',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'提交团购退款申请失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认需填信息填写完整',
            title:'提交团购退款申请失败！',
            todo:'default',
            okText:'确定',
          },
        })
      }
    },
    //【步骤模态框】执行撤回团购退款申请
    *revokeGroupBuyRefundApply({payload},{call,select,put}){
      const {
        groupBuyId,
      }=yield select(({newHouseTrade})=>newHouseTrade.stepsAuditingModalState);
      if(!!groupBuyId){
        const {data}=yield call(revokeGroupBuyRefundApplyFetch,{
          groupbuyId:groupBuyId,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'撤回团购退款申请成功！',
                todo:'closeStepsModal',
                okText:'确定',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'撤回团购退款申请失败！',
                todo:'default',
                okText:'确定',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'撤回团购退款申请失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'groupBuyId值无效！',
            title:'撤回团购退款申请失败！',
            todo:'default',
            okText:'确定',
          },
        })
      }
    },
    //【步骤模态框】执行撤回成交申请
    *revokeApplyTrans({payload},{select,call,put}){
      const {data}=yield call(revokeCommitApplyFetch,{
        groupKey:payload,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'撤回成交申请成功！',
              todo:'closeStepsModal',
              okText:'确定',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'撤回成交申请失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'撤回成交申请失败！',
            todo:'default',
            okText:'确定',
          },
        })
      }
    },
    //撤回订单 打开确认模态框
    *cancelGroupBuyOrder({payload},{put}){
      yield put({
        type:'openComfirmModal',
        payload:{
          title:'取消电商团购订单',
          visible:true,
          description:'确定要取消订单吗？取消订单后不能恢复。',
          okText:'确认取消',
          cancelText:'暂不取消',
          agrs:payload,
        }
      })
    },
    //导出 excel 验证
    // *verifiExportExcel({payload},{select,call,put}){
    //   console.log('payload',payload);
    //   const {data} = yield call(verifiExportExcelFetch,payload.downloadPath)
    //   console.log('data',data);
    //   if(!!data && !!data.data.randKey){
    //     creatDownLoadBtn(payload.fileName,`/miss-anzhu-newhouse-tx-groupbuy/groupbuy/exportExcel?randKey=${data.data.randKey}`)
    //   }else{
    //     yield put({
    //       type: 'switchPrompt',
    //       payload:{
    //         visible:true,
    //         description:isNull(data.message,'请求失败，请联系管理员'),
    //         title:'导出列表失败',
    //         todo:'default',
    //         okText:'确定',
    //       },
    //     })
    //   }
    // },
    //确认执行 取消团购订单
    *onOkComfirmModal({payload},{select,call,put}){
      const {
        groupBuyId,
      } = yield select(({newHouseTrade})=>newHouseTrade.confirmModal.agrs)
      if(!!groupBuyId){
        const {data} = yield call(cancelGroupBuyOrderFetch,{id:groupBuyId})
        if(!!data && data.status === 'success'){
          yield put({
            type:'closeComfirmModal'
          })
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'取消电商团购订单成功！',
              todo:'default',
              okText:'确定',
            },
          })
        }else{
          yield put({
            type:'closeComfirmModal'
          })
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:isNull(data.message,'请求失败！'),
              title:'取消电商团购订单失败！',
              todo:'default',
              okText:'确定',
            },
          })
        }
      }
    },
  },
  reducers:{
    //初始化state
    doInitState(state,action){
      return lodash.cloneDeep(initState);
    },
    //初始化项目列表
    initProjectList(state,action){
      return {...state,projectData:action.payload,loading:false}
    },
    //切换表格loading
    switchTableLoading(state,action){
      return {...state,tableLoading:action.payload}
    },
    //初始化激活表格数据
    initActiveTableData(state,action){
      return {...state,...action.payload}
    },
    //搜索过滤表格数据
    doFilterTableData(state,action){
      return {...state,...action.payload}
    },
    //更新快捷入口【权限】
    updateEntrance(state,action){
      return {...state,entrance:action.payload}
    },
    //更新提示模态框
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //更新激活tab key
    setTabsActiveKey(state,action){
      return{...state,tabsActiveKey:action.payload,tableLoading:true,activeTableData:[]}
    },
    //切换项目
    changeProject(state,action){
      return{...state,selectProject:action.payload.selectId,projectName:action.payload.selectProject,selectProjectModal:initState.selectProjectModal}
    },
    //锁定项目
    lockProject(state,action){
      return {...state,...action.payload}
    },
    //打开驳回模态框
    showRejectModal(state,action){
      return {...state,rejectModel:Object.assign({},state.rejectModel,{
        visible:true,
        id:action.payload.id,
        type:action.payload.type})}
    },
    //关闭驳回模态框
    closeRejectModal(state,action){
      return {...state,rejectModel:Object.assign({},state.rejectModel,{visible:false,value:''})}
    },
    //更新驳回模态框中输入框的值
    changeRejectModalValue(state,action){
      return {...state,rejectModel:{...state.rejectModel,value:action.payload}}
    },
    //打开支付模态框
    openPayModal(state,action){
      return {...state,payModal:Object.assign({},initState.payModal,{visible:true})}
    },
    //关闭支付模态框
    closeBuyModal(state,action){
      return {...state,payModal:Object.assign({},initState.payModal,{visible:false})}
    },
    //更新支付模态框订单信息
    setOrderInfo(state,action){
      return {...state,payModal:action.payload}
    },
    //更新支付模态框支付流水号
    initSerialNumber(state,action){
      return {...state,payModal:Object.assign({},state.payModal,{serialNumber:action.payload})}
    },
    //设置组件loading
    setLoading(state,action){
      return {...state,loading:action.payload}
    },
    //【审核步骤模态框】打开模态框，初始化显示数据
    initStepsModalData(state,action){
      return {...state,loading:false,stepsAuditingModalState:{...initState.stepsAuditingModalState,...action.payload}}
    },
    //【审核步骤模态框】更新input输入值
    changeStepsAuditingModalInputValue(state,action){
      if(action.payload.length<=20){
        return {...state,stepsAuditingModalState:{...state.stepsAuditingModalState,inputValue:action.payload}}
      }else{
        return state
      }
    },
    //【审核步骤模态框】更新上传图片数组
    changeStepsAuditingModalUploadPicList(state,action){
      return {...state,stepsAuditingModalState:{...state.stepsAuditingModalState,uploadPicList:action.payload}}
    },
    //【审核步骤模态框】初始化审核人员列表数据
    initStepsAuditingModalStateAuditingManList(state,action){
      return {...state,stepsAuditingModalState:{...state.stepsAuditingModalState,selectList:action.payload}}
    },
    //【审核步骤模态框】审核模态框select变化
    initStepsAuditingModalStateSelectChange(state,action){
      return {...state,stepsAuditingModalState:{...state.stepsAuditingModalState,selectValue:action.payload}}
    },
    //【审核步骤模态框】关闭审核步骤模态框
    closeStepsAuditingModal(state,action){
      return {...state,stepsAuditingModalState:initState.stepsAuditingModalState}
    },
    //【选择项目模态框】打开模态框
    openSelectProjectModal(state,action){
      return {...state,selectProjectModal:{visible:true,projectList:action.payload},loading:false}
    },
    //【选择项目模态框】关闭模态框
    closeSelectProjectModal(state,action){
      return {...state,selectProjectModal:initState.selectProjectModal}
    },
    //更新项目信息
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
    //【确认模态框】关闭
    closeComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,visible:false}}
    },
    //【确认模态框】关闭后回调
    afterCloseComfirmModal(state,action){
      return {...state,confirmModal:lodash.cloneDeep(initState).confirmModal}
    },
    //【确认模态框】打开模态框
    openComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,...action.payload}}
    },
    //打开导出模态框
    openExportTradeExcel(state,action){
      return {...state,exportModal:{visible:true}}
    },
    //关闭导出模态框
    closeExportTradeExcel(state,action){
      return {...state,exportModal:{visible:false}}
    },

  },
}

//团购退款审核状态判断
function checkGroupBuyRefundStatus(data,groupKey,groupBuyId){
  const result={
    orderInfo:{//订单信息
      refundType:'电商团购',
      projectName:isNull(data.projectName,''),
      orderNumber:isNull(data.payOrderNumber,''),
      payWay:isNull(data.payType,''),
      paySerialNumber:isNull(data.paySerialNumber,''),
      customerName:isNull(data.customerName,''),
      customerPhone:isNull(data.customerPhone,''),
      payTime:isNull(data.payFinishTime,''),
      payAmount:isNull(data.groupbuyMoney,''),
      payStatus:isNull(data.status,''),
      groupKey,
    },
    refundReason:isNull(data.reason,''),//退款申请原因
    refundReasonPics:isNull(data.reasonPics,[]).map((item,index)=>({//退款申请图片
      id:`key_${index}`,
      title:'',
      src:item,
    })),
    refundSchedules:isNull(data.refundSchedules,[]).map(item=>({//审核流程记录
      label:item,
      value:''
    })),
    contractComment:isNull(data.contractComment,''),//合同审核说明
    contractPics:isNull(data.contractPics,[]).map((item,index)=>({//合同审核图片
      id:`key_${index}`,
      title:'',
      src:item,
    })),
    financialComment:isNull(data.financialComment,''),//财务审核说明
    financialPics:isNull(data.financialPics,[]).map((item,index)=>({//财务审核图片
      id:`key_${index}`,
      title:'',
      src:item,
    })),
    refundStatus:isNull(data.refundStatus,''),//审核状态
  }
  // const newState={
  //   visible:true,
  //   stepList:[
  //     {
  //       title:'申请退款'
  //     },{
  //       title:'退款审核'
  //     },{
  //       title:'财务审核'
  //     },{
  //       title:'执行退款'
  //     }
  //   ],
  //   type:'applyGroupBuy',
  //   current:0,
  //   groupBuyId,
  // }
  return JSON.stringify(result)
}
//【审核步骤模态框】type判断 发起获取数据fetch
function judgeStepsModalType({record,type,recordList},result){//record:当前数据
  // console.log('result',result);
  // console.log('record',record);
  if(type==='applyTrans'){
    //申请成交
    if(record.txStatus==='未申请审核'){
      const showDataInfo={
        tableData:[
          {
            project:isNull(result.projectName,''),
            propertyType:isNull(result.propertyType,''),
            intentionHouse:isNull(result.houseName,''),
            groupBuyType:isNull(result.discountName,''),
            unitPrice:isNull(result.unitPrice,''),
            totalPrice:isNull(result.totalPrice,''),
            commission:isNull(result.commissionAmount,''),
            agent:isNull(result.brokerName,''),
            time:isNull(result.txTime,''),
          }
        ],
        orderInfo:[
          {
            label:'佣金总额',
            value:isNull(result.brokerage,''),
          },{
            label:'平台抽佣',
            value:isNull(result.ptBrokerage,''),
          },{
            label:'交易服务费',
            value:`${isNull(result.txCharge,'')}`,
          },{
            label:'剩余佣金总额',
            value:isNull(result.residualCommission,''),
          },{
            label:'支付方式',
            value:isNull(result.payType,''),
          },{
            label:'佣金比例',
            value:isNull(result.commissionRate,''),
          },{
            label:'佣金分配金额',
            value:isNull(result.commissionAmount,''),
          }
        ]
      }
      const stepsAuditingModalState={//审核步骤通用模态框
        title:'新房-成交申请',
        visible:true,
        type:'transApply',
        stepList:[
          {
            title:'申请成交'
          },{
            title:'成交审核'
          },{
            title:'财务审核'
          },{
            title:'执行分佣'
          }
        ],//step数组
        width:1000,//模态框宽度
        stepStatus:'process',//当前进度状态
        current:0,//审核进度
        showDataInfo:JSON.stringify(showDataInfo),//JSON
        groupKey:record.groupKey,
      };
      return stepsAuditingModalState;
    }
  }else if(type==='applyGroupBuyRefund'){
    const showDataInfo={
      tableData:[
        {
          refundType:isNull(result.refundType,'电商团购'),
          project:isNull(result.projectName,''),
          orderNumber:isNull(result.payOrderNumber,''),
          payType:isNull(result.payType,''),
          serialNumber:isNull(result.paySerialNumber,''),
          customerName:isNull(result.customerName,''),
          customerPhone:isNull(result.customerPhone,''),
          payDateTime:isNull(result.payFinishTime,''),
          payAmount:isNull(result.groupbuyMoney,''),
          payStatus:isNull(result.payStatus,''),
        }
      ],
    }
    const stepsAuditingModalState={//审核步骤通用模态框
      title:'电商团购——退款申请',
      visible:true,
      type:'applyGroupBuyRefund',
      stepList:[
        {
          title:'申请退款'
        },{
          title:'退款审核'
        },{
          title:'财务审核'
        },{
          title:'执行退款'
        }
      ],//step数组
      width:1000,//模态框宽度
      stepStatus:'process',//当前进度状态
      current:0,//审核进度
      showDataInfo:JSON.stringify(showDataInfo),//JSON
      groupKey:record.groupKey,
      groupBuyId:record.groupBuyId,
    };
    return stepsAuditingModalState;
  }else if(type==='groupBuyRefundInfo'){
    let current=0;
    let stepStatus='process';
    let stepList=[
      {
        title:'申请退款'
      },{
        title:'退款审核'
      },{
        title:'财务审核'
      },{
        title:'执行退款'
      }
    ];
    const showDataInfo={
      tableData:[
        {
          refundType:isNull(result.refundType,'电商团购'),
          project:isNull(result.projectName,''),
          orderNumber:isNull(result.payOrderNumber,''),
          payType:isNull(result.payType,''),
          serialNumber:isNull(result.paySerialNumber,''),
          customerName:isNull(result.customerName,''),
          customerPhone:isNull(result.customerPhone,''),
          payDateTime:isNull(result.payFinishTime,''),
          payAmount:isNull(result.groupbuyMoney,''),
          payStatus:isNull(result.payStatus,''),
        }
      ],
      applyInfo:[
        {
          label:'退款理由',
          value:isNull(result.reason,''),
        }
      ],
      reasonPics:isNull(result.reasonPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })),
      refundSchedules:isNull(result.refundSchedules,[]).map(item=>({
        label:item,
        value:'',
      })),
    }
    //审核状态转换
    if(result.refundStatus==='待合同审核'){
      current=1;
      stepStatus='process';
    }else if(result.refundStatus==='合同审核/已驳回'){
      current=1;
      stepStatus='error';
      showDataInfo.contractRejectInfo=[{
        label:'合同审核驳回说明',
        value:isNull(result.contractComment,''),
      }];
      showDataInfo.contractPics=isNull(result.contractPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
      stepList=[
        {
          title:'申请退款',
        },{
          title:'退款审核',
          description:'已驳回',
        },{
          title:'财务审核',
        },{
          title:'执行退款',
        }
      ];
    }else if(result.refundStatus==='待财务审核'){
      current=2;
      stepStatus='process';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.contractComment,''),
      }];
      showDataInfo.contractPics=isNull(result.contractPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
    }else if(result.refundStatus==='财务审核/已驳回'){
      current=2;
      stepStatus='error';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.contractComment,''),
      }];
      showDataInfo.contractPics=isNull(result.contractPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
      showDataInfo.financialRejectInfo=[{
        label:'合同审核驳回说明',
        value:isNull(result.financialComment,''),
      }];
      showDataInfo.financialPics=isNull(result.financialPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
      stepList=[
        {
          title:'申请退款',
        },{
          title:'退款审核',
        },{
          title:'财务审核',
          description:'已驳回',
        },{
          title:'执行退款',
        }
      ];
    }else if(result.refundStatus==='待退款'){
      current=3;
      stepStatus='process';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.contractComment,''),
      }];
      showDataInfo.contractPics=isNull(result.contractPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
      showDataInfo.financialInfo=[{
        label:'合同审核说明',
        value:isNull(result.financialComment,''),
      }];
      showDataInfo.financialPics=isNull(result.financialPics,[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      }));
      stepList=[
        {
          title:'申请退款',
        },{
          title:'退款审核',
        },{
          title:'财务审核',
        },{
          title:'执行退款',
        }
      ];
    }
    const stepsAuditingModalState={//审核步骤通用模态框
      title:'电商团购——退款申请',
      visible:true,
      type:'groupBuyRefundInfo',
      stepList,//step数组
      width:1000,//模态框宽度
      stepStatus,//当前进度状态
      current,//审核进度
      showDataInfo:JSON.stringify(showDataInfo),//JSON
      groupKey:record.groupKey,
      groupBuyId:record.groupBuyId,
    };
    return stepsAuditingModalState;
  }else if(type==='applyTransAuditing'){//成交申请审核详情
    // console.log('recordList',recordList);
    let current=0;
    let stepStatus='process';
    let stepList=[
      {
        title:'申请成交'
      },{
        title:'成交审核'
      },{
        title:'财务审核'
      },{
        title:'执行分佣'
      }
    ];
    const showDataInfo={
      tableData:[
        {
          project:isNull(result.projectName,''),
          propertyType:isNull(result.propertyType,''),
          intentionHouse:isNull(result.houseName,''),
          groupBuyType:isNull(result.discountName,''),
          unitPrice:isNull(result.unitPrice,''),
          totalPrice:isNull(result.totalPrice,''),
          commission:isNull(result.commissionAmount,''),
          agent:isNull(result.brokerName,''),
          time:isNull(result.txTime,''),
        }
      ],
      orderInfo:[
        {
          label:'佣金总额',
          value:isNull(result.commissionAmount,''),
        },{
          label:'平台抽佣',
          value:isNull(result.ptBrokerage,''),
        },{
          label:'交易服务费',
          value:isNull(result.txCharge,''),
        },{
          label:'剩余佣金总额',
          value:isNull(result.residualCommission,''),
        },{
          label:'成交方式',
          value:isNull(result.payType,''),
        },{
          label:'佣金比例',
          value:isNull(result.commissionRate,''),
        },{
          label:'佣金分配金额',
          value:isNull(result.commissionAmount,''),
        }
      ],
      applyInfo:[
        {
          label:'成交说明',
          value:isNull(result.dealAuditDesc,''),
        }
      ],
      applyPics:!!result.dealAttachments?isNull(JSON.parse(result.dealAttachments),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[],
      refundSchedules:isNull(recordList,[]).map(item=>({
        label:item.date,
        value:item.content,
      })),
    }
    //审核状态转换
    if(result.auditStatus==='待业务审核'){
      current=1;
      stepStatus='process';
    }else if(result.auditStatus==='业务审核拒绝'){
      current=1;
      stepStatus='error';
      showDataInfo.contractRejectInfo=[{
        label:'合同审核驳回说明',
        value:isNull(result.dealAuditResultDesc,''),
      }];
      showDataInfo.contractPics=!!result.dealAuditResultFile?isNull(JSON.parse(result.dealAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
      stepList=[
        {
          title:'申请成交',
        },{
          title:'成交审核',
          description:'已驳回',
        },{
          title:'财务审核',
        },{
          title:'执行分佣',
        }
      ];
    }else if(result.auditStatus==='待财务审核'){
      current=2;
      stepStatus='process';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.dealAuditResultDesc,''),
      }];
      showDataInfo.contractPics=!!result.dealAuditResultFile?isNull(JSON.parse(result.dealAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
    }else if(result.auditStatus==='财务审核拒绝'){
      current=2;
      stepStatus='error';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.dealAuditResultDesc,''),
      }];
      showDataInfo.contractPics=!!result.dealAuditResultFile?isNull(JSON.parse(result.dealAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
      showDataInfo.financialRejectInfo=[{
        label:'财务审核驳回说明',
        value:isNull(result.financialAuditResultDesc,''),
      }];
      showDataInfo.financialPics=!!result.financialAuditResultFile?isNull(JSON.parse(result.financialAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
      stepList=[
        {
          title:'申请成交',
        },{
          title:'成交审核',
        },{
          title:'财务审核',
          description:'已驳回',
        },{
          title:'执行分佣',
        }
      ];
    }else if(result.auditStatus==='财务审核通过'){
      current=4;
      stepStatus='process';
      showDataInfo.contractInfo=[{
        label:'合同审核说明',
        value:isNull(result.dealAuditResultDesc,''),
      }];
      showDataInfo.contractPics=!!result.dealAuditResultFile?isNull(JSON.parse(result.dealAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
      showDataInfo.financialInfo=[{
        label:'财务审核说明',
        value:isNull(result.financialAuditResultDesc,''),
      }];
      showDataInfo.financialPics=!!result.financialAuditResultFile?isNull(JSON.parse(result.financialAuditResultFile),[]).map((item,index)=>({
        id:`key_${index}`,
        src:item,
        title:'',
      })):[];
      stepList=[
        {
          title:'申请成交',
        },{
          title:'成交审核',
        },{
          title:'财务审核',
        },{
          title:'执行分佣',
        }
      ];
    }
    const stepsAuditingModalState={//审核步骤通用模态框
      title:'新房电商-成交申请',
      visible:true,
      type:'applyTransAuditingInfo',
      stepList,//step数组
      width:1000,//模态框宽度
      stepStatus,//当前进度状态
      current,//审核进度
      showDataInfo:JSON.stringify(showDataInfo),//JSON
      groupKey:record.groupKey,
      groupBuyId:record.groupBuyId,
    };
    // console.log('stepsAuditingModalState',stepsAuditingModalState);
    return stepsAuditingModalState;
  }
};
