import request from '../../commons/utils/request';

const toCode=({code})=>code;
const toName=({label})=>label;

function _toCascaderOptions(arr){
  var options = [];
  var map = {};
  arr.forEach(item=>{
    const {code,pCode,lable} = item;
    var option = {value: code, label: lable}, children;
    item.label = lable;
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

function _getNameArrByCode(arr, code){
  return _getItemArrByCode(arr, code).map(toName);
}

function _getCodeArrByCode(arr, code){
  return _getItemArrByCode(arr, code).map(toCode);
}

function _getItemArrByCode(arr, code){
  var itemArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      itemArr.push(item);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  itemArr.reverse();
  return itemArr;
}

function _getNamePathsByCode(arr, code){
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}

export async function findAllAreas(options){
  var toCascaderOptions;
  if(options){
    toCascaderOptions = options.toCascaderOptions;
  }
  var p = request('miss-anzhu-operation/service-regions/findAllAreas',{
    headers:{
      'content-type':'application/json'
      // 'content-type':'application/x-www-form-urlencoded'
    },
    method:'post'
  });
  if(toCascaderOptions){
    p = p.then(res=>{
      const {data, err} = res;
      if(data && data.status == "success"){
        data.options = _toCascaderOptions(data.data);
      }
      return res;
    });
  }
  return p;
}

export {_toCascaderOptions as toCascaderOptions, _getNamePathsByCode as getNamePathsByCode, _getNameArrByCode as getNameArrByCode};
export {_getItemArrByCode as getItemArrByCode, _getCodeArrByCode as getCodeArrByCode};
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
