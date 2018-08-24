// import {findTrackByGroupKeyFetch}from '../../../services/tradeManagement/newHouseTrade/customerDoLook'

export default {
  namespace: 'secondHouseSellTransaction',
  state: {
    tableLoading:true,
    promptObj:{
      visible:false,
      title:'提示',
      todo:'default',
    },
  },
  subscriptions: {
  //  setup({ dispatch, history }) {
  //    history.listen(location => {
    //    if (location.pathname === '/tradeManagement/newHouseTrade/customerDoLook'){
    //      if(!!location.state && !!location.state.groupKey){
    //        //已经确定了项目,获取之前的数据
    //        dispatch({
    //          type:'findTrackByGroupKey',
    //          payload:location.state.groupKey,
    //        });
    //      }else{
    //        dispatch({
    //          type: 'notGetGroupId',
    //          payload:{
    //            visible:true,
    //            content:'请联系管理员',
    //            title:'获取groupKey失败！',
    //            okText:'确定',
    //            type:'error',
    //          },
    //        });
    //      }
    //    }
    // });
  //  },
  },
  effects:{

  },
  reducers: {
    // switchPrompt(state,action){
    //   return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    // },
  },
}
