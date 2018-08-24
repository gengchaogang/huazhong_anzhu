export default{
  namespace:'secondNavBar',
  state:{
    defaultValue:'房源详情'
  },
  reducers:{
    initial(state){
      return{...state,defaultValue:'房源详情'}
    },
    onChange(state,action){
      console.log(action.payload)
      return{...state,defaultValue:action.payload.value}
    }
  }
}
