export default{
  namespace:'ImgManagement',
  state:{
    createhousetype:true,
  },
  reducers:{
    CreateType(state){
      return{...state,createhousetype:!state.createhousetype}
    },
    handleClose(state){
      return{...state,createhousetype:true}
    }
  }
}
