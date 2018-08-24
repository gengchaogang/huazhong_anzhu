import request from '../../../../commons/utils/request';
import {query} from '../../../services/indexPage';
const initialState={
  currentChildDetail:null,
  // prev deal jc
  showRejectApplicationModal:false, //是否显示驳回申请弹出框
  showIntentionToPay:false,    //是否显示已支付意向金
  showIntentionalContractAgreement:false,    //是否显示意向合同协议
  showPayTheFirstPayment:false,    //是否显示已支付首付款
  showFirstPaymentAgreement:false,    //是否显示首付款合同协议
  showPaidCommission:false,    //是否显示已支付佣金
  showTradingCommissionAgreement:false,    //是否显示买卖居间协议/佣金协议
  showHousingLoanInformation:false,    //是否显示房源贷款信息
  showHousingTransferInformation:false,    //是否显示房屋过户信息
  showTransactionFundsReleaseAccount:false,    //是否显示成交资金释放账户
  showTransactionSet:false,    //是否显示成交分佣设置
  showHousTransactionInformation:false,    //是否显示房屋成交信息
  showHandleTransferModal:false,   //是否显示
  ApplyTransferCurrent:0,  //申请过户当店Steps的值
  isApplyTransferWrote:true,  //申请过户是读还是写

  //Dealt ggj
  showDealProgress:false,
  showDispositionPay:false,
  showFirstPay:false,
  showRakeOffPay:false,
  showApplyLoan:false,
  currentRow:null,
  showSelectShenheObj:false,

	//二手房待成交页面 jason
    //Uploader 所需state
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
    //审核对象Modal
    auditorModalVisible:false,
    auditorModalSubmitLoading:false,
    //意向金退款申请Modal
    EarnestShowButton:'default',//判断是否显示重新申请按钮
    earnestRefundModalVisible:false,
    earnestRefundInputVisible:false,
    //首付款退款申请Modal
    downpaymentShowButton:'default',
    downpaymentShowVisible:false,
    downpaymentInputVisible:false,
    //佣金退款申请Modal
    BrokerageRefundShowButton:'default',
    BrokerageRefundShowVisible:false,
	  BrokerageRefundInputVisible:false,
    //成交申请Modal
    ApplyDealVisible:false,
	  ApplyDeal_status:'申请成交',
    //房屋解押Modal
    HousingDischargeVisible:false,
    HousingDischarge_status:'解押申请已驳回',
};

export default {
  namespace:'secondDeal',
  state:initialState,
  reducers:{
    resetState(state){
      return {
        ...state,
        ...initialState
      };
    },
    setState(state,{payload}){
      return {
        ...state,
        ...payload
      };
    },
    showRejectApplicationModal(state){
      return{...state,showRejectApplicationModal:!state.showRejectApplicationModal}
    }
  },
  effects:{
    // prev deal jc

    //Dealt ggj
    *asyncSetState({payload},{put,call}){
      const data=yield call(()=>query('/miss-anzhu-operation/service-regions/findAll?columnName=id'));
      console.log({data});
    }
    //Waiting Deal jason


    //
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location => {
           if (location.pathname === '/dealManagement/secondHouseSellDeal') {
             dispatch({
               type: 'setState',
               payload: {
                 currentChildDetail:null,
                 ApplyTransferCurrent:0,
                 isApplyTransferWrote:false,
                 showHandleTransferModal:false,
               }
             });
           }
         });
       },
  }
}
