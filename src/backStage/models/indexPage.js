import {getLoginInfo} from '../services/indexPage.js';
import { parse } from 'qs';
import { message} from 'antd';
import { routerRedux } from 'dva/router';
import houseIcon from '../assets/images/house.svg'
import {
  isNull,
  judgeJurisdiction,
  renderTradeCenterIndexPageEntranceRouter,
  getArrayObjectValue,
} from '../../commons/utils/currencyFunction'
export default {
	namespace: 'indexPage',
	state: {
    loading:false,
		entranceData:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/indexPage'){
          dispatch({
            type:'getUserInfo'
          })
        }
			});
		},
	},
	effects: {
		//初始化请求表格数据
		*getUserInfo({payload},{put,select,takeLatest,call}){
			// const entranceData = getEntranceData();
      // console.log(entranceData,'entranceDataentranceData>>>>>>>>');
			// yield put({
      //   type:'initail',
      //   payload:{
      //     loading:false,
      //     entranceData:entranceData,
      //   }
      // })
      const {
        userInfo,
      }=yield select(({main})=>main);
      function *getEntranceFun(){
        const {
          userInfo,
        }=yield select(({main})=>main);
        yield put({
          type:'renderEntranceData',
          payload,
        })
      }
      if(!!userInfo){
        yield put({
          type:'renderEntranceData',
          payload,
        })
      }else{
        yield takeLatest('main/initUserInfo',getEntranceFun)
      }
    },
    *renderEntranceData({payload},{put}){
      // console.log('payload',payload);
      //调用方法 生成entranceData
      const entranceData = getEntranceData();
      console.log('entranceData',entranceData);
      yield put({
        type:'initail',
        payload:{
          loading:false,
          entranceData:entranceData,
        }
      })
    },
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
		updateEntranceData(state,action){
      return {...state,entranceState:action.payload}
    },
	},
}
function getEntranceData(){
	const entranceData = [];
  //房源图片
  if(judgeJurisdiction('BACKSTAGE_HOUSINGPICTURE_AUDIT')){
    entranceData.push({
      path:'contentCheck/houseImgCheck',
      title:'房源图片',
      className:'badge_reporting',
      bgcolor:'#67C5C2',
			pic:houseIcon,
    });
  }
  //注册审核
  if(judgeJurisdiction('BACKSTAGE_MENTOR_REGISTERED')){
    entranceData.push({
      path:'contentCheck/advisorRegister',
      title:'注册审核',
      className:'badge_reporting',
      bgcolor:'#FFD167',
			pic:houseIcon,
    });
  }
  //完善小区
  if(judgeJurisdiction('BACKSTAGE_BROKER_UPLOADCOMMUNITY')){
    entranceData.push({
      path:'contentCheck/brokerUploadCommunity',
      title:'完善小区',
      className:'badge_reporting',
      bgcolor:'#FE9A66',
			pic:houseIcon,
    });
  }
  //意见反馈
  if(judgeJurisdiction('BACKSTAGE_OPINION_FEEDBACK')){
    entranceData.push({
      path:'contentCheck/feedback',
      title:'意见反馈',
      className:'badge_reporting',
      bgcolor:'#67C5C2',
			pic:houseIcon,
    });
  }
  //财务结算
  if(judgeJurisdiction('BACKSTAGE_PLATFORM_EARNINGS_SETTLEMENT')){
    entranceData.push({
      path:'financeManagement/platformEarningBalance',
      title:'财务结算',
      className:'badge_reporting',
      bgcolor:'#F6867A',
			pic:houseIcon,
    });
  }
  // console.log(entranceData,'entranceDataentranceData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	return entranceData
}
