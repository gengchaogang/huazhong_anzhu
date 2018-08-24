import {findAllService,addService,findOneService,editService,deleteService,} from '../../services/earningSetting/serviceMatching';
import { parse } from 'qs';
import { message} from 'antd';
export default {
	namespace: 'serviceMatching',
	state: {
		brokerageVisible:false,
    countyAgency:0,
    cityAgency:0,
    tradingCenter:0,
    provinceAgency:0,
    platform:0,
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
				if (location.pathname === '/earningSetting/serviceMatching'){
          dispatch({
            type:'findAllintail',
          })
        }
			});
		},
	},
	effects: {
		//初始化请求表格数据
    *findAllintail({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.tradingServiceCharges.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
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
            countyAgency:0,
            cityAgency:0,
            tradingCenter:0,
            provinceAgency:0,
            platform:0,
          }
        });
			}
    },
		//搜索
		*searchService({ payload }, { call, put }){
			const {data,err} = yield call(findAllService,{pageNo:payload.pageNo-1,name:payload.name});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.tradingServiceCharges.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
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
			const {data,err} = yield call(addService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAllintail'})
			}else{
				message.error(`${data.message}`);
			}
		},
    //编辑
		*editProgramme({ payload }, { call, put }){
			const {data,err} = yield call(editService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAllintail'})
			}else{
				message.error(`${data.message}`);
			}
		},
		//删除
		*deletAllocation({ payload }, { call, put }){
      const {data,err} = yield call(deleteService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAllintail',
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
			const {data,err} = yield call(findOneService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			yield put({
				type:'initail',
				payload:{
					name:data.data.name,
					id:data.data.id,
          countyAgency:data.data.countyAgency,
          cityAgency:data.data.cityAgency,
          tradingCenter:data.data.tradingCenter,
          provinceAgency:data.data.provinceAgency,
          platform:data.data.platform,
				}
			})
		},
		// //分页
    *pageOnchange({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllService,{pageNo:payload.pageNo-1,name:payload.name});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const dataSource=[];
				data.data.tradingServiceCharges.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						name:item.name,
						platform:item.platform+'%',
						provinceAgency:item.provinceAgency+'%',
						cityAgency:item.cityAgency+'%',
						countyAgency:item.countyAgency+'%',
						tradingCenter:item.tradingCenter+'%',
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
