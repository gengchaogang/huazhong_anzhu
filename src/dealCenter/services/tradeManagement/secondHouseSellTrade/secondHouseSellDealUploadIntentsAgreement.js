import request from '../../../../commons/utils/request';
//上传意向金合同
export async function uploadIntentsAgreementFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/uploadContracts', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
