import request from '../../../../../commons/utils/request'
import qs from 'qs'
async function upload(params){
    // return request('/miss-anzhu-newhouse-project/projects/edit?'+qs.stringify(params))//get 请求用
    return request('/miss-anzhu-newhouse-project/projects/edit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
async function getInitLable(params){
    // return request('/miss-anzhu-newhouse-project/projects/edit?'+qs.stringify(params))//get 请求用
    return request('/miss-anzhu-newhouse-project/projects/edit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export default {
  namespace: 'step',
  state: {
  current: 0,
  },
  reducers: {
    next(state) {
      return {...state,current:state.current+1};
    },
    prev(state){
      return {...state,current:state.current-1}
    },
    reset(state){
      return{...state,current:0}
    },
    setState(state,{payload}){
      return {
        ...state,
        ...payload
        };
    },
  },
  effects:{
    *uploadNewHouse({payload},{call,put}){
        const res=yield call(upload,{...payload});
        // console.log({res});
    },
    *getLabel({payload},{call,put}){
      const getLabelData=yield call(getInitLable,{...payload});
      console.log({getLabelData})
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location => {
           if (location.pathname === '/newHouseOnline/projectManagement/createPro/NavBar') {
             dispatch({
               type: 'setState',
               payload: {
                 current:0,
               }
             });
           };
           if (location.pathname === '/newHouseOnline/projectManagement/createPro/NavBar') {
             const typeNames=location.state.typeNames
            //  console.log(location)
             dispatch({
               type: 'getLabel',
               payload: {
                 typeNames
               }
             });
           }
         });
       },
  }
}
