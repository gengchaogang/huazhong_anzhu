import request from '../../../../commons/utils/request';
// import qs from 'qs';
export async function getTrackInfoFetch(params){
  return request('/miss-anzhu-tx-track/track/getTrackByGroupKey', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
