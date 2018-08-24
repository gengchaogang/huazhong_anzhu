import {findAllCommission,findOneFetch,editProgrammeFetch,deleteBrokerage,addProgrammeFetch} from '../../services/earningSetting/brokerageMatching';
import { parse } from 'qs';
import { message} from 'antd';

export default {
	namespace: 'brokerageMatching',
	state: {
		brokerageVisible:false,
		brokerageBrokerRatio:0,
		brokeragePlatformRatio:0,
		brokerageProvinceAgentRatio:0,
		brokerageCityAgentRatio:0,
		brokerageAreaAgentRatio:0,
		brokerageDealCenterRatio:0,
		brokerageAdvisorJolesRatio:0,
		brokerageTotalWarning:false,
		loading:true,
		dataSource:[],
		keyWord:'',
		name:'',
		programmeModalStatus:false,
		total:'',
		pageNo:'',
		id:'',
		eidtStatus:false,//是否为编辑状态
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/earningSetting/brokerageMatching'){
          dispatch({
            type:'findCommission',
          })
        }
			});
		},
	},
	effects: {
		//初始化请求表格数据
    *findCommission({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllCommission,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.commissions.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						broker:item.broker+'%',
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
						master:item.master+'%',
					})
				))
				yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
						keyWord:'',
						id:'',
						name:'',
						eidtStatus:'',
						programmeModalStatus:false,
						brokerageBrokerRatio:0,
						brokeragePlatformRatio:0,
						brokerageProvinceAgentRatio:0,
						brokerageCityAgentRatio:0,
						brokerageAreaAgentRatio:0,
						brokerageDealCenterRatio:0,
						brokerageAdvisorJolesRatio:0,
          }
        });
			}
    },
		//搜索
		*searchBrokerage({ payload }, { call, put }){
			const {data,err} = yield call(findAllCommission,{pageNo:payload.pageNo-1,name:payload.name});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.commissions.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						broker:item.broker+'%',
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
						master:item.master+'%',
					})
				))
				yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
						keyWord:payload.name,
          }
        });
			}
		},
		//添加
		*addProgramme({ payload }, { call, put }){
			const {data,err} = yield call(addProgrammeFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findCommission'})
			}else{
				message.error(`${data.message}`);
			}
		},
		*editProgramme({ payload }, { call, put }){
			const {data,err} = yield call(editProgrammeFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findCommission'})
			}else{
				message.error(`${data.message}`);
			}
		},
		//删除
		*deletAllocation({ payload }, { call, put }){
      const {data,err} = yield call(deleteBrokerage,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findCommission',
        });
        message.success('删除成功')
      }else{
        message.error(`${data.message}`);
				yield put({
					type:'initail',
					payload:{loading:false}
				})
      }
    },
		*editBeforeSaerch({ payload }, { call, put }){
			const {data,err} = yield call(findOneFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			yield put({
				type:'initail',
				payload:{
					name:data.data.name,
					id:data.data.id,
					brokerageBrokerRatio:data.data.broker,
					brokerageCityAgentRatio:data.data.cityAgency,
					brokerageAreaAgentRatio:data.data.countyAgency,
					brokerageAdvisorJolesRatio:data.data.master,
					brokeragePlatformRatio:data.data.platform,
					brokerageProvinceAgentRatio:data.data.provinceAgency,
					brokerageDealCenterRatio:data.data.tradingCenter,
				}
			})
		},
		//分页
    *pageOnchange({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllCommission,{pageNo:payload.pageNo-1,name:payload.name});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.commissions.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						broker:item.broker+'%',
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
						master:item.master+'%',
					})
				))
				yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
          }
        });
			}
    },

	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
