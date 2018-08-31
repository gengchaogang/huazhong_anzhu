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
            {
                name: "geng",
                gender: "男",
                want: "求购",
                createDate: "2018/08/30",
                phone: "17692349163"
            }
        ],
    },
    bringModal: {
        visible: false
    },
    followModal: {
        visible: false
    }
};

export default {
    namespace: "editPage",
    state: initState,
    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {

            })
        }
    },
    effects: {

    }

}