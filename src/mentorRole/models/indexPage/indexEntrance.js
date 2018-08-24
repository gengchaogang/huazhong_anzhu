export default {
  namespace: 'mentorIndexEntrance',
  state: {  //state
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  },
  reducers: { //action
    saveExpandedKeys(state,action){
      return{...state,...action.payload}
    }
  },
  subscriptions:{ //路由监听
		// setup({ dispatch, history }) {
		// 	history.listen(location => {
		// 		if (location.pathname === '/xxx') {
    //
		// 		}
		// 	});
		// },
	},
  effects:{ //发起异步请求

  }
}
