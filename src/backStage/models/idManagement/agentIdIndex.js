import {findByCondition,findAllAreasOpen,deleteOperators,resetPassword
} from '../../services/idManagement/agentIdIndex';
import { parse } from 'qs';
import {message} from 'antd';
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
	namespace: 'agentIdIndex',
	state: {
		dataSource:[],
		total:'',
		pageNo:'',
		optionsArr:[],
		areaName:'',
		keyWord:'',
    loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/agentIdIndex') {
          dispatch({
            type:"iniaitFindAll"
          })
					// dispatch({type:'findAllAreas'})
          // dispatch({type: 'findAll',
					// 	payload:{
					// 		pageNo:0,
					// 		areaName:'',
					// 		keyWord:'',
					// 	}
					// });
				}
			});
		},
	},
	effects: {
    *iniaitFindAll({ payload }, { call, put }){
      yield put({type:'findAllAreas'});
      yield put({
        type:'findAll',
        payload:{
          pageNo:0,
          areaName:'/河北省/保定市',
          keyWord:'',
        }
      })
    },
		*findAllAreas({ payload }, { call, put }){
			const {data}=yield call(findAllAreasOpen,{...payload})
			if(data.data){
				yield put({
					type:'querySuccess',
					payload:{
						optionsArr:_toCascaderOptions(data.data),
					}
				})
			}else{
				message.error(data.message)
			}
		},
    *findAll({ payload }, { call, put }){
      const  {data}  = yield call(findByCondition, {...payload});
      if(data.data){
        const dataSource=[];
				data.data.content.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						areaName:item.areaName,
						createTime:item.createTime,
						loginName:item.loginName,
						role:item.role,
						status:item.status,
					})
				))
				yield put({type:'querySuccess',
					payload:{
						dataSource:dataSource,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
						areaName:payload.areaName,
						keyWord:payload.keyWord,
            loading:false,
					}
				})
      }
    },
    *agentIdIndexDelete({ payload }, { call, put }){
      const  {data}  = yield call(deleteOperators, {...payload});
      if(data.data){
        yield put({type:'findAll',
          payload:{
            pageNo:0,
            areaName:'',
            keyWord:'',
          }
        })
        message.success('删除成功')
      }else{
        yield put({type:'querySuccess',payload:{loading:false}})
        message.error(data.message)
      }
    },
    *agentIdIndexresetPassword({ payload }, { call, put }){
      const  {data}  = yield call(resetPassword, {...payload});
      if(data.data){
        yield put({type:'findAll',
          payload:{
            pageNo:0,
            areaName:'',
            keyWord:'',
          }
        })
        message.success('重置密码成功')
      }else{
        yield put({type:'querySuccess',payload:{loading:false}})
        message.error(data.message)
      }
    },
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
