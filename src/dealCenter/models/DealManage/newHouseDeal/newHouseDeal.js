export default {
  namespace: 'newHouseDeal',
  state: {
    RejectModelStatus:false,
    RefundModelStatus:false,
  },
  reducers: {
    doCollapse(state) {
      return {...state,RejectModelStatus:!state.RejectModelStatus};
    },
    handleOk(state) {
      return {...state,RejectModelStatus:false};
    },
    handleCancel(state) {
      return {...state,RejectModelStatus:false};
    },
    hanleRefund(state){
      return {...state,RefundModelStatus:!state.RefundModelStatus};
    },
    handleRefundOk(state) {
      return {...state,RefundModelStatus:false};
    },
    handleRefundCancel(state) {
      return {...state,RefundModelStatus:false};
    },
  },
}
