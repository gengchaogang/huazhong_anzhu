import request from '../utils/request';

export default async function base(uri, params, isPage){
  let p;
  if(isPage){
    p = {
      pageNo:0,
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



export async function delay(p, s=1000){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}
export const delayThenMs = (ms=1000)=>r=>new Promise(d=>setTimeout(()=>d(r),ms));
export const delayThen = delayThenMs();
