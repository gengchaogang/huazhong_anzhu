import {
  getInitInfoFetch,
}from '../../services/accountManagement/commissionRecordDetails'

export default {
  namespace: 'commissionRecordDetails',
  state: {
    initData:{},
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
  },
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveInitData(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *getInitInfo({payload},{call,put}){
      const {data}=yield call(getInitInfoFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data;
        const initData={};
        initData.area=resultData.area;
        initData.bank=resultData.bank;
        initData.bankLogo=resultData.bankLogo;
        initData.comment=resultData.comment;
        initData.commissionTime=resultData.commissionTime;
        initData.commissionType=resultData.commissionType;
        initData.endNumber=resultData.endNumber;
        initData.house=resultData.house;
        initData.houseType=resultData.houseType;
        initData.knockdownTime=resultData.knockdownTime;
        initData.orderNumber=resultData.orderNumber;
        initData.prentice=resultData.prentice;
        initData.prenticeLoginName=resultData.prenticeLoginName;
        initData.saleWay=resultData.saleWay;
        initData.scale=resultData.scale;
        initData.serialNumber=resultData.serialNumber;
        initData.status=resultData.status;
        initData.totalAmt=resultData.totalAmt;
        initData.totalMoney=resultData.totalMoney;
        yield put({
          type:"saveInitData",
          payload:{
            initData:initData
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/commissionRecord/commissionRecordDetails') {
          //获取初始化信息
          dispatch({
            type:"getInitInfo",
            payload:{
              id:location.state.id
            }
          });
				}
			});
		},
	},
}
