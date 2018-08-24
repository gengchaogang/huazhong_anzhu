import {findWithdrawList,findAllAreasOpenFetch,findWithdrawDetail,dealWithWithdraw
} from '../../services/contentCheck/applicationWithdrawal';
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
	namespace: 'applicationWithdrawal',
	state: {
    cascaderOptions:[],
    dataSource:[],
    pageNo:0,
    refuseStatus:false,
    total:'',
    status:'待处理',
    casoptions:[],
    addTime:'',
    areaPath:'',
    finishTime:'',
    money:'',
    id:'',
    name:'',
    optUserId:'',
    optUserName:'',
    optUserType:'',
    phone:'',
    reason:'',
    result:'',
    dealStatus:'',
    userType:'',
    keyword:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/applicationWithdrawal') {
          dispatch({type:'initailFindAll'})
				}
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      yield put({type:'findAll',
        payload:{
          status:'待处理',
          keyword:'',
          areaPath:'/河北省/保定市',
          pageNo:0,
        }
      })
      yield put({type:'findAllAreasOpen'})
    },
    *findAllAreasOpen({ payload }, { call, put }){
      const {data,err}=yield call(findAllAreasOpenFetch);
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'setCassed',
          payload:{
            casoptions:_toCascaderOptions(data.data)
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *operationClick({ payload }, { call, put }){
      const {data,err}=yield call(findWithdrawDetail,{...payload});
      if(err){
        return message.error('出错了,请联系管理员')
      }
      if(!!data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            addTime:data.data.addTime,
            detailsStatus:true,
            areaPath:data.data.areaPath,
            finishTime:data.data.finishTime,
            money:data.data.money,
            id:data.data.id,
            name:data.data.name,
            optUserId:data.data.optUserId,
            optUserName:data.data.optUserName,
            optUserType:data.data.optUserType,
            phone:data.data.phone,
            reason:data.data.reason,
            result:data.data.result,
            dealStatus:data.data.status,
            userType:data.data.userType,
          }
        })
      }
    },
    *detailsAgreen({ payload }, { call, put }){
      const {data,err}  = yield call(dealWithWithdraw,{...payload});
      if(err){
        return message.error('出错了,请联系管理员')
      }
      if(data.data){
        yield put({type:'findAll',payload:{
          pageNo:0,
          status:payload.status,
        }})
      }else{
        message.error(data.message)
      }
    },
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findWithdrawList,{...payload});
      if(err){
        return message.error('出错了,请联系管理员')
      }
      if(data.data){
        const dataSource=[];
        data.data.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            addTime:item.addTime,
            areaPath:item.areaPath,
            id:item.id,
            money:item.money,
            name:item.name,
            status:item.status,
            userType:item.userType,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            detailsStatus:false,
            refuseStatus:false,
            status:payload.status,
            keyword:payload.keyword,
            areaPath:payload.areaPath,
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
		setCassed(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
