export default{
  namespace:'availabilityDetails',
  state:{
    modalStatus:false
  },
  reducers:{
    availabilityClick(state){
      return{...state,modalStatus:true}
    },
    avahandleOk(state){
      return{...state,modalStatus:false}
    },
    avahandleCancel(state){
      return{...state,modalStatus:false}
    },
  }
}
