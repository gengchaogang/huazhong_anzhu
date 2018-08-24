import { routerRedux } from 'dva/router'
import {
  renderSHRentTrackDataJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getOneReportTransInfo,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  postLoanApplyFetch,
}from '../../../services/tradeManagement/secondHouseRentTrade/secondHouseRentLoanApply'
import {
  renderTotalMoneyStr,
  floorTwoNumber,
  renderUnitPriceStr,
  renderMoneyStr,
  renderResoucesAreaStr,
  renderRentMeony,
} from '../../../../commons/utils/publicFunction'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {isNull} from '../../../../commons/utils/currencyFunction'
const initState={
  transCode:null,
  trackJSON:null,
  loading:true,
  applyModal:{
    visible:false,
    houseInfo:null,
    progress:[],
    auditorList:[],
    cusTypeValue:[],
    selectCusType:'已参加工作',
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
  namespace: 'secondHouseRentLoanApply',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseRentTrade/secondHouseRentLoanApply') {
          dispatch({
            type:'doInitState',
          })
          if(!!location.state && !!location.state.transCode){
            dispatch({
              type:'getTrackInfo',
              payload:location.state.transCode,
            })
          }else{
            dispatch({
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
        }
      });
    },
  },
  effects:{
    //【贷款申请】获得track数据
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
    //【贷款申请】获取一条报成交信息
    *getApplyLoanData({payload},{select,call,put}){
      const {transCode}=yield select(({secondHouseRentLoanApply})=>secondHouseRentLoanApply);
      if(!!transCode){
        const {data}=yield call(getOneReportTransInfo,{transCode,});
        if(!!data){
          if(data.status==='success' && !!data.data.id){
            let resourcesInfo=null;
            try{
              resourcesInfo=JSON.parse(data.data.resourcesInfo)
            }catch(e){
              resourcesInfo=null;
            }
            const progressKeys=[];
            !!data.data.intentionComplete && progressKeys.push('意向金已支付');
            !!data.data.commissionComplete && progressKeys.push('租房中介佣金已支付');
            const houseInfo={
              propertyType:isNull(data.data.propertyType,'-'),
              communityName:isNull(data.data.communityName,'-'),
              houseInfo:isNull(resourcesInfo.default,'-'),
              houseArea:renderResoucesAreaStr(data.data.resourcesArea,'-'),
              village:isNull(data.data.communityName,'-'),
              propertyType:isNull(data.data.propertyType,'-'),
              info:isNull(resourcesInfo.default,'-'),
              area:renderResoucesAreaStr(data.data.resourcesArea,'-'),
              rentType:isNull(data.data.rentPayment,'-'),
              rentTerm:`${isNull(data.data.leaseTerm,'-')}月`,
              rentPrice:renderRentMeony(data.data.actualRent,resourcesInfo.resourcesType),
              rentWay:isNull(data.data.rentalMode,'-'),
            }
            const response=yield call(getAuditorList,{name:'二手房出租分期办理'});
            if(!!response.data && response.data.status==='success'){
              const auditorList=response.data.data.map(item=>({
                name:item.name,
                id:`${item.userId}`,
              }));
              yield put({
                type:'initApplyModal',
                payload:{
                  visible:true,
                  houseInfo:JSON.stringify(houseInfo),
                  progress:progressKeys,
                  auditorList:auditorList,
                }
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
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取交易数据失败',
              okText:'确定',
              todo:'getOut',
            },
          })
        }
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
    //【贷款申请】执行贷款申请
    *postLoanApply({payload},{call,select,put}){
      const {
        transCode,
        applyModal:{
          auditorList,
          cusTypeValue,
          selectCusType,
        }
      }=yield select(({secondHouseRentLoanApply})=>secondHouseRentLoanApply);
      if(auditorList.length===0 || transCode===null || cusTypeValue.length===0){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有必填信息填写完整',
            title:'申请贷款失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }else{
        let pass=false;
        if(selectCusType==='学生'){
          pass=true;
        }else{
          const workSet=new Set(cusTypeValue);
          if(workSet.has('身份证')){
            workSet.delete('身份证');
          }
          if(workSet.has('租房合同')){
            workSet.delete('租房合同');
          }
          if(workSet.size>=2){
            pass=true;
          }
        }
        if(!!pass){
          let selectAuditorName;
          auditorList.map(item=>{
            if(item.id===payload.auditor){
              selectAuditorName=item.name;
            }
          })
          const {data}=yield call(postLoanApplyFetch,{
            customerName:payload.customerName,
            customerPhone:payload.customerPhone,
            loanAmount:payload.rentAmount,
            loanRate:payload.rentRate,
            loanTerm:payload.rentTerm,
            loanType:payload.rentType,
            customerType:selectCusType,
            customerMaterials:JSON.stringify(cusTypeValue),
            toUserId:payload.auditor,
            toUserName:selectAuditorName,
            transCode,
          });
          if(!!data){
            if(data.status==='success' && !!data.data){
              yield put({
                type: 'switchPrompt',
                payload:{
                  visible:true,
                  description:'',
                  title:'申请分期成功！',
                  okText:'确定',
                  todo:'closeApplyModal',
                },
              })
            }else{
              yield put({
                type: 'switchPrompt',
                payload:{
                  visible:true,
                  description:data.message,
                  title:'申请分期失败！',
                  okText:'确定',
                  todo:'default',
                },
              })
            }
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'请求失败，请联系管理员',
                title:'申请分期失败！',
                okText:'确定',
                todo:'default',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请确认所有必填信息填写完整',
              title:'申请分期失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ secondHouseRentLoanApply }) => secondHouseRentLoanApply.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'closeApplyModal':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'closeApplyModal'});
          yield put(routerRedux.push({
            pathname:'/tradeManagement/secondHouseRentTrade',
          }));
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
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
    onlyClosePrompt(state,action){
      return{...state,promptObj:initState.promptObj}
    },
    //【贷款申请】关闭模态框
    closeApplyModal(state,action){
      return {...state,applyModal:initState.applyModal}
    },
    //【贷款申请】打开模态框
    initApplyModal(state,action){
      return {...state,applyModal:{...state.applyModal,...action.payload},loading:false}
    },
    //【贷款申请】客户类型切换
    onCusTypeChange(state,action){
      return {...state,applyModal:{...state.applyModal,selectCusType:action.payload,cusTypeValue:[]}}
    },
    //【贷款申请】客户类型选择
    cusTypeValueChange(state,action){
      return {...state,applyModal:{...state.applyModal,cusTypeValue:action.payload}}
    },
  },
}
