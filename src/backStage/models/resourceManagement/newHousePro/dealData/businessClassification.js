export default {
  namespace: 'businessClassification',
  state: {
    defaultValue:"报备"
  },
  reducers: {
    initial(state){
      return{...state,defaultValue:'报备'}
    },
  },
}
