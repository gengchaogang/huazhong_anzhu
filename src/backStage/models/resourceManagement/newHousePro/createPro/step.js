export default {
  namespace: 'step',
  state: {
  current: 0,
  },
  reducers: {
    next(state) {
      console.log("state is",state)
      return {...state,current:state.current+1};
    },
    prev(state){
      return {...state,current:state.current-1}
    },
    reset(state){
      return{...state,current:0}
    }
  },
}
