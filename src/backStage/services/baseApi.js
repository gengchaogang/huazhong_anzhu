import request from '../../commons/utils/request';

export default async function base(uri, params, isPage){
  let p;
  if(isPage){
    p = {
      pageNo:1,
      pageSize:10,
			...params
    };
  }else {
    p = params;
  }
	return request(uri,{
    headers:{
      'content-type':'application/json'
      // 'content-type':'application/x-www-form-urlencoded'
    },
    method:'post',
    body:JSON.stringify(p)
  });
}
