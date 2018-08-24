import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';

function delay(p, s=3000){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}


export async function query(params){
    return baseApi('/miss-anzhu-customer/customers/findAll',params);
}