import { routerRedux } from 'dva/router'
import qs from 'qs';
import {
  getInitContractDataFetch,
} from '../../services/contractTemplate/contractTemplate'
import {
  isNull,
} from '../../../commons/utils/currencyFunction'
const initState={
  nhList:[],
  shSellList:[],
  shRentList:[],
  shLoanList:[],
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
}
export default {
  namespace: 'contractTemplate',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if(location.pathname === '/contractTemplate'){
         setTimeout(() => {
           dispatch({
             type:"getInitContractData",
           })
         }, 1000);
       }
    });
   },
  },
  effects:{
    *getInitContractData({payload},{select,call,put}){
      yield put({
        type:'doInitState',
      })
      const {userInfo}=yield select(({main})=>main);
      let userMsg=null;
      try {
        userMsg=JSON.parse(userInfo);
      } catch (e) {
        userMsg=null
      }
      if(!!userMsg){
        let areaPath=`/${userMsg.fullPath.split("-").join('/')}`;
        const {data}=yield call(getInitContractDataFetch,{areaPath,agreementTypes:['新房合同模板','二手房出售合同模板','二手房出租合同模板','二手房金融贷款协议']});
        if(!!data){
          if(data.status==='success' && !!data.data){
            const list={
              nhList:[],
              shSellList:[],
              shRentList:[],
              shLoanList:[],
            }
            data.data.map((item,index)=>{
              if(item.agreementType==='新房合同模板'){
                list.nhList.push({
                  name:isNull(item.agreementName,'新房合同模板'),
                  url:isNull(item.url,null),
                  id:isNull(item.id,`noID_${index}`),
                })
              }else if(item.agreementType==='二手房出售合同模板'){
                list.shSellList.push({
                  name:isNull(item.agreementName,'二手房出售合同模板'),
                  url:isNull(item.url,null),
                  id:isNull(item.id,`noID_${index}`),
                })
              }else if(item.agreementType==='二手房出租合同模板'){
                list.shRentList.push({
                  name:isNull(item.agreementName,'二手房出租合同模板'),
                  url:isNull(item.url,null),
                  id:isNull(item.id,`noID_${index}`),
                })
              }else if(item.agreementType==='二手房金融贷款协议'){
                list.shLoanList.push({
                  name:isNull(item.agreementName,'二手房金融贷款协议'),
                  url:isNull(item.url,null),
                  id:isNull(item.id,`noID_${index}`),
                })
              }
            })
            yield put({
              type:'initListData',
              payload:{...list},
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取合同模板数据失败！',
                todo:'default',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败',
              title:'获取合同模板数据失败！',
              todo:'default',
            },
          });
        }
        // if(!!data && data.status==='success'){
        //   let newHouseTemplate;
        //   let secondSellTemplate;
        //   let secondRentTemplate;
        //   let secondFinanceTemplate;
        //   data.data.content.map((item,index)=>{
        //     if(item.agreementType==="新房合同模板"){
        //       newHouseTemplate=item.url
        //     }else if(item.agreementType==="二手房出售合同模板"){
        //       secondSellTemplate=item.url
        //     }else if(item.agreementType==="二手房出租合同模板"){
        //       secondRentTemplate=item.url
        //     }else{
        //       secondFinanceTemplate=item.url
        //     }
        //   })
        //   yield put({
        //     type:"saveUrl",
        //     payload:{
        //       newHouseTemplate:newHouseTemplate,
        //       secondSellTemplate:secondSellTemplate,
        //       secondRentTemplate:secondRentTemplate,
        //       secondFinanceTemplate:secondFinanceTemplate,
        //     }
        //   })
        // }else{
        //
        // }
      }else{
        //未获得用户信息
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请刷新页面',
            title:'获取用户所在交易中心信息失败！',
            todo:'default',
          },
        });
      }

    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({accountManagement})=>accountManagement.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'goOut':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },

  },

  reducers: {
    doInitState(state,action){
      return initState;
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //更新合同列表数据
    initListData(state,action){
      return {...state,...action.payload}
    },
  },
}
