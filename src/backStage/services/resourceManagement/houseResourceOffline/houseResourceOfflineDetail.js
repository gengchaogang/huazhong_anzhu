import request from '../../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../../baseApi';

export async function findOneProject(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/findOne',params);
}
export async function findAllNewHouseImg(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/album/findAll',params);
}
export async function findAllNewHouseMangement(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/housetypes/findAll',params);
}
export async function findAllNewHouseSellControlTable(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/houses/findAll',params);
}
export async function findAllNewHouseDiscount(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/discounts/findAll',params);
}
export async function findAllNewHouseCertificates(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/certificates/findAll',params);
}
