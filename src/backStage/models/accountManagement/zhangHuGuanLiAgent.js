import {findAllAreasOpenFetch,findAccountsOperatorFetch} from '../../services/accountManagement/zhangHuGuanLiAgent';
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
	namespace: 'zhangHuGuanLiAgent',
	state: {
    cascaderArr:[],//城市级联数组
    dataSource:[],//表格数组
    total:'',//
    pageNo:0,//
    areaPath:'',
    keyword:'',
    operatorType:'',
    loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/zhangHuGuanLiAgent') {
          // dispatch({type: 'findAllAreasOpen'});
          // dispatch({
          //   type:'findAccountsOperator',
          //   payload:{
          //     pageNo:0,
          //     areaPath:'',
          //     keyword:'',
          //     operatorType:'',
          //   }
          // })
          dispatch({type:'initialFindAll'})
				}
			});
		},
	},
	effects: {
    *initialFindAll({ payload }, { call, put }){
      yield put({type: 'findAllAreasOpen'});
      yield put({
        type:'findAccountsOperator',
        payload:{
          pageNo:0,
          areaPath:'/河北省/保定市',
          keyword:'',
          operatorType:'',
        }
      })
    },
    *findAllAreasOpen({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreasOpenFetch);
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
    *findAccountsOperator({ payload }, { call, put }){
      const  {data,err}  = yield call(findAccountsOperatorFetch, {...payload});
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
            operatorType:item.operatorType,
            status:item.status,
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
            operatorType:payload.operatorType,
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
