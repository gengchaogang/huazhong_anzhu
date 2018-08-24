import {editPassword,} from '../../services/setting/modifyPassword';
import { parse } from 'qs';
import { message} from 'antd';
import { routerRedux } from 'dva/router';
export default {
	namespace: 'modifyPassword',
	state: {
    loading:false,
		confirmDirty:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/setting/modifyPassword'){

        }
			});
		},
	},
	effects: {
		//初始化请求表格数据
    *editPasswordClick({ payload }, { call, put }){
    	const {data,err}=yield call(editPassword,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
        yield put(routerRedux.push({
    			pathname: `/`,}));
        message.success('更改成功')
      }else{
        message.error(data.message)
      }
    },
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
