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
  introduction:'',
  timeToOnline:'',//项目上线时间
  markers:[], //项目详细经纬度
  openingTime:'',//开盘时间
  deliverTime:'',//交房时间
  current:0
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
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location => {
           if (location.pathname === '/newHouseOnline/projectManagement/createPro/NavBar') {
             dispatch({
               type: 'changeValue',
               payload: {
                 current:0,
               }
             });
           };
         });
       },
  }

}
