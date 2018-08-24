import request from '../../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../../baseApi';

export async function findHouseInfoAll(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/findHouseInfoAll',params);
}
export async function findAllGuideFetch(params){
  return baseApi('/miss-anzhu-broker/appointment/operationPlatform/findAllGuide',params);
}
export async function getTrackByGroupKeyFetch(params){
  return baseApi('/miss-anzhu-tx-track/track/getTrackByGroupKey',params);
}
