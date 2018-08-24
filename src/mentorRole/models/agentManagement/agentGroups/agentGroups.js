import finalCode from '../../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import { requestApi } from '../../../services/common.js';
import { editTeam } from '../../../services/common.js';

import lodash from 'lodash';
let interval = null;
const defaultState = {
  isAuthentication: false,
  toturId: null,
  deptName: "",
  teamData: [],
  generateTeamData: [],

  selectedKey: "root",
  expandedKeys: [],
  searchValue: '',
  autoExpandParent: true,
  selectedRowKeys: [],

  addMemberVisible: false,
  invitationVisible: false,
  adjustmentVisible: false,
  editVisible: false,//新增或编辑团队名称的弹窗开关
  tableLoading: false,
  editVisibles: false,
  userId: 0,



  promptObj: finalCode.promptObj,
  pageInfo: {
    pageNo: 0,
    total: 0,
    pageSize: 3,
    content: [],
  },
  teamId: ''

}

const createTeamTreeData = (tutorName, teams) => {
  const childrenData = teams.map((item) => {
    return { "key": item.id + "", "title": item.name, "notFull": item.bool };
  });
  const teamTreeData = [{ "key": "root", "title": tutorName, "children": childrenData }];
  return teamTreeData;
}
const generateList = (data, dataList) => {
  if (!dataList) {
    dataList = [];
  }
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    const title = node.title;
    const notFull = node.notFull;
    dataList.push({ key, title, notFull });
    if (node.children) {
      generateList(node.children, dataList);
    }
  }
  return dataList;
};

let tutorName = "";

