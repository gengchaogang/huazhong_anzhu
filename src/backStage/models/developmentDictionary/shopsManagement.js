import {initialization,changStatus,deleteShop,findAllProvincesFetch} from '../../services/developmentDictionary/shopsManagement';
import { parse } from 'qs';
import { message} from 'antd';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value:lable, label:lable}, children;
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
	namespace: 'shopsManagement',
	state: {
    publishedDataSource:[],
		shelfedDataSource:[],
		unpublishedDataSource:[],
		pageNo:0,
		total:'',
		keyword:'',//关键字查询
		status:'已发布',
		id:'',//商铺的id
		loading: true,//当前table的加载状态
		optionsCity:[],
		areaName:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/shopsManagement') {
					// dispatch({type:'findAllProvinces'})
					// dispatch({
          //   type: 'initial',
					// 	payload:{
					// 		pageNo:0,
					// 		status:'已发布',
					// 	}
          // });
          dispatch({type:'initialFindAll'})
				}
			});
		},
	},
	effects: {
    *initialFindAll({ payload }, { call, put }){
      yield put({type:'findAllProvinces'})
      yield put({
        type: 'initial',
        payload:{
          pageNo:0,
          status:'已发布',
          name:'',
          areaName:'/河北省/保定市',
        }
      });
    },
		*findAllProvinces({ payload }, { call, put }){
			const  {data,err}  = yield call(findAllProvincesFetch, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({
					type:'initialSuccess',
					payload:{optionsCity:_toCascaderOptions(data.data)}
				})
			}else{
				message.error(data.message)
			}
		},
    *initial({ payload }, { call, put }){
      const  {data,err}  = yield call(initialization, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const publishedDataSources=[];
				data.data.list.map((item,index)=>{
					publishedDataSources.push(
						{
							key:item.id,
							number:index+1,
							area:item.areaName,
							shangPuName:item.name,
							loudong:item.totalOfBuilding,
							allHuShu:item.totalHouseholds,
							selling:item.onsell,
							renting:item.inRent,
							updateTime:item.updateTime,
              different:item.different,
						}
					)
				})
        yield put ({
          type: 'initialSuccess',
          payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						publishedDataSource:publishedDataSources,
            keyword:payload.name,
            areaName:payload.areaName,
						loading:false,
          },
        });
      }
    },
		*formSearch({ payload }, { call, put,select }){
			const  {data,err}  = yield call(initialization, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const publishedDataSources=[];
				const shelfedDataSources=[];
				const unpublishedDataSources=[];
				if(payload.status=='已发布'){
					data.data.list.map((item,index)=>{
						publishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else if(payload.status=='已下架'){
					data.data.list.map((item,index)=>{
						shelfedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else{
					data.data.list.map((item,index)=>{
						unpublishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
        yield put ({
          type: 'initialSuccess',
          payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						keyword:payload.name,
						loading:false,
						areaName:payload.areaName,
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
          },
        });
      }
		},
		*resetField({ payload }, { call, put,select }){
			const  {data,err}  = yield call(initialization, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const publishedDataSources=[];
				const shelfedDataSources=[];
				const unpublishedDataSources=[];
				if(payload.status=='已发布'){
					data.data.list.map((item,index)=>{
						publishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else if(payload.status=='已下架'){
					data.data.list.map((item,index)=>{
						shelfedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else{
					data.data.list.map((item,index)=>{
						unpublishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
        yield put ({
          type: 'initialSuccess',
          payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						keyword:payload.name,
						loading:false,
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
          },
        });
      }
		},
		*statusOnchange({ payload }, { call, put,select }){
			const  {data,err}  = yield call(initialization, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			// console.log(payload,'payload');
			if(data){
				const publishedDataSources=[];
				const shelfedDataSources=[];
				const unpublishedDataSources=[];
				if(payload.status=='已发布'){
					data.data.list.map((item,index)=>{
						publishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else if(payload.status=='已下架'){
					data.data.list.map((item,index)=>{
						shelfedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else{
					data.data.list.map((item,index)=>{
						unpublishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
        yield put ({
          type: 'initialSuccess',
          payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						name:payload.name,
						areaName:payload.areaName,
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
						loading:false,
          },
        });
      }
		},
		*pageNoChange({ payload }, { call, put, select}){
			payload.pageNo=payload.pageNo-1;
			const status= yield select(({shopsManagement})=>shopsManagement.status);
			// console.log(status,'statusstatusstatus');
			const  {data,err}  = yield call(initialization, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const publishedDataSources=[];
				const shelfedDataSources=[];
				const unpublishedDataSources=[];
				if(status=='已发布'){
					data.data.list.map((item,index)=>{
						publishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else if(status=='已下架'){
					data.data.list.map((item,index)=>{
						shelfedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}else{
					data.data.list.map((item,index)=>{
						unpublishedDataSources.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
				yield put ({
					type: 'initialSuccess',
					payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
						loading:false,
					},
				});
			}
		},
		*xiaJiaOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(changStatus, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({shopsManagement})=>shopsManagement.status);
				payload.status=status;
				const  {data}  = yield call(initialization, parse(payload));
				const publishedDataSource=[];
				if(data){
					data.data.list.map((item,index)=>{
						publishedDataSource.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
				yield put ({
					type: 'initialSuccess',
					payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						name:payload.name,
						publishedDataSource:publishedDataSource,
						loading:false,
					},
				});
			}else{
				message.error('下架失败');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
		*shopsShangJiaOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(changStatus, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({shopsManagement})=>shopsManagement.status);
				payload.status=status;
				const  {data}  = yield call(initialization, parse(payload));
				const shelfedDataSource=[];
				if(data){
					data.data.list.map((item,index)=>{
						shelfedDataSource.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
				yield put ({
					type: 'initialSuccess',
					payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						name:payload.name,
						shelfedDataSource:shelfedDataSource,
						loading:false,
					},
				});
			}else{
				message.error('上架失败');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
		*shopsFubuJiaOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(changStatus, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({shopsManagement})=>shopsManagement.status);
				payload.status=status;
				const  {data}  = yield call(initialization, parse(payload));
				const unpublishedDataSource=[];
				if(data){
					data.data.list.map((item,index)=>{
						unpublishedDataSource.push(
							{
								key:item.id,
								number:index+1,
								area:item.areaName,
								shangPuName:item.name,
								loudong:item.totalOfBuilding,
								allHuShu:item.totalHouseholds,
								selling:item.onsell,
								renting:item.inRent,
								updateTime:item.updateTime,
                different:item.different,
							}
						)
					})
				}
				yield put ({
					type: 'initialSuccess',
					payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						name:payload.name,
						loading:false,
						unpublishedDataSource:unpublishedDataSource,
					},
				});
			}else{
				message.error('商铺信息尚未完善无法发布');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
		*shopsDeleteOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(deleteShop, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			// console.log(data,'datadatadata');
			if(data.status=='success'){
				const status=yield select(({shopsManagement})=>shopsManagement.status);
				payload.status=status;
				const  {data}  = yield call(initialization, parse(payload));
				const shelfedDataSource=[];
				const unpublishedDataSource=[];
				if(data){
					data.data.list.map((item,index)=>{
						if(status=='已下架'){
							shelfedDataSource.push(
								{
									key:item.id,
									number:index+1,
									area:item.areaName,
									shangPuName:item.name,
									loudong:item.totalOfBuilding,
									allHuShu:item.totalHouseholds,
									selling:item.onsell,
									renting:item.inRent,
									updateTime:item.updateTime,
                  different:item.different,
								}
							)
						}else{
							unpublishedDataSource.push(
								{
									key:item.id,
									number:index+1,
									area:item.areaName,
									shangPuName:item.name,
									loudong:item.totalOfBuilding,
									allHuShu:item.totalHouseholds,
									selling:item.onsell,
									renting:item.inRent,
									updateTime:item.updateTime,
                  different:item.different,
								}
							)
						}
					})
				}
				yield put ({
					type: 'initialSuccess',
					payload: {
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						status:payload.status,
						name:payload.name,
						loading:false,
						unpublishedDataSource:unpublishedDataSource,
						shelfedDataSource:shelfedDataSource,
					},
				});
			}else{
				message.error('商铺中有在售/出租房源，无法删除');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
		// loading(state,{payload}){
		// 	return { ...state, ...payload };
		// },
	},
}