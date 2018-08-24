import {findAllAreasFetch,
} from '../../services/contentCheck/brokerNameCertificate';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: lable, label:lable}, children;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
export default {
	namespace: 'brokerNameCertificate',
	state: {
    cascaderOptions:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/brokerNameCertificate') {
          dispatch({type:'findAllAreas',})
				}
			});
		},
	},
	effects: {
    *findAllAreas({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreasFetch);
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            cascaderOptions:_toCascaderOptions(data.data),
          }
        })
      }else{
        message.error(data.message)
      }
    },
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
