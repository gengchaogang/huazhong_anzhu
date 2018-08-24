import request from '../../../../commons/utils/request';
//上传首付款合同
export async function uploadDownPaymentAgreementFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/uploadContracts', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
