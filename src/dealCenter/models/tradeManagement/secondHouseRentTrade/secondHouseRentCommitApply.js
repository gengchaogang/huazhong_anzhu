import { routerRedux } from 'dva/router'
import {
  renderSHRentTrackDataJSON,
  isNull,
  checkNum,
  isNullRate,
} from '../../../../commons/utils/currencyFunction'
import {
  floorTwoNumber,
  renderMoneyStr,
  renderResoucesAreaStr,
  renderRentMeony,
  getNumByPersent,
  accMul,
  accSub,
} from '../../../../commons/utils/publicFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getOneReportTransInfo,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  postCommitApplyFetch,
  getCommitApplyBasicDataFetch,
}from '../../../services/tradeManagement/secondHouseRentTrade/secondHouseRentCommitApply'
const initState={
  transCode:null,
  trackJSON:null,
  loading:true,
  commitInfo:null,
  commitApplyInfo:null,
  releaseIntention:null,
  houseInfo:null,
  isFailCommit:false,//是否是失败成交
  upLoadPicList:[],
  applyPreDataInfo:null,
  canBeRelease:false,
  commitType:null,//成交类型 cooperation own
  commissionType:null,//佣金类型 rate quota
  applyModal:{
    visible:false,
    commissionInfo:null,
    upLoadPicList:[],
  },
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
}
export default {
  namespace: 'secondHouseRentCommitApply',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseRentTrade/secondHouseRentCommitApply') {
          dispatch({
            type:'initComponent',
            payload:location.state,
          })
        }
      });
    },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({
        type:'doInitState',
      })
      if(!!payload && !!payload.transCode){
        if(isNull(payload.failCommit,false)){
          yield put({
            type:'changeFailCommitType',
            payload:true,
          })
        }
        yield put({
          type:'getTrackInfo',
          payload:payload.transCode,
        })
        yield put({
          type:'getReportTransBasicInfo',
          payload:payload.transCode,
        })
        yield put({
          type:'doGetAuditorList',
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'未获得transCode',
            title:'获取交易数据失败',
            okText:'确定',
            todo:'getOut',
          },
        })
      }
    },
    //获得track数据
    *getTrackInfo({payload},{select,call,put}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload})
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON:renderSHRentTrackDataJSON(trackDetail,payload),
              transCode:payload,
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              okText:'确定',
              todo:'getOut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取交易数据失败！',
            okText:'确定',
            todo:'getOut',
          },
        });
      }
    },
    //【报成交】获取报成交之前的基础信息
    *getReportTransBasicInfo({payload},{call,put}){
      const {data}=yield call(getCommitApplyBasicDataFetch,{transCode:payload});
      if(!!data){
        if(data.status==='success' && !!data.data){
          // const response=yield call(getAuditorList,{name:'二手房成交审核'});
          // console.log('response',response);
          //判断成交类型
          let commitType=null;//判断成交类型
          let commissionType=null;//判断佣金类型
          let surplusCommissionAmount=null;//剩余佣金总额
            const test = accMul(Number(data.data.commissionAmount),accSub(1,Number(data.data.platformCommissionRate)));
            console.log('test',test);
            console.log('test',test);
          try{
            const test = accMul(Number(data.data.commissionAmount),accSub(1,Number(data.data.platformCommissionRate)));
            console.log('test',test);
            surplusCommissionAmount=test;
          }catch(e){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'获取报成交交易数据失败！',
                okText:'确定',
                todo:'getOut',
              },
            });
          }
          const houseInfo={
            propertyType:isNull(data.data.propertyType,'-'),
            info:isNull(JSON.parse(data.data.resourcesInfo).default,'-'),
            area:renderResoucesAreaStr(data.data.resourcesArea),
            rentType:isNull(data.data.rentPayment,'-'),
            rentTerm:`${isNull(data.data.leaseTerm,'-')}月`,
            rentPrice:renderRentMeony(data.data.actualRent,data.data.propertyType),
            rentWay:isNull(data.data.rentalMode,'-'),
            rentCommission:renderMoneyStr(data.data.commissionAmount),
            brokerName:isNull(data.data.brokerName,'-'),
            customerBrokerName:isNull(data.data.customerBrokerName,'-'),
          }
          let canBeRelease=false;
          let releaseIntention=null;
          if(isNull(data.data.releaseInfos,[]).length!==0){
            canBeRelease=true;
            data.data.releaseInfos.map(item=>{
              if(item.releaseType==='意向金'){
                releaseIntention={
                  amount:isNull(item.releaseAmount,''),
                  inComeOrderNumber:isNull(item.inComeOrderNumber,''),
                  inComeSerialNumber:isNull(item.inComeSerialNumber,''),
                  releaseTo:'客户',
                }
              }
            })
          }
          const commitInfo={
            surplusCommissionAmount,
            brokerCommissionAmount:null,
            customerBrokerCommissionAmount:null,
            ownerName:isNull(data.data.ownerName,''),
            ownerPhone:isNull(data.data.ownerPhone,''),
            commission:isNull(data.data.commissionAmount,''),
            commissionRate:isNull(data.data.platformCommissionRate,0),
            brokerCommissionRate:isNull(data.data.brokerCommissionRate,''),
            customerBrokerCommissionRate:isNull(data.data.customerBrokerCommissionRate,0),
          }
          if(isNull(data.data.transactionMode,'')==='合作成交'){
            commitType='cooperation';
            //判断佣金类型
            if(checkNum(data.data,'customerBrokerCommissionRate')){
              commissionType='rate';
              commitInfo.brokerCommissionAmount=accMul(surplusCommissionAmount,data.data.brokerCommissionRate);
              commitInfo.customerBrokerCommissionAmount=accSub(surplusCommissionAmount,commitInfo.brokerCommissionAmount);
            }else{
              commissionType='quota';
              commitInfo.brokerCommissionAmount=accSub(surplusCommissionAmount,isNull(data.data.customerBrokerCommissionAmount,0));
              commitInfo.customerBrokerCommissionAmount=isNull(data.data.customerBrokerCommissionAmount,0);
            }
          }else{
            commitType='own';
            commitInfo.brokerCommissionAmount=surplusCommissionAmount;
          }
          yield put({
            type:'initBasicData',
            payload:{
              loading:false,
              applyPreDataInfo:JSON.stringify(data.data),
              houseInfo:JSON.stringify(houseInfo),
              commitInfo:JSON.stringify(commitInfo),
              upLoadPicList:[],
              canBeRelease,
              commitType,//成交类型 cooperation own
              commissionType,//佣金类型 rate quota
              releaseIntention,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取报成交交易数据失败！',
              okText:'确定',
              todo:'getOut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取报成交交易数据失败！',
            okText:'确定',
            todo:'getOut',
          },
        });
      }
    },
    //打开成交申请模态框
    *checkPreCommitApply({payload},{select,put}){
      const {
        transCode,
        upLoadPicList,
        commitInfo,
        houseInfo,
        applyPreDataInfo,
        releaseIntention,
        commissionType,
      }=yield select(({secondHouseRentCommitApply})=>secondHouseRentCommitApply);
      if(!!payload){
        const {
          ownerBankCard,
          auditor,
          commissionAmount,
          customerBrokerCommissionRate,
          surplusCommissionAmount,
        }=payload;
        let releaseinfo=[];
        if(!!payload.intention_releaseType){
          releaseinfo.push({
            inComeSerialNumber:payload.intention_inComeSerialNumber,
            releaseAmount:payload.intention_releaseAmount,
            inComeOrderNumber:releaseIntention.inComeOrderNumber,
            releaseOwner:releaseIntention.releaseTo==='业主',
            releaseType:payload.intention_releaseType,
          })
        }
        let brokerCommissionAmount='';
        let customerBrokerCommissionAmount='';
        try{
          // if(!!payload.brokerCommissionAmount){
          //   brokerCommissionAmount=payload.brokerCommissionAmount;
          // }else if(!!payload.brokerCommissionRate){
          //   brokerCommissionAmount=Number(payload.surplusCommissionAmount)*Number(payload.brokerCommissionRate)/100;
          // }
          // if(!!payload.customerBrokerCommissionAmount){
          //   customerBrokerCommissionAmount=payload.customerBrokerCommissionAmount;
          // }else if(!!payload.customerBrokerCommissionRate){
          //   customerBrokerCommissionAmount=Number(payload.surplusCommissionAmount)*Number(payload.customerBrokerCommissionRate)/100;
          // }
          if(!!payload.brokerCommissionAmount){
            brokerCommissionAmount=payload.brokerCommissionAmount;
          }else if(!!payload.brokerCommissionRate){
            brokerCommissionAmount=floorTwoNumber(accMul(Number(payload.surplusCommissionAmount),getNumByPersent(Number(payload.brokerCommissionRate))));
          }
          if(!!payload.customerBrokerCommissionAmount){
            customerBrokerCommissionAmount=payload.customerBrokerCommissionAmount;
            brokerCommissionAmount=payload.brokerCommissionAmount;
          }else if(!!payload.customerBrokerCommissionRate){
            customerBrokerCommissionAmount=floorTwoNumber(accMul(Number(payload.surplusCommissionAmount),getNumByPersent(Number(payload.customerBrokerCommissionRate))));
            brokerCommissionAmount=floorTwoNumber(accMul(Number(payload.surplusCommissionAmount),accSub(1,getNumByPersent(Number(payload.customerBrokerCommissionRate)))));
          }
        }catch(e){
          brokerCommissionAmount='';
        }
        const commitApplyObj={
          releaseinfo,
          ownerName:isNull(payload.ownerName,''),
          ownerPhone:isNull(payload.ownerPhone,''),
          ownercardNumber:isNull(payload.ownerBankCard,''),
          ownerBank:isNull(payload.ownerBank,''),
          ownerSubbranch:isNull(payload.ownerSubbranch,''),
          ownerIDNumber:isNull(payload.ownerIDNumber,''),
          ownerBankProvince:isNull(payload.ownerBankProvinceCity,['',''])[0],
          ownerBankCity:isNull(payload.ownerBankProvinceCity,['',''])[1],
          releaseType:isNull(payload.releaseType,''),
          commissionAmount,
          contracts:upLoadPicList.map(item=>item.id),
          surplusCommissionAmount,
          brokerCommissionRate:`${accSub(1,getNumByPersent(isNull(payload.customerBrokerCommissionRate,0)))}`,
          brokerCommissionAmount,
          customerBrokerCommissionRate:getNumByPersent(isNull(payload.customerBrokerCommissionRate,'')),
          customerBrokerCommissionAmount,
          transCode,
        }
        const applyPreData=JSON.parse(applyPreDataInfo);
        const commissionArr=[
          {
            label:'佣金总额',
            value:`${isNull(commitApplyObj.commissionAmount,'-')}元`,
          },{
            label:'平台抽佣',
            value:isNullRate(applyPreData.platformCommissionRate,'-'),
          },{
            label:'交易服务费',
            value:`${isNull(applyPreData.serviceCharge,'-')}元`,
          },{
            label:'剩余佣金总额',
            value:`${isNull(commitApplyObj.surplusCommissionAmount,'-')}元`,
          },{
            label:'成交方式',
            value:isNull(applyPreData.transactionMode,'-'),
          }
        ]
        if(applyPreData.transactionMode==='合作成交'){
          if(commissionType === 'rate'){
            //比例分配
            commissionArr.push({
              label:'租户经纪人佣金比例',
              value:isNullRate(commitApplyObj.customerBrokerCommissionRate,'-'),
            })
            commissionArr.push({
              label:'租户经纪人佣金金额',
              value:`${isNull(commitApplyObj.customerBrokerCommissionAmount,'-')}元`,
            })
            commissionArr.push({
              label:'业主经纪人佣金比例',
              value:isNullRate(commitApplyObj.brokerCommissionRate,'-'),
            })
            commissionArr.push({
              label:'业主经纪人佣金金额',
              value:`${isNull(commitApplyObj.brokerCommissionAmount,'-')}元`,
            })
          }else if(commissionType === 'quota'){
            //固定金额
            // commissionArr.push({
            //   label:'买方经纪人佣金比例',
            //   value:isNullRate(commitApplyObj.customerBrokerCommissionRate,'-'),
            // })
            commissionArr.push({
              label:'租户经纪人佣金金额',
              value:`${isNull(commitApplyObj.customerBrokerCommissionAmount,'-')}元`,
            })
            // commissionArr.push({
            //   label:'卖方经纪人佣金比例',
            //   value:isNullRate(commitApplyObj.brokerCommissionRate,'-'),
            // })
            commissionArr.push({
              label:'业主经纪人佣金金额',
              value:`${isNull(commitApplyObj.brokerCommissionAmount,'-')}元`,
            })
          }
        }else{
          commissionArr.push({
            label:'经纪人佣金比例',
            value:isNull((1-applyPreData.platformCommissionRate),'-'),
          })
          commissionArr.push({
            label:'经纪人佣金金额',
            value:`${isNull(commitApplyObj.surplusCommissionAmount,'-')}元`,
          })
        }
        yield put({
          type:'openCommitApplyModal',
          payload:{
            commitApplyInfo:JSON.stringify(commitApplyObj),
            applyModal:{
              visible:true,
              commissionInfo:JSON.stringify(commissionArr),
              upLoadPicList:[],
            }
          }
        })
      }
    },
    //执行报成交申请
    *doCommitAppply({payload},{select,call,put}){
      const {transCode,auditorList,commitApplyInfo,isFailCommit,applyModal:{upLoadPicList,}}=yield select(({secondHouseRentCommitApply})=>secondHouseRentCommitApply);
      if(!!payload){
        const {
          auditor,
          failCommitReason,
        }=payload;
        let auditorName;
        auditorList.map(item=>{
          if(item.id===auditor){auditorName=item.name}
        })
        const basicApplyObj=JSON.parse(commitApplyInfo);
        if(isFailCommit && failCommitReason){
          basicApplyObj.transactionFailure=true;
          basicApplyObj.transactionFailureReason=failCommitReason;
        }
        const {data}=yield call(postCommitApplyFetch,{
          ...basicApplyObj,
          memo:payload.reason,
          images:upLoadPicList.map(item=>item.id),
          toUserName:auditorName,
          toUserId:auditor,
        });
        if(!!data){
          if(data.status==='success' && !!data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'报成交申请成功！',
                okText:'确定',
                todo:'goToTradeIndex',
              },
            });
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'报成交申请失败！',
                okText:'确定',
                todo:'default',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'报成交申请失败！',
              okText:'确定',
              todo:'default',
            },
          });
        }
      }
    },
    //获取成交审核人员列表
    *doGetAuditorList({payload},{call,put}){
      const{data}=yield call(getAuditorList,{name:'二手房成交合同审核'});
      if(!!data && data.status==='success'){
        const auditorList=data.data.map(item=>({
          name:item.name,
          id:`${item.userId}`,
        }));
        yield put({
          type:'initAuditorList',
          payload:auditorList,
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'获取审核人员列表失败'),
            title:'获取成交审核人员失败！',
            okText:'确定',
            todo:'goOut',
          },
        })
      }
    },


    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ secondHouseRentCommitApply }) => secondHouseRentCommitApply.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
          break;
        case 'goToTradeIndex':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade'
          }));
          break;
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },

  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    initTrackData(state,action){
      return {...state,...action.payload,loading:false}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //资金释放上传图片list改变
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
    },
    onlyClosePrompt(state,action){
      return{...state,promptObj:initState.promptObj}
    },
    initAuditorList(state,action){
      return {...state,auditorList:action.payload}
    },
    initBasicData(state,action){
      return {...state,...action.payload}
    },
    closeApplyModal(state,action){
      return {...state,applyModal:initState.applyModal}
    },
    changeApplyModalUpPicList(state,action){
      return {...state,applyModal:{...state.applyModal,upLoadPicList:action.payload}}
    },
    //【成交申请】打开申请模态框
    openCommitApplyModal(state,action){
      return {...state,...action.payload}
    },
    //【资金释放】意向金释放目标变化
    onIntResToChange(state,action){
      return {...state,releaseIntention:{...state.releaseIntention,releaseTo:action.payload}}
    },
    //切换失败成交
    changeFailCommitType(state,action){
      return {...state,isFailCommit:action.payload}
    }

  },
}
