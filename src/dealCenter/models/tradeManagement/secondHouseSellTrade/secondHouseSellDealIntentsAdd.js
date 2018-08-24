import { routerRedux } from 'dva/router'
import {
  renderSHSellTrackDataJSON,
  getNewTypeTrackJSONData,
} from '../../../../commons/utils/currencyFunction'
import {
  isNull,
  creatHouseInfo,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
  renderUnitPriceStr,
} from '../../../../commons/utils/publicFunction'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  addIntentionSellFetch,
  getNoPayOrderFetch,
  payIntentsFetch,
  cancelNoPayOrderFetch,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellDealIntentsAdd'
import {
  validateCustomerInfoFetch,
}from '../../../services/userFetch'

const initState={
  loading:true,
  type:'default',
  trackJSON:null,
  transCode:null,
  transactionMode:null,
  reEditModalVisible:false,
  intentionInfo:null,
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
  payModal:{
    visible:false,
    orderInfo:null,//订单信息
    loading:true,
    serialNumber:'',//流水号
    transCode:null,
    closeMini:false,
  },
}
export default {
  namespace: 'secondHouseSellDealIntentsAdd',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/secondHouseSellTrade/secondHouseSellDealIntentsAdd'){
         dispatch({
           type:'doInitState',
         })
         if(!!location.state && !!location.state.transCode){
           dispatch({
             type:'setTransactionMode',
             payload:location.state.transactionMode,
           })
           dispatch({
             type:'getTrackInfo',
             payload:location.state.transCode,
           })
           dispatch({
             type:'getNoPayOrder',
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
    //获得track数据
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
          },
        });
      }
    },
    //初始化时查询是否有未支付订单，变更组件状态
    *getNoPayOrder({payload},{call,put}){
      const {data}=yield call(getNoPayOrderFetch,{transCode:payload});
      if(!!data){
        if(data.status==='success'){
          if(!!data.data.orderNumber){
            //有未支付账单 type==='old'
            const {intentions}=data.data;
            const noPayOrderInfo={
              orderNumber:isNull(data.data.orderNumber,'-'),
              unitPrice:renderUnitPriceStr(intentions.unitPrice,'-'),
              totalPrice:renderTotalMoneyStr(intentions.totalPrice,'-'),
              intentionAmount:`${isNull(intentions.intentionAmount,'-')}元`,
              createDateTime:isNull(data.data.createDateTime,'-'),
              transCode:payload,
            }
            // const intentionArr=[
            //   {
            //     label:'意向成交单价',
            //     value:isNull(intentions.totalPrice,''),
            //   },{
            //     label:'意向成交总价',
            //     value:isNull(intentions.totalPrice,''),
            //   },{
            //     label:'意向定金金额',
            //     value:isNull(intentions.intentionAmount,''),
            //   }
            // ];
            yield put({
              type:'initTypeOld',
              payload:{
                orderNumber:data.data.orderNumber,
                intentionInfo:JSON.stringify(noPayOrderInfo),
                transCode:payload,
              },
            })
          }else{
            //没有未支付账单 type==='new'
            yield put({
              type:'initTypeNew',
              payload,
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取订单信息失败',
              okText:'确定',
              todo:'noPayOrder',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系系统管理员',
            title:'获取订单信息失败',
            okText:'确定',
            todo:'noPayOrder',
          },
        });
      }
    },
    //取消未支付订单
    *cancelNoPayOrder({payload},{select,call,put}){
      yield put({
        type:'closeComfirmModal',
      })
      const {transCode}=yield select(({secondHouseSellDealIntentsAdd})=>secondHouseSellDealIntentsAdd);
      const {data}=yield call(cancelNoPayOrderFetch,{
        transCode,
      });
      if(!!data){
        if(data.status==='success'){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'取消未支付订单成功！',
              okText:'确定',
              todo:'reload',
            },
          });
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'取消未支付订单失败！',
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
            description:data.message,
            title:'取消未支付订单失败！',
            okText:'确定',
            todo:'default',
          },
        });
      }
    },
    //验证客户信息
    *validateCustomerInfo({payload},{call,put,select}){
      const {trackJSON,transactionMode}=yield select(({secondHouseSellDealIntentsAdd})=>secondHouseSellDealIntentsAdd);
      if(transactionMode === '合作成交'){
        const {customerPhone}=payload;
        let customerBrokerId = null;
        try {
          customerBrokerId = getNewTypeTrackJSONData(trackJSON,'客户所属经纪人').id
        } catch (e) {
          customerBrokerId = null;
        }
        const{data}=yield call(validateCustomerInfoFetch,{
          brokerId:customerBrokerId,
          phone:customerPhone,
        })
        if(!!data){
          if(data.status==='success'){
            yield put({
              type:'creatInentsOrder',
              payload:{
                ...payload,
                customerId:isNull(data.data.customerId,null),
                customerName:isNull(data.data.customerName,null),
              }
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'验证客户信息失败！',
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
              description:'请求失败，请联系系统管理员',
              title:'验证客户信息失败！',
              okText:'确定',
              todo:'default',
            },
          });
        }
      }else{
        yield put({
          type:'creatInentsOrder',
          payload,
        })
      }

    },




    //创建意向金支付订单
    *creatInentsOrder({payload},{call,put,select}){
      yield put({type:'changeLoading',payload:true})
      const{transCode}=yield select(({secondHouseSellDealIntentsAdd})=>secondHouseSellDealIntentsAdd);
      const {data}=yield call(addIntentionSellFetch,{
        intentionAmount:payload.deposit,
        totalPrice:(payload.totalPrice)*10000,
        transCode:transCode,
        unitPrice:payload.price,
        // customerName:isNull(payload.customerName,''),
        // customerId:isNull(payload.customerId,''),
        // customerSex:payload.gender,
        // customerPhone:isNull(payload.customerPhone,''),
        // customerIDNumber:payload.customerIDNumber,
      });
      if(!!data){
        if(data.status==='success' && !!data.data.orderNumber){
          //创建意向金订单成功
          yield put({type:'changeLoading',payload:false})
          yield put({
            type:'openPayModal',
            payload:transCode,
          })
        }else{
          yield put({type:'changeLoading',payload:false})
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'添加意向金申请失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }else{
        yield put({type:'changeLoading',payload:false})
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'添加意向金申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },

    //【支付】打开支付模态框
    *openPayModal({payload},{call,put}){
      //必须传入payload=transCode
      if(!!payload){
        //打开支付模态框__状态为loading
        yield put({
          type:'initPayModal',
          payload,
        })
        //使用传入的transCode访问【查询未支付】API获取订单数据
        const {data}=yield call(getNoPayOrderFetch,{transCode:payload});
        if(!!data){
          if(data.status==='success'){
            const orderInfo={
              discountName:'二手房意向金',
              amount:isNull(data.data.amount,''),
              orderNumber:isNull(data.data.orderNumber,''),
              bankCard:isNull(data.data.cardNumber,''),
              idNumber:isNull(data.data.customerIDNumber,''),
              customerName:isNull(data.data.customerName,''),
              phoneNumber:isNull(data.data.customerPhone,''),
              payId:isNull(payload,''),
            };
            yield put({
              type:'updatePayModalOrderInfo',
              payload:JSON.stringify(orderInfo),
            })
          }else{
            //关闭支付模态框，初始化状态
            yield put({type:'clearPayModal'})
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'运行支付模块失败！',
                okText:'确定',
                todo:'default',
              },
            });
          }
        }else{
          //关闭支付模态框，初始化状态
          yield put({type:'clearPayModal'})
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'获取订单信息失败！',
              title:'运行支付模块失败！',
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
            description:'transCode无效',
            title:'运行支付模块失败！',
            okText:'确定',
            todo:'default',
          },
        });
      }
    },
    //关闭支付模态框
    *closePayModal({payload},{select,put}){
      const {transCode}=yield select(({secondHouseSellDealIntentsAdd})=>secondHouseSellDealIntentsAdd);
      yield put({
        type:'clearPayModal',
      })
      yield put({
        type:'getNoPayOrder',
        payload:transCode,
      })
    },
    //【支付】执行支付
    *payGroupBuy({payload},{call,put,select}){
      //执行支付请求
      const {data}=yield call(payIntentsFetch,{
        cardNumber:payload.bankCard,
        customerIDNumber:payload.idNumber,
        transCode:payload.payId,
        customerPhone:payload.phoneNumber,
        customerName:payload.customerName,
        paymentMethod:'POS机',
      })
      if(!!data){
        if(data.status==='success' && !!data.data){
          // //更新支付流水号
          // yield put({
          //   type:'updatePayModalSerialNumber',
          //   payload:orderNumber,
          // })
        }else{
          yield put({type:'closePayModalMini'})
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'上传支付信息失败！',
              okText:'确定',
              todo:'default',
            },
          });
        }
      }else{
        yield put({type:'closePayModalMini'})
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败！',
            title:'上传支付信息失败！',
            okText:'确定',
            todo:'default',
          },
        });
      }
    },

    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{promptObj:{todo,},transCode}=yield select(({secondHouseSellDealIntentsAdd})=>secondHouseSellDealIntentsAdd);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'reload':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'getNoPayOrder',
            payload:transCode,
          })
          break;
        case 'closePayModal':
          yield put({
            type:'onlyClosePrompt'
          });
          // yield put({
          //   type:'closePayModal'
          // });
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
  },
  reducers: {
    //初始化track数据
    initTrackData(state,action){
      return {...state,...action.payload,loading:false}
    },
    //设置成交类型
    setTransactionMode(state,action){
      return {...state,transactionMode:action.payload}
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //初始化state
    doInitState(state,action){
      return initState;
    },
    //设置主界面为loading
    changeLoading(state,action){
      return {...state,loading:action.payload}
    },
    //切换状态为old
    initTypeOld(state,action){
      return {...state,type:'old',...action.payload,loading:false}
    },
    //切换状态为new
    initTypeNew(state,action){
      return {...state,type:'new',loading:false,transCode:action.payload}
    },
    //【支付模态框】打开
    initPayModal(state,action){
      return {...state,payModal:{...initState.payModal,visible:true,transCode:action.payload,}}
    },
    //【支付模态框】关闭
    clearPayModal(state,action){
      return {...state,payModal:initState.payModal}
    },
    //【支付模态框】更新订单数据
    updatePayModalOrderInfo(state,action){
      return {...state,payModal:{...state.payModal,orderInfo:action.payload,loading:false}}
    },
    //【支付模态框】获取支付流水号失败，关闭支付小模态框
    closePayModalMini(state,action){
      return {...state,payModal:{...state.payModal,closeMini:true,serialNumber:''}}
    },
    //【支付模态框】更新支付流水号
    updatePayModalSerialNumber(state,action){
      return {...state,payModal:{...state.payModal,serialNumber:action.payload}}
    },
    //打开确认模态框
    openComfirmModal(state,action){
      return {...state,reEditModalVisible:true}
    },
    //关闭确认模态框
    closeComfirmModal(state,action){
      return {...state,reEditModalVisible:false}
    },
  },
}
