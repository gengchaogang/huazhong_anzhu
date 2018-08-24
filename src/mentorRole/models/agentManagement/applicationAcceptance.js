import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import { requestApi } from '../../services/common.js';
import lodash from 'lodash';
const createTeamData = (teams) => {
  return teams.map((item) => {
    return { "key": item.id + "", "title": item.name, "notFull": item.bool };
  });
}
const defaultState = {
  isEmployee: true,
  activeKey: 'brokerApply',
  chooseGroupsModa: false,
  record: null,
  teamData: [],
  pageInfo: {
    pageNo: 0,
    total: 0,
    pageSize: 5,
    content: [],
  },
  tableLoading: true,
  promptObj: finalCode.promptObj,
}
export default {
  namespace: 'applicationAcceptance',
  state: {},
  reducers: {
    setDefaultState(state, action) {
      return lodash.cloneDeep(defaultState);
    },
    changeModal(state, action) {
      return { ...state, ...action.payload }
    },
    saveRecord(state, action) {
      return { ...state, ...action.payload }
    },
    changeTabsKey(state, action) {
      return { ...state, ...action.payload }
    },
    changeTableLoading(state, action) {
      return { ...state, ...action.payload }
    },
    changeIsEmployee(state, action) {
      return { ...state, ...action.payload }
    },
    setStatePramas(state, action) {
      return { ...state, ...action.payload }
    },
    showPrompt(state, action) {
      return {
        ...state,
        promptObj: Object.assign({}, state.promptObj, { ...{ type: "error", title: "", visible: true, todo: "closeModal" } },
          { ...action.payload })
      }
    },
    togglePrompt(state, action) {
      return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },

  },
  effects: {
    *acceptBrokerApply({ payload }, { put, call, select }) {
      const findBrokerInfoResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/acceptBrokerApply",
        ...payload,
      });
      const findBrokerInfoResult = analysisUtil.analysisGetPageDataResponse(findBrokerInfoResponse);
      if (findBrokerInfoResult.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { chooseGroupsModa: false } });
        const _pageNo = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageNo);
        const _pageSize = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageSize);
        yield put({ type: 'findBrokerApplyList', payload: { pageNo: _pageNo, pageSize: _pageSize } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${findBrokerInfoResult.msg}` } });
      }
    },
    *acceptBrokerExitApply({ payload }, { call, put, select }) {
      const acceptBrokerExitApply = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/acceptBrokerExitApply",
        ...payload,
      });
      const acceptBrokerExitApplyResult = analysisUtil.analysisGetPageDataResponse(acceptBrokerExitApply);
      if (acceptBrokerExitApplyResult.isSuccess) {
        payload.resolve();
        const _pageNo = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageNo);
        const _pageSize = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageSize);
        yield put({ type: 'getBrokerExitApplyData', payload: { pageNo: _pageNo, pageSize: _pageSize } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${acceptBrokerExitApplyResult.msg}` } });
      }

    },
    *refuseBrokerApply({ payload }, { put, call, select }) {

      const deleteBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/rejectBrokerExitApply",
        ...payload,
      });

      const deleteBrokerResult = analysisUtil.analysisDataResponse(deleteBrokerResponse);
      if (deleteBrokerResult.isSuccess) {
        payload.resolve();
        const _pageNo = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageNo);
        const _pageSize = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageSize);
        const activeKey = yield select(({ applicationAcceptance }) => applicationAcceptance.activeKey);
        if (activeKey === 'brokerApply') {
          yield put({ type: 'findBrokerApplyList', payload: { pageNo: _pageNo, pageSize: _pageSize } });
        } else if (activeKey === 'brokerExitApply') {
          yield put({ type: 'getBrokerExitApplyData', payload: { pageNo: _pageNo, pageSize: _pageSize } });
        }
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${deleteBrokerResult.msg}` } });
      }
    }
    ,

    *getInitInfo({ payload }, { put, call, select }) {
      yield put({
        type: 'setDefaultState'
      });

      const _pageNo = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageNo);
      const _pageSize = yield select(({ applicationAcceptance }) => applicationAcceptance.pageInfo.pageSize);
      yield put({ type: 'findBrokerApplyList', payload: { pageNo: _pageNo, pageSize: _pageSize } });

      yield put({ type: 'findTeamBrief' });
    }
    ,
    *findBrokerApplyList({ payload }, { put, call, select }) {
      const findBrokerInfoResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findBrokerApplyList",
        ...payload,
      });
      const brokerInfo = analysisUtil.analysisGetPageDataResponse(findBrokerInfoResponse);


      if (brokerInfo.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { pageInfo: brokerInfo } });
        yield put({ type: 'changeTableLoading', payload: { tableLoading: false } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${brokerInfo.msg}` } });
      }
    },
    *getBrokerExitApplyData({ payload }, { call, put }) {
      const getBrokerExitApplyDataResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findBrokerExitApplyList",
        ...payload,
      })
      const brokerInfo = analysisUtil.analysisGetPageDataResponse(getBrokerExitApplyDataResponse);
      if (brokerInfo.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { pageInfo: brokerInfo } });
        yield put({ type: 'changeTableLoading', payload: { tableLoading: false } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${brokerInfo.msg}` } });
      }
    },
    //得到该导师下的所有团队
    *findTeamBrief({ payload }, { put, call, select }) {
      const findTeamBriefResponseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findTeamBrief",
      });
      const teamBrief = analysisUtil.analysisDataResponse(findTeamBriefResponseObj);
      if (teamBrief.isSuccess) {
        const teamOptionData = createTeamData(teamBrief.content);
        yield put({ type: 'setStatePramas', payload: { teamData: teamOptionData } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${teamBrief.msg}` } });
        return;
      }
    },
  },
  subscriptions: { //路由监听
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/agentManagement/applicationAcceptance') {
          dispatch({
            type: "getInitInfo",
          })
        }
      });
    },
  },
}
