import {findAllAreasOpenFetch,findAccountsFetch,
} from '../../services/accountManagement/accountDealCenter';
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
	namespace: 'accountDealCenter',
	state: {
    cascaderArr:[],
    dataSource:[],
    total:'',
    pageNo:0,
    areaPath:'',
    keyword:'',
    status:'',
    loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/accountDealCenter') {
          // dispatch({type:'findAllAreasOpen'})
          // dispatch({type:'findAccounts',
          //   payload:{
          //     areaPath:'',
          //     keyword:'',
          //     pageNo:0,
          //     status:'',
          //   }
          // })
          dispatch({type:'initialFindAll'})
				}
			});
		},
	},
	effects: {
    *initialFindAll({ payload }, { call, put }){
      yield put({type:'findAllAreasOpen'})
      yield put({type:'findAccounts',
        payload:{
          areaPath:'/河北省/保定市',
          keyword:'',
          pageNo:0,
          status:'',
        }
      })
    },
    *findAllAreasOpen({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreasOpenFetch, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        yield put({
          type:'initialSuccess',
          payload:{cascaderArr:_toCascaderOptions(data.data)}
        })
      }else{
        message.error(data.message)
      }
    },
    *findAccounts({ payload }, { call, put }){
      const  {data,err}  = yield call(findAccountsFetch, {...payload});
      if(err){
				yield put({type:'initialSuccess',payload:{loading:false}})
				return message.error('出错了,请联系管理员')
			}
      if(!!data.data){
        const dataSource=[];
        data.data.content.map((item,index)=>(
          dataSource.push({
            number:index+1,
            key:item.userId,
            amount:item.amount,
            areaPath:item.areaPath,
            codePath:item.codePath,
            loginName:item.loginName,
            name:item.name,
            status:item.status,
            tradingCenterOperatorId:item.tradingCenterOperatorId,
            tradingCenterOperatorName:item.tradingCenterOperatorName,
            userType:item.userType,
          })
        ))
        yield put({
          type:'initialSuccess',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            areaPath:payload.areaPath,
            keyword:payload.keyword,
            status:payload.status,
            loading:false,
          }
        })
      }else{
				yield put({type:'initialSuccess',payload:{loading:false}})
				return message.error(data.message)
			}
    },
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
