import {query} from '../../../services/tradeManagement/newHouseTrade/dealDetails';
import {parse} from 'qs';
//已成交
const arrGroupOffersTable=[];
const groupOffersFunc=(obj)=>{
  arrGroupOffersTable.push({
    key:'001',
    pic:obj.pic,
    details:obj.details,
    number:obj.number,
    payAway:obj.payAway,
    paySerialNumber:obj.paySerialNumber,
    payCustomer:obj.payCustomer,
    customerPhone:obj.customerPhone,
    payTime:obj.payTime,
    payCash:obj.payCash,
    payStatus:obj.payStatus,
  })
  return arrGroupOffersTable
}
export default {
  namespace: 'dealDetails',
  state: {
    intentionProject:'',
    customerInformation:[],
    intentionHousingResources:[],
    filingBroker:[],
    bbjjrImg:'',
    houseRecord:[],
    electricityPreferential:[],
    buyLockIntentionListings:[],
    transactionListings:[],
    transactionCommission:[],
    electricityReceipt:[],
    yjfpmx:[],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/tradeManagement/newHouseTrade/dealDetails') {
          if(1==1){
           //已经确定了项目,获取之前的数据
            dispatch({
              type:'query',
              payload:'iD1',
            });
          }else{
            alert('未获取到之前的数据')
          }
        }
      });
    },
  },
  effects:{
    *query({ payload }, { call, put }){
      const  data  = yield call(query, parse(payload));
      const khxx=[
        {
          label:'姓名',
          value:data.customerInformation.name,
        },
        {
          label:'性别',
          value:data.customerInformation.gender,
        },
        {
          label:'身份证号',
          value:data.customerInformation.idCard,
        },
        {
          label:'联系电话',
          value:data.customerInformation.phoneNumber,
        }
      ];
      const yxfy=[
        {
          pic:data.intentionHousingResources.img,
          key:'001',
          details:data.intentionHousingResources.mainWord+' 均价：'+data.intentionHousingResources.junJia+
          ' 总价：'+data.intentionHousingResources.price,
        }
      ];
      const bbjjr=[
        {
          label:'姓名',
          value:data.filingBroker.brokerName,
        },
        {
          label:'性别',
          value:data.filingBroker.brokerGender,
        },
        {
          label:'联系电话',
          value:data.filingBroker.brokerPhoneNmuber,
        },
      ];
      const bbjjrImg=data.filingBroker.brokerimg;
      const kfjl=[];
      data.houseRecord.map((value,index)=>(
        kfjl.push({
          label:value.timeStamp,
          value:value.content,
        })
      ))
      const tgsdyxfy=[
        {
          pic:data.buyLockIntentionListings.img,
          key:'001',
          details:data.buyLockIntentionListings.mainWord+' 均价：'+data.buyLockIntentionListings.junjia+
          ' 总价：'+data.buyLockIntentionListings.price,
        }
      ];
      const chenjiaofangyuan=[
        {
          label:'实际成交单价',
          value:data.transactionListings.factPrice,
        },
        {
          label:'实际成交总价',
          value:data.transactionListings.factTotal,
        },
        {
          label:'支付方式',
          value:data.transactionListings.payAway,
        },
      ];
      const yjfpmxs=[
        {
          label:'佣金总额',
          value:data.yjfpmx.yjTotal,
        },
        {
          label:'平台交易抽佣',
          value:data.yjfpmx.jyptcy,
        },
        {
          label:'实付佣金',
          value:data.yjfpmx.sfyj,
        },
        {
          label:'银行账号',
          value:data.yjfpmx.bankIdNumber,
        },
      ];
      const transac=[
        {
          label:'团购佣金总额',
          value:data.transactionCommission.allCash,
        },
        {
          label:'平台抽佣',
          value:data.transactionCommission.ptfy,
        },
        {
          label:'实际佣金金额',
          value:data.transactionCommission.cash,
        },
      ]
      if(data){
        yield put ({
          type: 'querySuccess',
          payload: {
            intentionProject:data.intentionProject,
            customerInformation:khxx,
            intentionHousingResources:yxfy,
            filingBroker:bbjjr,
            bbjjrImg:bbjjrImg,
            houseRecord:kfjl,
            electricityPreferential:groupOffersFunc(data.electricityPreferential),
            buyLockIntentionListings:tgsdyxfy,
            transactionListings:chenjiaofangyuan,
            transactionCommission:transac,
            electricityReceipt:data.electricityReceipt,
            yjfpmx:yjfpmxs,
          },
        });
      }
    },
  },
  reducers: {
    querySuccess(state,action){
      return { ...state, ...action.payload };
    },
  },
}
