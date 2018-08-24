import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';

export async function query(params){
  return baseApi('/miss-anzhu-broker/brokers/findOne',params);
}

export async function tryFreeze(params){
  return baseApi('/miss-anzhu-broker/brokers/freeze',params);
}
export async function tryUnFreeze(params){
  return baseApi('/miss-anzhu-broker/brokers/unFreeze',params);
}

export async function query1(params){
  return {
    zhangHao:151000000,
    status:'正常',
    zhuCeTime:'2016-12-12 12：12：12',
    lastTimeLogin:'2016-12-12 12：12：12',
    loginIP:'202.106.0.20 北京  海淀',
    jinJiRenName:'王小明',
    jinJiRenAera:'北京市-海淀区',
    jinJiRenImg:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1419557827,2529008583&fm=21&gp=0.jpg',
    trueRenZhenTime:'xxxxx',
    trueName:'xxxxxxxxx',
    iDCard:'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    defaultStateName:'',
    defaultStateIdCard:'',
    zhiYeRenZhengTime:'xxxxx',
    zhiYeRenZhengZhenShuNumber:'xxxxx',
    dongJieTime:'xxxxxx',
    dongJieTimeLong:1,
    dongJieReason:'xxxxxxxxx',
    operationPerson:'王小明',
    iDCardImg:[
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2483348597,1831098538&fm=21&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2483348597,1831098538&fm=21&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2483348597,1831098538&fm=21&gp=0.jpg',
    ],
    zhiYeJinJiRenZhenShuImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3820208077,2687534536&fm=21&gp=0.jpg',
    realNameCertifiedState:'已认证',
    certificationRofessionalState:'已认证',
  }
}
