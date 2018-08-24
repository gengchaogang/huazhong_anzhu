import request from '../../../commons/utils/request';
import baseApi from '../baseApi';

export async function findAllAreasOpen(params){
	return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findCitiesFetch(params){
	return baseApi('/miss-anzhu-operation/service-regions/findCities',params);
}
export async function findFullPathByBePartOf(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/findFullPathByBePartOf',params);
}
export async function findOpeartor(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/findOpeartor',params);
}
export async function add(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/add',params);
}
export async function findOneFecth(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/findOne',params);
}
export async function edit(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/edit',params);
}
