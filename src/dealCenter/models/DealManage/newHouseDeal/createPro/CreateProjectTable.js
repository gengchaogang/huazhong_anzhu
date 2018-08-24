export default {
  namespace:'CreateProjectTable',
  state:{
    selectedRowKeys: [],  // Check here to configure the default column
      loading: false,
  },
  reducers:{
    modifyLoading(state){
      console.log(state)
      return{...state,loading:!state.loading}
    },
    modifyBoth(state){
      console.log("state ",state)
      return{...state,selectedRowKeys:[],loading:false}
    },
    modifySelect(state,anction){
      console.log(anction.payload)
      return{...state,selectedRowKeys:anction.payload}
    }
  }
}
