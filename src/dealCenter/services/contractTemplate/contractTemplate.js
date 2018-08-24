import request from '../../../commons/utils/request';
import qs from 'qs';

export async function getInitContractDataFetch(params){
    return request('/miss-anzhu-contract-agreement/contract/findByCentre',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
