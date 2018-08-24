import React from 'react'
import { connect } from 'dva'
import { Button, Steps, } from 'antd'
import './createShopsSellResource.css'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import { DxSteps, DxStep } from '../../../../commons/View/DxSteps'
const Step = Steps.Step;


function CreateShopsSellResource(props) {
  const { dispatch, createShopsSellResource, children, promptObj, loadingShadow, } = props;
  const { current } = createShopsSellResource
  const steps = [
    '房源信息',
    '房源图片',
    '业主信息',
  ]
  return (
    <div className="mentorCreateHouse">
      <div className="background">
        <DxSteps current={current} className="navbar" status='finish'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item} />)}
        </DxSteps>
      </div>
      {children}
    </div>
  )
}
function mapStateToProps({ createShopsSellResource }) {
  return { createShopsSellResource }
}

export default connect(mapStateToProps)(CreateShopsSellResource)
