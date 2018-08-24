import request from '../../commons/utils/request';


export async function findAllAreas(){
  return request('miss-anzhu-operation/service-regions/findAllAreas',{
    headers:{
      'content-type':'application/json'
      // 'content-type':'application/x-www-form-urlencoded'
    },
    method:'post'
  });
}

export function toCitiesCascaderOptions(datas, codeAsValue){
	const cityDatas = datas || [];
  codeAsValue = !!codeAsValue;
	return cityDatas.map(function(data){
		let option = {value: codeAsValue?data.code:data.name, label: data.name, code: data.code};
		let children = data.citys;
		if(children && children.length){
      data.children = children;
			option.children = children.map(function(data){
				let option = {value: codeAsValue?data.code:data.name, label: data.name, code: data.code};
				let children = data.areas;
				if(children && children.length){
          data.children = children;
					option.children = children.map(function(data){
						let option = {value: codeAsValue?data.code:data.name, label: data.name, code: data.code};
						// let children = data.areas;
						// if(children && children.length){
						//   option.children = children.map(function(data){
						//
						//   });
						// }
						return option;
					});
				}
				return option;
			});
		}
		return option;
	});
}
