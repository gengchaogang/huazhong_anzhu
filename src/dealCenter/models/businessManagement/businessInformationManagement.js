import {query} from '../../services/businessManagement/businessInformationManagement';
import {message} from 'antd';
export default {
  namespace:'businessInformationManagement',
  state:{
    mainInformation:{},
  },
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/businessManagement/businessInformationManagement') {
         dispatch({
           type: 'query',
         });
       }
     });
   },
  },
  effects:{
    *query({ payload }, { call, put }){
      const {data, err}  = yield call(query);
      if(err){
				message.info('查询错误！'+err.message,6);
				return;
			}
      if(data){
        console.log('data',data);
        let licensePic = data.data.licensePic;
        yield put ({
          type: 'querySuccess',
          payload: {
            mainInformation: data.data
          },
        });
      }
    },
  },
  reducers:{
    querySuccess(state,action){
      return { ...state, ...action.payload };
    },
  },
}
