import {findBrokerCommunities,changStatus,findByCommunityAreaName,
	deleteCommuintyFetch,deleteShopFetch,deleteOfficeBuildingFetch,
	combineCommunity,combineShopFetch,combineOfficeBuildingFetch,
	findByShopAreaName,findByOffieceBuildingAreaName,
} from '../../services/contentCheck/brokerUploadCommunity';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'brokerUploadCommunity',
	state: {
    loading:false,
    type:'小区',
		translateData:[],//小区数组
		shopsData:[],//商铺数组
		officeData:[],//写字楼数组
		pageNo:0,//分页
		total:'',//总页数
		areaName:'',//地区名称
		delId:'',//被合并的id
		selectData:[],//选择小区的数组
		mergeStatus:false,
		name:'',//小区名称
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/brokerUploadCommunity') {
					dispatch({type:'initailFindAll'})
				}
			});
		},
	},
	effects: {
		*initailFindAll({ payload }, { call, put }){
			yield put({type:'initailSuccess',payload:{loading:true}});
			yield put({type:'findAll',payload:{type:'小区'}})
		},
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findBrokerCommunities,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
				const translateData=[];
				const shopsData=[];
				const officeData=[];
				if(payload.type=='小区'){
					data.data.list.map((item,index)=>(
	        	translateData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}else if(payload.type=='商铺'){
					data.data.list.map((item,index)=>(
	        	shopsData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}else{
					data.data.list.map((item,index)=>(
	        	officeData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}
        yield put ({type:'initailSuccess',
          payload:{
            loading:false,
						translateData:translateData,
						shopsData:shopsData,
						officeData:officeData,
						type:payload.type,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						mergeStatus:false,
						areaName:'',//地区名称
						delId:'',//被合并的id
						name:'',//小区名称
          }
        })
      }
    },
		//状态改变&分页
		*renderingTable({ payload }, { call, put ,select}){
			let pageNos=0;
			if(!!payload.pageNo){
				pageNos=payload.pageNo-1;
			}
			const  {data,err}  = yield call(findBrokerCommunities,{type:payload.type,pageNo:pageNos})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const translateData=[];
				const shopsData=[];
				const officeData=[];
				if(payload.type=='小区'){
					data.data.list.map((item,index)=>(
	        	translateData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}else if(payload.type=='商铺'){
					data.data.list.map((item,index)=>(
	        	shopsData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}else{
					data.data.list.map((item,index)=>(
	        	officeData.push({
							number:index+1,
							key:item.id,
							areaName:item.areaName,
							inRent:item.inRent,
							name:item.name,
							status:item.status,
							numberOfBuilding:item.numberOfBuilding,
							onsell:item.onsell,
							totalHouseholds:item.totalHouseholds,
							updateTime:item.updateTime,
						})
	        ))
				}
        yield put ({type:'initailSuccess',
          payload:{
            loading:false,
						translateData:translateData,
						shopsData:shopsData,
						officeData:officeData,
						type:payload.type,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
          }
        })
      }
		},
		//发布 小区&商铺&写字楼
		*communitiesRrelease({ payload }, { call, put ,select}){
			const type=yield select(({brokerUploadCommunity})=>brokerUploadCommunity.type)
			const  {data,err}  = yield call(changStatus,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{type:type}})
				message.success('发布成功')
			}else{
				message.error(`${data.message}`)
			}
		},
		//删除小区
		*deleteCommunity({ payload }, { call, put }){
			const  {data,err}  = yield call(deleteCommuintyFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{type:'小区'}})
				message.success('删除成功')
			}else{
				message.error(`${data.message}`)
			}
		},
		//删除商铺
		*deleteShop({ payload }, { call, put }){
			const  {data,err}  = yield call(deleteShopFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{type:'商铺'}})
				message.success('删除成功')
			}else{
				message.error(`${data.message}`)
			}
		},
		//删除写字楼
		*deleteBuilding({ payload }, { call, put }){
			const  {data,err}  = yield call(deleteOfficeBuildingFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{type:'写字楼'}})
				message.success('删除成功')
			}else{
				message.error(`${data.message}`)
			}
		},
		*choseMerge({ payload }, { call, put }){
			const  {data,err}  = yield call(findByCommunityAreaName,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({
					type:'initailSuccess',
					payload:{
						selectData:data.data,
						mergeStatus:true,
						delId:payload.delId,
						areaName:payload.areaName,
						name:payload.name,
					}
				})
			}
		},
		*choseMergeShop({ payload }, { call, put }){
			const  {data,err}  = yield call(findByShopAreaName,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({
					type:'initailSuccess',
					payload:{
						selectData:data.data,
						mergeStatus:true,
						delId:payload.delId,
						areaName:payload.areaName,
						name:payload.name,
					}
				})
			}
		},
		*choseMergeOffice({ payload }, { call, put }){
			const  {data,err}  = yield call(findByOffieceBuildingAreaName,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({
					type:'initailSuccess',
					payload:{
						selectData:data.data,
						mergeStatus:true,
						delId:payload.delId,
						areaName:payload.areaName,
						name:payload.name,
					}
				})
			}
		},

		*mergeOk({ payload }, { call, put }){
			const {data,err} = yield call(combineCommunity,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('合并成功')
				yield put({type:'findAll',payload:{type:'小区'}})
			}else {
				message.error(`${data.message}`)
				yield put({type:'initailSuccess',
					payload:{
						mergeStatus:false,
						loading:false,
						areaName:'',
						name:'',
					}
				})
			}
		},
		*combineShop({ payload }, { call, put }){
			const {data,err} = yield call(combineShopFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('合并成功')
				yield put({type:'findAll',payload:{type:'商铺'}})
			}else {
				message.error(`${data.message}`)
				yield put({type:'initailSuccess',
					payload:{
						mergeStatus:false,
						loading:false,
						areaName:'',
						name:'',
					}
				})
			}
		},
		*combineOfficeBuilding({ payload }, { call, put }){
			const {data,err} = yield call(combineOfficeBuildingFetch,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('合并成功')
				yield put({type:'findAll',payload:{type:'写字楼'}})
			}else {
				message.error(`${data.message}`)
				yield put({type:'initailSuccess',
					payload:{
						mergeStatus:false,
						loading:false,
						areaName:'',
						name:'',
					}
				})
			}
		},

	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
