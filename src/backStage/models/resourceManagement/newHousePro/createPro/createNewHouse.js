import moment from 'moment';
const initialState={
  area:[],
  tradingCenter:'',
  programName:'',
  location:[],
  onlineTime:'',
  protectionPeriod:'',
  detailLocation:'',
  contactPerson:'',
  contactTel:'',

  openTradingTime:'',
  turnOverTime:'',
  houseTypes:[],
  developer:'',
  saleLocation:'',
  buildingArea:'',
  characteristic:[],
  equityYearLimit:'',
  fitmentType:['毛坯'],
  volumeFraction:'',
  greenPercentage:'',
  planedAmount:'',
  planedStall:'',
  estateManageCompany:'',
  estateManageCost:'',
  heatingWay:'',
  waterElectricityGasOwn:false,
  introduction:''

};

export default {
  namespace: 'createNewHouse',
  state:initialState,
  reducers: {
    changeValue(state,{payload}){
      return {
        ...state,
        ...payload,
      };
    }
  }

}
