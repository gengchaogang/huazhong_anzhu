import { routerRedux } from 'dva/router';
export default {
  namespace: 'retrievePwd',
  state: {
    current:0,
  },
  reducers: {
    next(state,action){
      return{...state,...action.payload}
    },
    prev(state,action){
      return{...state,...action.payload}
    },
    changePasswordDirty(state,action){
      return{...state,...action.payload}
    },
    setCurrent(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{

  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/retrievePwd/getCodeByPhone') {
          dispatch({
            type: 'setCurrent',
            payload:{
              current:0
            }
          });
				}else if(location.pathname === '/retrievePwd/reSetPassWrod'){
          dispatch({
            type: 'setCurrent',
            payload:{
              current:1
            }
          });
        }
			});
		},
	},
}
