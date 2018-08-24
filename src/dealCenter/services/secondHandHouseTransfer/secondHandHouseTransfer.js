import request from '../../commons/utils/request';
import qs from 'qs';

export async function query(params) {
  return {
    secondHandHouseTransferTable:[
      {
        residentialArea:'远洋山水',
        propertyType:'住宅',
        loanAvailability:'A区域/1号楼/1单元/7层/7002室',
        housingPrice:'200万元',
        ownerName:'张三',
        ownerContactPhone:'15120050558',
        nameHomeBuyers:'林枫',
        customerContactPhone:'15120050558',
        transferApplication:'2015-10-24 19：00',
        transferStatus:'待受理',
      },
      {
        residentialArea:'远洋山水',
        propertyType:'住宅',
        loanAvailability:'A区域/1号楼/1单元/7层/7002室',
        housingPrice:'200万元',
        ownerName:'张三',
        ownerContactPhone:'15120050558',
        nameHomeBuyers:'林枫',
        customerContactPhone:'15120050558',
        transferApplication:'2015-10-24 19：00',
        transferStatus:'已受理',
      },
    ]
  }
}
