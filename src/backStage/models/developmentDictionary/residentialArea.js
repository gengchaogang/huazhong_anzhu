import {initialization,changStatus,deleteCommuinty,findAllProvincesFetch
} from '../../services/developmentDictionary/residentialArea';
import { message} from 'antd';
import { parse } from 'qs';
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
	namespace: 'residentialArea',
	state: {
    publishedDataSource:[],
		shelfedDataSource:[],
		unpublishedDataSource:[],
		pageNo:0,
		total:'',
		name:'',
		status:'已发布',//发布状态
		id:'',//楼盘唯一编码,
		loading:true,
		optionsCity:[],
		areaName:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea') {
          dispatch({type:'initialFindAll'})
          // dispatch({type:'findAllProvinces'})
					// dispatch({
          //   type: 'initial',
					// 	payload:{
					// 		pageNo:0,
					// 		status:'已发布',
					// 	}
          // });
				}
			});
		},
	},
	effects: {
    *initialFindAll({ payload }, { call, put }){
      yield put({
        type:'findAllProvinces',
      });
      yield put({
        type:'initial',
        payload:{
          pageNo:0,
          status:'已发布',
          name:'',
          areaName:'/河北省/保定市',
        }
      })
    },
		*findAllProvinces({ payload }, { call, put }){
			const  {data,err}  = yield call(findAllProvincesFetch);
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
      const  {data,err}  = yield call(initialization,{...payload});
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
							xiaoQuName:item.name,
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
						loading:false,
						publishedDataSource:publishedDataSources,
            name:payload.name,
            areaName:payload.areaName,
          },
        });
      }
    },
		*pageNoChange({ payload }, { call, put, select}){
			payload.pageNo=payload.pageNo-1;
			const status= yield select(({residentialArea})=>residentialArea.status)
			const  {data,err}  = yield call(initialization, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data){
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
						loading:false,
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
          },
        });
      }
		},
		*statusOnchange({ payload }, { call, put,select }){
			// const name= yield select(({residentialArea})=>residentialArea.name);
			// console.log(name,'keyword');
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
						loading:false,
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
						loading:false,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
								xiaoQuName:item.name,
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
            publishedDataSource:publishedDataSources,
						shelfedDataSource:shelfedDataSources,
						unpublishedDataSource:unpublishedDataSources,
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
				const status=yield select(({residentialArea})=>residentialArea.status);
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
								xiaoQuName:item.name,
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
						publishedDataSource:publishedDataSource,
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
		*shangJiaOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(changStatus, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({residentialArea})=>residentialArea.status);
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
								xiaoQuName:item.name,
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
						shelfedDataSource:shelfedDataSource,
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
			}
		},
		*fabuOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(changStatus, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({residentialArea})=>residentialArea.status);
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
								xiaoQuName:item.name,
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
				message.error('小区信息尚未完善无法发布');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
		*xiaoQudelete({ payload }, { call, put,select }){
			const  {data,err}  = yield call(deleteCommuinty, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const status=yield select(({residentialArea})=>residentialArea.status);
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
									xiaoQuName:item.name,
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
									xiaoQuName:item.name,
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
				message.error('小区中有在售/出租房源，无法删除');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
			}
		},
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},

	},
}
