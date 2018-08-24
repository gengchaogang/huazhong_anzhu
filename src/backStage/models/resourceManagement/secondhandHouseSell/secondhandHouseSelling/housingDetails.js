export default {
  namespace: 'housingDetails',
  state: {
    modalVisible:false,
    submitLoading:false,
  },
  reducers: {
    //控制表格组件
    changeState(state,action) {
      // console.log('action',action);
      return {...state,...action.payload};
    },

  },
}