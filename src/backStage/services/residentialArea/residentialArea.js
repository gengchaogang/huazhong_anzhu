import request from '../../../commons/utils/request';

// import qs from 'qs';
//查询所有城市
export async function findAllCities(){
  return request('miss-anzhu-operation/service-regions/findAllAreas',{
    headers:{
      'content-type':'application/json'
      // 'content-type':'application/x-www-form-urlencoded'
    },
    method:'post'
  });
}

export async function query(params) {
    if(params && params.state){
      params.status = params.state;
    }
		return request('/miss-anzhu-community/communities/findCommunity',{
			headers:{
				'content-type':'application/json'
				// 'content-type':'application/x-www-form-urlencoded'
			},
			method:'post',
			body:JSON.stringify({
				pageNo:0,
				pageSize:15,
				...params,
			})
		});
}
//关闭城市
export async function closeCity(params) {
		return request('/miss-anzhu-operation/service-regions/close',{
			headers:{
				'content-type':'application/json;charset=UTF-8'
				// 'content-type':'application/x-www-form-urlencoded'
			},
			method:'post',
			body:JSON.stringify({
				...params,
			})
		});
}

//添加城市
export async function addCity(params) {
	return request('/miss-anzhu-operation/service-regions/add',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});

}
//查询区域/区划
export async function queryZones(params) {
	return request('/miss-anzhu-operation/service-regions/findZone',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}

//添加区域/区划
export async function addZone(params) {
	return request('/miss-anzhu-operation/service-regions/addZone',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}
//开通城市
export async function openCity(params) {
	return request(' /miss-anzhu-operation/service-regions/open',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}
//查询当前城市已存在区域
export async function queryExistsArea(params) {
	return request('/miss-anzhu-operation/service-regions/findArea',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}
//调整片区顺序
export async function switchZone(params) {
	return request('/miss-anzhu-operation/service-regions/switchZone',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}
//编辑片区
export async function editZone(params) {
	return request(' /miss-anzhu-operation/service-regions/editZone',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify({
			...params,
		}),
	});
}
