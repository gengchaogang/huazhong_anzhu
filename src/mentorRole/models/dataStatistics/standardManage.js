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
    programmeList: {
        pageNo: 1,
        total: 0,
        pageSize: 3,
        content: [],
    },
    loadingShadow: false,
}
export default {
    namespace: "standardManage",
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
                if (location.pathname === '/dataStatistics/standardHome/standardManage') {
                    dispatch({
                        type: 'initState'
                    })
                    dispatch({
                        type: 'getAssessList',
                        payload: {
                            pageNo: 0
                        }
                    })
                }
            })
        }
    },
    effects: {
        //获取方案列表miss-anzhu-statistics/assess/getAssessList
        *getAssessList({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            });
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-statistics/assess/getAssessList",
                pageNo: payload.pageNo,
                pageSize: initState.programmeList.pageSize,
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
        //删除方案 
        *deletePro({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess'
            })
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/assess/updateAssessStatus',
                id: payload.id,
                keyword: "delete"
            })
            if (responseObj.data.data == true) {
                yield put({
                    type: "hideProcess"
                });
                message.success("删除方案成功");
                yield put({
                    type: 'getAssessList',
                    payload: {
                        pageNo: 0
                    }
                })
            } else if (responseObj.data.data == false) {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `删除失败，当前方案已启用`,
                    }
                });
            }
        }
    }
}