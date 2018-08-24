const initialState={
  currentChildDetail:null,
  // prev deal jc
  showRentalIntention:false,  //是否显示出租意向金
  showRentalPaymentReceipt:false, //是否显示租房意向金收据
  showRentalCommissionPaid:false, //是否显示已支付租房佣金
  showHousingReceiptUploaded:false, //是否已上传租房居间合同或收据
  showRentalStageProgress:false, //是否显示租房分期办理进度
  showTransactionSet:false, //是否显示成交分佣设置
  showSecondHandTransaction:false, //是否显示二手房出成交
  //Dealt ggj


	//待成交页面__State jason

	//审核对象modal所用

};

export default {
  namespace:'secondLeaseDeal',
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

  },
  effects:{
    // prev deal jc

    //Dealt ggj

    //Waiting Deal jason


    //
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location => {
           if (location.pathname === '/dealManagement/secondHouseLease') {
             dispatch({
               type: 'setState',
               payload: {

               }
             });
           }
         });
       },
  }
}
