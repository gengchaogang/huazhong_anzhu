import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function query(params) {
  return {
    groupKeyData:{
      intentionProject:'远洋山水',
      customerInformation:{
        name:'林千八',
        gender:'男',
        phoneNumber:135469814,
        idCard:13456486564684654165465,
      },
      intentionHousingResources:{
        img:'data:image/jpeg;base64,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',
        mainWord:'A区域/7号楼/1单元/701室/三室一厅/100㎡',
        junjia:'1000元/㎡',
        total:'200万/套',
      },
      electricityPreferential:{
        pic:'1万抵十万',
        details:'100㎡-200㎡',
        number:332005469041,
        payAway:'POS机支付/工商银行',
        paySerialNumber:65535,
        payCustomer:'张三',
        customerPhone:'15120050558',
        payTime:'2016-10-24 19:00',
        payCash:'10000元',
        payStatus:'已支付',
      },
      filingBroker:{
        brokerimg:'data:image/jpeg;base64,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',
        brokerName:'胖子',
        brokerGender:'男',
        brokerPhoneNmuber:'15618546115',
      },
      buyLockIntentionListings:{
        img:'data:image/jpeg;base64,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',
        mainWord:'A区域/7号楼/1单元/701室/三室一厅/100㎡',
        junjia:'1000元/㎡',
        price:'200万/套',
        dayRemaining:'5天15小时',
      },
      houseRecord:[
        {
          timeStamp:'10-24 19:00',
          content:'客户来源：由林枫添加。',
        },{
          timeStamp:'10-24 20:00',
          content:'客户报备：由林枫报备客户。',
        },{
          timeStamp:'10-24 22:00',
          content:'房源确看：由驻场人员 李四 确看。  确看备注：一二三四五六七八九十。',
        },{
          timeStamp:'10-24 23:00',
          content:'房源确看：由驻场人员 李四 确看。  确看备注：一二三四五六七八九十。',
        }
      ],

    }
  }
}