import { routerRedux } from 'dva/router';
export default {
  namespace: 'mentorRegister',
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
				if (location.pathname === '/mentorRegister/writePhone') {
          dispatch({
            type: 'setCurrent',
            payload:{
              cuttent:0
            }
          });
				}else if(location.pathname === '/mentorRegister/perfectInformation'){
          dispatch({
            type: 'setCurrent',
            payload:{
              current:1
            }
          });
        }
      else if(location.pathname === '/mentorRegister/complete'){
          dispatch({
            type: 'setCurrent',
            payload:{
              current:2
            }
          });
        }
			});
		},
	},
}
