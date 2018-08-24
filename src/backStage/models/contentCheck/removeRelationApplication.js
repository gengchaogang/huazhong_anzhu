import {findAllAreas,findTerminateApplyList,findTerminateDisposeList,
  findBrokerStateApplyListFetch,findBrokerStateListFetch,
} from '../../services/contentCheck/removeRelationApplication';
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
	namespace: 'removeRelationApplication',
	state: {
    cascaderOptions:[],//城市级联数组
    cascaderOriginal:[],//城市级联原数组
    dataApplyList:[],//待处理师徒列表
    dataDisposeList:[],//已处理师徒列表
    masterStatus:'待处理',//状态
    relationship:'师徒',
    cityNames:'',
    name:'',
    pageNo:0,
    loading:true,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/removeRelationApplication') {
          dispatch({type:'initailFindAll'})
          // dispatch({type: 'findAreas'});
          // dispatch({
          //   type:'findApplyList',
          //   payload:{
          //     cityNames:'',
          //     name:'',
          //     pageNo:0,
          //   }
          // })
				}
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      yield put({type: 'findAreas'});
      yield put({
        type:'findApplyList',
        payload:{
          cityNames:'/河北省/保定市',
          name:'',
          pageNo:0,
        }
      })
    },
    *findAreas({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreas);
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            cascaderOptions:_toCascaderOptions(data.data),
            cascaderOriginal:data.data,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *findApplyList({payload},{call,put}){
      const {data,err}  = yield call(findTerminateApplyList, {...payload});
      if(err){
        message.error('查询列表失败')
        return  yield put({type:'initailSuccess',
          payload:{
            loading:false,
          }
        })

      }
      if(data.data){
        const dataApplyList=[];
        data.data.content.map((item,index)=>(
          dataApplyList.push({
            key:item.id,
            number:index+1,
            relationship:'师徒',
            applyBrokerCityNames:item.applyBrokerCityNames,
            applyBrokerName:item.applyBrokerName,
            applyBrokerRole:item.applyBrokerRole,
            relationBrokerCityNames:item.relationBrokerCityNames,
            relationBrokerName:item.relationBrokerName,
            relationBrokerRole:item.relationBrokerRole,
            time:item.time,
          })
        ))
        yield put({type:'initailSuccess',
          payload:{
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            dataApplyList:dataApplyList,
            masterStatus:'待处理',
            cityNames:payload.cityNames,
            name:payload.name,
            relationship:'师徒',
            loading:false,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *findBrokerStateApplyList({payload},{call,put}){
      const {data,err}  = yield call(findBrokerStateApplyListFetch, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataApplyList=[];
        data.data.content.map((item,index)=>(
          dataApplyList.push({
            key:item.id,
            number:index+1,
            relationship:'导师',
            applyBrokerCityNames:item.applyBrokerCityNames,
            applyBrokerName:item.applyBrokerName,
            applyBrokerRole:item.applyBrokerRole,
            relationBrokerCityNames:item.relationBrokerCityNames,
            relationBrokerName:item.relationBrokerName,
            relationBrokerRole:item.relationBrokerRole,
            time:item.time,
          })
        ))
        yield put({type:'initailSuccess',
          payload:{
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            dataApplyList:dataApplyList,
            masterStatus:'待处理',
            cityNames:payload.cityNames,
            name:payload.name,
            relationship:'导师',
            loading:false,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *findDisposeList({payload},{call,put}){
      const {data,err}  = yield call(findTerminateDisposeList, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataDisposeList=[];
        data.data.content.map((item,index)=>(
          dataDisposeList.push({
            key:item.id,
            number:index+1,
            relationship:'师徒',
            applyBrokerCityNames:item.applyBrokerCityNames,
            applyBrokerName:item.applyBrokerName,
            applyBrokerRole:item.applyBrokerRole,
            relationBrokerCityNames:item.relationBrokerCityNames,
            relationBrokerName:item.relationBrokerName,
            relationBrokerRole:item.relationBrokerRole,
            time:item.time,
          })
        ))
        yield put({type:'initailSuccess',
          payload:{
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            dataDisposeList:dataDisposeList,
            masterStatus:'已处理',
            cityNames:payload.cityNames,
            name:payload.name,
            relationship:'师徒',
            loading:false,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *findBrokerStateList({payload},{call,put}){
      const {data,err}  = yield call(findBrokerStateListFetch, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataDisposeList=[];
        data.data.content.map((item,index)=>(
          dataDisposeList.push({
            key:item.id,
            number:index+1,
            relationship:'导师',
            applyBrokerCityNames:item.applyBrokerCityNames,
            applyBrokerName:item.applyBrokerName,
            applyBrokerRole:item.applyBrokerRole,
            relationBrokerCityNames:item.relationBrokerCityNames,
            relationBrokerName:item.relationBrokerName,
            relationBrokerRole:item.relationBrokerRole,
            time:item.time,
          })
        ))
        yield put({type:'initailSuccess',
          payload:{
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            dataDisposeList:dataDisposeList,
            masterStatus:'已处理',
            cityNames:payload.cityNames,
            name:payload.name,
            relationship:'导师',
            loading:false,
          }
        })
      }else{
        message.error(data.message);
      }
    },
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
