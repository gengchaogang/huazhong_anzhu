import { routerRedux } from 'dva/router';
import { requestApi } from '../../services/common.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import lodash from 'lodash';

const defaultState = {
  showBusinessLicenseList: [],
  certificatesType: 1,
  userInfo: {},
  eopOptions: [],
  loadingShadow: false,
  cityNames: "",
  promptObj: finalCode.promptObj,
}
//封装行政区划数据
const createEopData = (eopOptions) => {
  let eopObj = {};
  let eopRootArray = [];
  let eopArray = [];
  eopOptions.forEach((item, index) => {
    let tempItem = {};
    tempItem.value = item.code;
    tempItem.label = item.lable;
    eopObj[item.code] = tempItem;

    const pCode = item.pCode;
    if (pCode) {
      if (eopObj[pCode]) {
        if (!eopObj[pCode]["children"]) {
          eopObj[pCode]["children"] = [];
        }
        eopObj[pCode]["children"].push(tempItem);
      }
    } else {
      eopRootArray.push(item.code);
    }
  });
  eopRootArray.map((item) => {
    const tempObj = eopObj[item];
    if (tempObj) {
      eopArray.push(tempObj);
    }
  });
  return eopArray;
}
export default {
  namespace: 'perfectInformation',
  state: lodash.cloneDeep(defaultState),
  reducers: {
    showBusinessLicenseListac(state, action) {
      return { ...state, showBusinessLicenseList: action.payload }
    },
    changeRadioValue(state, action) {
      return { ...state, ...action.payload }
    },

    setDefaultState(state, action) {
      return lodash.cloneDeep(defaultState);
      // return getInitState();
    },

    setStatePramas(state, action) {
      return { ...state, ...action.payload }
    },

    showPrompt(state, action) {
      return {
        ...state, loadingShadow: false,
        promptObj: Object.assign({}, state.promptObj, { ...{ type: "error", title: "", visible: true, todo: "closeModal" } },
          { ...action.payload })
      }
    },
    togglePrompt(state, action) {
      return { ...state, loadingShadow: false, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },
  },
  effects: {
    *getEopOptions({ payload }, { put, call }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-operation/service-regions/findAllProvinces",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const eopData = createEopData(reObj.content);
        yield put({
          type: 'setStatePramas',
          payload: {
            eopOptions: eopData
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    *addTutors({ payload }, { put, call }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/add",
        ...payload.formData,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        yield put(routerRedux.push({
          pathname: "/mentorRegister/complete",
        }));
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg.replace('名字', '企业名称')}`
          }
        });
      }
    },
  },
  subscriptions: { //路由监听
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/mentorRegister/perfectInformation') {
          dispatch({
            type: "setDefaultState",
          })
          //取行政区划
          dispatch({
            type: "getEopOptions",
          })

          const { phone, password, loginName } = location.state;
          const userInfo = { phone, password, loginName };
          dispatch({
            type: "setStatePramas",
            payload: {
              userInfo: userInfo,
            }
          })


        }
      });
    },
  },
}