export default {
  namespace: 'agentGroups',
  state: defaultState,
  reducers: {
    setDefaultState(state, action) {
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state, action) {
      return { ...state, ...action.payload }
    },
    setTeamTreeData(state, action) {
      action.payload.generateTeamData = generateList(action.payload.teamData);
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
      return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },
    hiddleTableLoading(state, action) {
      return { ...state, tableLoading: false }
    },
    showTableLoading(state, action) {
      return { ...state, tableLoading: true }
    },
  },
  effects: {
    *getInitInfo({ payload }, { put, call, select }) {
      const userInfo = yield select(({ main }) => main.userInfo);
      if (userInfo) {
        if (interval != null) {
          clearInterval(interval);
        }
      } else {
        return;
      }
      const userInfoJSON = JSON.parse(userInfo);
      const isAuthentication = userInfoJSON.auditStatus == "审核通过" ? true : false;
      tutorName = userInfoJSON.name;
      yield put({
        type: 'setStatePramas',
        payload: {
          isAuthentication: isAuthentication,
          toturId: userInfoJSON.toturId
        }
      });

      yield put({ type: 'findTeamBrief' });

      const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
      const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
      //默认取导师的经纪人。
      yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, sort: { 'id': 'DESC' } } });
      // yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,sort:{'addTime':'desc'}});

    },

    //得到该导师下的所有团队
    *findTeamBrief({ payload }, { put, call, select }) {
      const findTeamBriefResponseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findTeamBrief",
      });
      const teamBrief = analysisUtil.analysisDataResponse(findTeamBriefResponseObj);
      if (teamBrief.isSuccess) {
        const teamTreeData = createTeamTreeData(tutorName, teamBrief.content);
        yield put({ type: 'setTeamTreeData', payload: { teamData: teamTreeData } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${teamBrief.msg}` } });
        return;
      }
    },

    *editTeam({ payload }, { put, call, select }) {
      yield call(editTeam, payload)
      yield put({
        type: "setStatePramas",
        payload: {
          editVisibles: false
        }
      })
        ;
    },

    *findTeamBrokerInfo({ payload }, { put, call, select }) {
      const findBrokerInfoResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findBrokerInfo",
        ...payload,
      });
      const brokerInfo = analysisUtil.analysisGetPageDataResponse(findBrokerInfoResponse);

      if (brokerInfo.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { pageInfo: { ...brokerInfo } } });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${brokerInfo.msg}` } });
        return;
      }
    },

    *updateTeam({ payload }, { put, call, select }) {
      let updateTeamResponse = null;
      if (payload.id) {
        updateTeamResponse = yield call(requestApi, {
          apiName: "/miss-anzhu-tutor/tutors/broker/editTeam",
          ...payload,
        });
      } else {
        updateTeamResponse = yield call(requestApi, {
          apiName: "/miss-anzhu-tutor/tutors/broker/addTeam",
          ...payload,
        });
      }
      const updateTeamResult = analysisUtil.analysisDataResponse(updateTeamResponse);
      if (updateTeamResult.isSuccess) {
        if (payload.id) {
          yield put({ type: 'setStatePramas', payload: { editVisible: false, deptName: payload.name } });
        } else {
          yield put({ type: 'setStatePramas', payload: { editVisible: false } });
        }
        //成功后重新去读取该导师团队信息
        yield put({ type: 'findTeamBrief' });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${updateTeamResult.msg}` } });
        return;
      }
    },

    *deleteTeam({ payload }, { put, call, select }) {
      const deleteTeamResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/deleteTutorTeam",
        teamId: payload.teamId,
      });
      const deleteTeamResult = analysisUtil.analysisDataResponse(deleteTeamResponse);
      if (deleteTeamResult.isSuccess) {
        //成功后重新去读取该导师团队信息
        payload.resolve();
        yield put({ type: 'setStatePramas', payload: { deptName: "" } });
        yield put({ type: 'findTeamBrief' });
      } else {
        payload.resolve();
        yield put({ type: 'showPrompt', payload: { description: `${deleteTeamResult.msg}` } });
      }
    },

    *moveBroker({ payload }, { put, call, select }) {
      const moveBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/brokerMove",
        ...payload,
      });

      const moveBrokerResult = analysisUtil.analysisDataResponse(moveBrokerResponse);
      if (moveBrokerResult.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { adjustmentVisible: false } });
        const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
        const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
        const _selectedKey = yield select(({ agentGroups }) => agentGroups.selectedKey);
        if (_selectedKey != "root") {
          // yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,teamId:_selectedKey}});
          yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, teamId: _selectedKey, sort: { 'id': 'DESC' } } });
        }
        yield put({
          type: "setStatePramas",
          payload: {
            selectedRowKeys: []
          }
        })
        yield put({ type: 'findTeamBrief' });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${moveBrokerResult.msg}` } });
      }
    },
    *activateBroker({ payload }, { put, call, select }) {
      const activateBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/activateBroker",
        ...payload,
      });

      const activateBrokerResult = analysisUtil.analysisDataResponse(activateBrokerResponse);
      if (activateBrokerResult.isSuccess) {
        payload.resolve();
        const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
        const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
        const _selectedKey = yield select(({ agentGroups }) => agentGroups.selectedKey);
        let _teamId = "";
        if (_selectedKey != "root") {
          _teamId = _selectedKey;
        }
        //yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,teamId:_teamId}});
        yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, teamId: _teamId, sort: { 'id': 'DESC' } } });

        yield put({
          type: "setStatePramas",
          payload: {
            selectedRowKeys: []
          }
        })
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${activateBrokerResult.msg}` } });
      }
    },

    *deleteBrokers({ payload }, { put, call, select }) {
      const deleteBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/deleteBrokerInfo",
        ...payload,
      });

      const deleteBrokerResult = analysisUtil.analysisDataResponse(deleteBrokerResponse);
      if (deleteBrokerResult.isSuccess) {
        payload.resolve();

        const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
        const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
        const _selectedKey = yield select(({ agentGroups }) => agentGroups.selectedKey);
        let _teamId = "";
        if (_selectedKey != "root") {
          _teamId = _selectedKey;
        }
        //yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,teamId:_teamId}});
        yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, teamId: _teamId, sort: { 'id': 'DESC' } } });
        yield put({ type: 'findTeamBrief' });
        yield put({
          type: "setStatePramas",
          payload: {
            selectedRowKeys: []
          }
        })
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${deleteBrokerResult.msg}` } });
      }
    },

    *addBroker({ payload }, { put, call, select }) {
      const addBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/addBroker",
        ...payload,
      });

      const addBrokerResult = analysisUtil.analysisDataResponse(addBrokerResponse);
      if (addBrokerResult.isSuccess) {
        yield put({ type: 'setStatePramas', payload: { addMemberVisible: false } });
        const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
        const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
        const _selectedKey = yield select(({ agentGroups }) => agentGroups.selectedKey);
        let _teamId = "";
        if (_selectedKey != "root") {
          _teamId = _selectedKey;
        }
        // yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,teamId:_teamId}});
        yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, teamId: _teamId, sort: { 'id': 'DESC' } } });
        yield put({ type: "findTeamBrief" });
      } else {
        yield put({ type: 'showPrompt', payload: { description: `${addBrokerResult.msg}` } });
      }
    },


    *deleteUnActivationBroker({ payload }, { put, call, select }) {
      const deleteUnActivationBrokerResponse = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/deleteUnActiveBroker",
        id: payload.id
      });

      const deleteUnActivationBrokerResult = analysisUtil.analysisDataResponse(deleteUnActivationBrokerResponse);
      if (deleteUnActivationBrokerResult.isSuccess) {
        payload.resolve();
        yield put({ type: 'setStatePramas', payload: { addMemberVisible: false } });
        const _pageNo = yield select(({ agentGroups }) => agentGroups.pageInfo.pageNo);
        const _pageSize = yield select(({ agentGroups }) => agentGroups.pageInfo.pageSize);
        const _selectedKey = yield select(({ agentGroups }) => agentGroups.selectedKey);
        let _teamId = "";
        if (_selectedKey != "root") {
          _teamId = _selectedKey;
        }
        // yield put({type:'findTeamBrokerInfo',payload:{pageNo:_pageNo,pageSize:_pageSize,teamId:_teamId}});
        yield put({ type: 'findTeamBrokerInfo', payload: { pageNo: _pageNo, pageSize: _pageSize, teamId: _teamId, sort: { 'id': 'DESC' } } });
        yield put({ type: 'findTeamBrief' });
      } else {
        payload.resolve();
        yield put({ type: 'showPrompt', payload: { description: `${deleteUnActivationBrokerResult.msg}` } });
      }
    },


  },

  subscriptions: { //路由监听
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/agentManagement/agentGroups') {
          //获取初始化信息
          dispatch({
            type: "setDefaultState",
          })
          interval = setInterval(() => {
            dispatch({
              type: "getInitInfo",
            })
          }, 100);
        }
      });
    },
  },
}
