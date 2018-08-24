import {showApplyDetail,operationApplyFetch,showApplyBrokerDetail,
	operationApplyBrokerFetch,
} from '../../services/contentCheck/dealDetailMaster';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
export default {
	namespace: 'dealDetailMaster',
	state: {
    time:'',
    result:'',
    relationBrokerRole:'',
    relationBrokerName:'',
    relationBrokerCityNames:'',
    processTime:'',
    operationUserInfo:'',
    description:'',
    id:'',
    applyBrokerCityNames:'',
    applyBrokerRole:'',
    applyBrokerName:'',
		masterStatus:'',
		relationship:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/removeRelationApplication/dealDetailMaster') {
					if(location.state.relationship=='师徒'){
						dispatch({
							type:'initailSuccess',
							payload:{
								masterStatus:location.state.masterStatus,
								relationship:location.state.relationship,
							}
						})
						dispatch({
	            type:'findAllDetails',
	            payload:{
	              id:location.state.id,
	            }
	          })
					}else{
						dispatch({
							type:'initailSuccess',
							payload:{
								masterStatus:location.state.masterStatus,
								relationship:location.state.relationship,
							}
						})
						dispatch({
	            type:'findAllBrokerDetails',
	            payload:{
	              id:location.state.id,
	            }
	          })
					}
				}
			});
		},
	},
	effects: {
    *findAllDetails({ payload }, { call, put }){
      const {data,err}=yield call(showApplyDetail,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'initailSuccess',
          payload:{
            time:data.data.time,
            result:data.data.result,
            relationBrokerRole:data.data.relationBrokerRole,
            relationBrokerName:data.data.relationBrokerName,
            relationBrokerCityNames:data.data.relationBrokerCityNames,
            processTime:data.data.processTime,
            operationUserInfo:data.data.operationUserInfo,
            description:data.data.description,
            id:data.data.id,
            applyBrokerCityNames:data.data.applyBrokerCityNames,
            applyBrokerRole:data.data.applyBrokerRole,
            applyBrokerName:data.data.applyBrokerName,
          }
        })
      }
    },
    *findAllBrokerDetails({ payload }, { call, put }){
      const {data,err}=yield call(showApplyBrokerDetail,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'initailSuccess',
          payload:{
            time:data.data.time,
            result:data.data.result,
            relationBrokerRole:data.data.relationBrokerRole,
            relationBrokerName:data.data.relationBrokerName,
            relationBrokerCityNames:data.data.relationBrokerCityNames,
            processTime:data.data.processTime,
            operationUserInfo:data.data.operationUserInfo,
            description:data.data.description,
            id:data.data.id,
            applyBrokerCityNames:data.data.applyBrokerCityNames,
            applyBrokerRole:data.data.applyBrokerRole,
            applyBrokerName:data.data.applyBrokerName,
          }
        })
      }
    },
		*operationApply({ payload }, { call, put }){
			const {data,err}=yield call(operationApplyFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('解除关系成功')
				yield put(routerRedux.goBack());
			}else{
				message.error(`出错${data.message}`)
			}
		},
		*operationApplyBroker({ payload }, { call, put }){
			const {data,err}=yield call(operationApplyBrokerFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('解除关系成功')
				yield put(routerRedux.goBack());
			}else{
				message.error(`出错${data.message}`)
			}
		},
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
