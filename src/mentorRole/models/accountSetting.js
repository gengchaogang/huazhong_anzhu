import {
    modifyPasswordFetch,
  } from '../services/accountSetting'
export default {
  namespace: 'accountSetting',
  state: {  //state
    confirmDirty:false,
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
  },
  reducers: { //action
    changeConfirmDirty(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
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
    *modifyPassword({payload},{call,put}){
      const {data}=yield call(modifyPasswordFetch,{...payload});
      if(!!data&&data.status==='success'){
        if(!!data.data.result){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'修改密码成功,请重新登录',
            visible:true,
            todo:"closeModalAndToLogoIn"
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    }
  }
}
