import { routerRedux } from 'dva/router'
import {
  renderSHSellTrackDataJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
  renderResoucesAreaStr,
} from '../../../../commons/utils/publicFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getOneReportTransInfo,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  postTransferApplyFetch,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTransferApply'
import {isNull} from '../../../../commons/utils/currencyFunction'
import {
  getAuditorList,
}from '../../../services/userFetch'
const initState={
  transCode:null,
  trackJSON:null,
  loading:true,
  applyModal:{
    visible:false,
    houseInfo:null,
    progress:[],
    auditorList:[],
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
  namespace: 'secondHouseSellTransferApply',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/secondHouseSellTrade/secondHouseSellTransferApply') {
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
              trackJSON:renderSHSellTrackDataJSON(trackDetail,payload),
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
      const {transCode}=yield select(({secondHouseSellTransferApply})=>secondHouseSellTransferApply);
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
            !!data.data.commissionComplete && progressKeys.push('中介佣金已支付');
            !!data.data.firstpaymentComplete && progressKeys.push('首付款已支付');
            !!data.data.loanComplete && progressKeys.push('贷款已批');
            const houseInfo={
              houseCode:isNull(resourcesInfo.resourcesNumber,''),
              communityName:isNull(data.data.communityName,''),
              houseInfo:isNull(resourcesInfo.default,''),
              houseArea:renderResoucesAreaStr(data.data.resourcesArea,''),
              unitPrice:renderUnitPriceStr(data.data.commissionUnitPrice,''),
              totalPrice:renderTotalMoneyStr(data.data.commissionTotalPrice,''),
              supportLoan:isNull(data.data.resourceSupportLoan,false),
            }
            const response=yield call(getAuditorList,{name:'二手房过户办理'});
            if(!!response.data){
              if(response.data.status==='success'){
                yield put({
                  type:'initApplyModal',
                  payload:{
                    visible:true,
                    houseInfo:JSON.stringify(houseInfo),
                    progress:progressKeys,
                    auditorList:response.data.data.map(item=>({
                      name:item.name,
                      id:`${item.userId}`,
                    })),
                  }
                })
              }else{
                yield put({
                  type: 'switchPrompt',
                  payload:{
                    visible:true,
                    description:response.data.message,
                    title:'获取审核人员列表失败！',
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
                  description:'',
                  title:'获取审核人员列表失败！',
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
      const {transCode,applyModal:{auditorList}}=yield select(({secondHouseSellTransferApply})=>secondHouseSellTransferApply);
      if(auditorList.length===0 || transCode===null){
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
        let selectAuditorName;
        auditorList.map(item=>{
          if(item.id===payload.auditor){
            selectAuditorName=item.name;
          }
        })
        const {data}=yield call(postTransferApplyFetch,{
          customerName:payload.customerName,
          customerPhone:payload.customerPhone,
          hasCustomerHouseholdRegister:payload.customerCertificates.includes('户口本原件'),
          hasCustomerIDCard:payload.customerCertificates.includes('身份证原件'),
          hasCustomerMarriageCertificate:payload.customerCertificates.includes('结婚证原件'),
          hasOwnerIDCard:payload.ownerCertificates.includes('身份证原件'),
          hasOwnerPropertyCertificate:payload.ownerCertificates.includes('房产证'),
          ownerName:payload.ownerName,
          ownerPhone:payload.ownerPhone,
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
                title:'申请过户成功！',
                okText:'确定',
                todo:'closeApplyModalAndOut',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'申请贷款失败！',
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
              title:'申请贷款失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ secondHouseSellTransferApply }) => secondHouseSellTransferApply.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'closeApplyModal':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'closeApplyModal'});
          break;
        case 'closeApplyModalAndOut':
          yield put({type:'switchPrompt',payload:{visible:false}});
          yield put({type:'closeApplyModal'});
          yield put(routerRedux.goBack());
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
  },
}
