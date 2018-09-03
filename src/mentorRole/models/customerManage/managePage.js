import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';

const initState = {
    currentTab: "followCustomerTab",
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
    customerList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [

        ],
    },
    bringModal: {
        visible: false
    },
    followModal: {
        visible: false
    },
    record: null,//客户信息
};

export default {
    namespace: "managePage",
    state: initState,
    reducers: {
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
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/customerManage/managePage') {
                    console.log(location.state.record);
                    dispatch({
                        type: "setState",
                        payload: {
                            record: location.state.record
                        }
                    })
                }
            })
        }
    },
    effects: {

    }

}