import {
  findAll,addFetch
} from '../../services/apkVersion/apkManagement';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'apkManagement',
	state: {
    dataSource:[],
    addStatus:false,
  },
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/apkVersion/apkManagement') {
          dispatch({type:'initailFindAll'})
				}
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findAll,{...payload});
      if(err){
        message.error('出错了，请联系管理员')
        return
      }
      if(!!data){
        const dataSource=[];
        data.data.map((item,index)=>(
          dataSource.push({
            key:item.id,
            createDate:item.createDate,
            description:item.description,
            url:item.url,
            versionNumber:item.versionNumber,
            addStatus:false,
            apkType:item.apkType,
          })
        ))
        yield put({type:'initailSuccess',
          payload:{
            dataSource:dataSource,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *add({ payload }, { call, put }){
      const {data,err}=yield call(addFetch,{...payload});
      if(err){
        message.error('出错了，请联系管理员')
        return
      }
      if(!!data.data){
        message.success('添加成功')
        yield put({type:'initailFindAll'})
        yield put({type:'setState',payload:{addStatus:false}})
      }else{
        message.error(data.message)
      }
    },
	},
  reducers: {
    initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
    setState(state,{payload}){
			return { ...state, ...payload };
		},
  },
}
