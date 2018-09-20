import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';


const initState = {
    promptObj: {
        visible: false,
        description: '',
        title: '',
        promptFor: 'default',
        okText: '确定',
        type: '',
        todo: '',
    },//对话框参数
    modalConfig: {
        visible: false,
    },
    currentProgramme: null,
    programmeList: {//所有方案的下拉列表
        pageNo: 1,
        total: 0,
        pageSize: 3,
        content: [],
    },
}
export default {
    namespace: "standardHome",
    state: initState,
    reducers: { //action
        initState(state, action) {
            return { ...state, ...initState }
        },
        setState(state, action) {
            return { ...state, ...action.payload }
        },
        showProcess(state, action) {
            return { ...state, loadingShadow: true }
        },
        hideProcess(state, action) {
            return { ...state, loadingShadow: false }
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
        changeVisible(state, action) {
            return { ...state, ...action.payload }
        },
        saveResultData(state, action) {
            return { ...state, loadingShadow: false, ...action.payload }
        },
    },
    subscriptions: {     //路由监听
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/dataStatistics/standardHome') {
                    dispatch({
                        type: 'getAssessList',
                    })
                    dispatch({
                        type: 'findAssess',
                    })
                }
            })
        }
    },
    effects: {
        *findAssess({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            })
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/assess/findAssess'
            })
            const resObj = analysisUtil.analysisDataResponse(responseObj);
            if (resObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        currentProgramme: resObj
                    }
                });
                yield put({
                    type: "hideProcess"
                });
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
        //获取所有方案   同列表页  pagesize固定1000
        *getAssessList({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            });
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-statistics/assess/getAssessList",
                pageNo: 0,
                pageSize: 1000,
            });
            const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        programmeList: reObj
                    }
                });
                yield put({
                    type: "hideProcess"
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
        //修改方案
        *changeCurrentPro({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess'
            })
            const updateId = yield select(({ standardHome }) => standardHome.currentProgramme.id);
            if (payload.id !== updateId) {
                const responseObj = yield call(requestApi, {
                    apiName: '/miss-anzhu-statistics/assess/updateAssessStatus',
                    id: payload.id,
                    updateId,
                    keyword: "status"
                })
                const resObj = analysisUtil.analysisDataResponse(responseObj);
                if (resObj) {
                    yield put({
                        type: "hideProcess"
                    });
                    message.success("修改方案成功");
                    yield put({
                        type: 'findAssess',
                    })
                } else {
                    yield put({
                        type: 'showPrompt',
                        payload: {
                            description: `${resObj.msg}`
                        }
                    });
                }
            }
        }
    }
}