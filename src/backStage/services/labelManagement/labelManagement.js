import request from '../../../commons/utils/request';
// import qs from 'qs';
//            /mock/1
export async function queryCategory(params) {
	console.log('in async,params:',params);
	return request('/miss-anzhu-operation/labels/types/findAll',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
			// 'content-type':'application/x-www-form-urlencoded'
		},
		method:'post',
		body:JSON.stringify({
			...params,
			pageNo:1,
			pageSize:15,
		})
	});
}
export async function addNewLabelFetch(params) {
	return request('/miss-anzhu-operation/labels/types/add',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function leiBiefindOne(params) {
	return request('/miss-anzhu-operation/labels/types/findOne',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function leiBieedit(params) {
	return request('/miss-anzhu-operation/labels/types/edit',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//添加标签类别获取所有省市
export async function getAreaCodeFun(params) {
	return request('/miss-anzhu-operation/service-regions/findCities',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//编辑标签时获取标签的内容
export async function findOne(params) {
	return request('/miss-anzhu-operation/labels/findOne',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//编辑标签
export async function editTag(params) {
	return request('/miss-anzhu-operation/labels/edit',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//停用/启用
export async function changeStatus(params) {
	return request('/miss-anzhu-operation/labels/types/changeStatus',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//搜索标签类别
export async function searchLabelfindAll(params) {
	return request('/miss-anzhu-operation/labels/types/findAll',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//标签类别简要信息
export async function findAllBrief(params) {
	return request('/miss-anzhu-operation/labels/types/findAllBrief',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//搜索标签内容
export async function searchLabelContent(params) {
	return request('/miss-anzhu-operation/labels/findAll',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}

//标签类型列表数据
export async function getLabelTypeDataFetch(params) {
	return request('/miss-anzhu-operation/labels/types/findAll',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
//标签列表数据
export async function getLabelListDataFetch(params) {
	return request('/miss-anzhu-operation/labels/findAll',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function editLabelTypeFetch(params) {
	return request('/miss-anzhu-operation/labels/types/edit',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function editLabelFetch(params) {
	return request('/miss-anzhu-operation/labels/edit',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function deleteLabelTypeFetch(params) {
	return request('/miss-anzhu-operation/labels/types/delete',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function deleteLabelFetch(params) {
	return request('/miss-anzhu-operation/labels/delete',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function addLabelFetch(params) {
	return request('/miss-anzhu-operation/labels/add',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
