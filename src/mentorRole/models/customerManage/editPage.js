import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';

const initState = {
    loadingShadow: false,
    promptObj: {
        visible: false,
        description: '',
        title: '',
        promptFor: 'default',
        okText: '确定',
        type: '',
        todo: '',
    },
    eopOptions: [],
    wantTotal: 1,
};

export default {
    namespace: "editPage",
    state: initState,
    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
        saveResultData(state, action) {
            return { ...state, loadingShadow: false, ...action.payload }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/customerManage/editPage') {
                    //   获取初始数据
                    dispatch({
                        type: 'initData',
                    });
                }
            })
        }
    },
    effects: {
        // 初始化
        *initData({ payload }, { put, call }) {
            yield put({
                type: "showProcess"
            });
            // 加载所在区域信息
            yield put({
                type: "getEopOptions"
            });
        },
        // 加载区域信息
        *getEopOptions({ payload }, { put, call }) {
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-operation/service-regions/findAllProvinces",
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if (reObj.isSuccess) {
                const eopData = commonUtil.createEopData(reObj.content);
                yield put({
                    type: 'saveResultData',
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
    }

}