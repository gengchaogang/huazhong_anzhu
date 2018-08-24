import React from 'react'
import { connect } from 'dva'
import { Button, Steps, } from 'antd'
import './createOfficeSellResource.css'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import { DxSteps, DxStep } from '../../../../commons/View/DxSteps'
const Step = Steps.Step;


function CreateOfficeSellResource(props) {
  const { dispatch, createOfficeSellResource,
    children, promptObj, loadingShadow,
  } = props;

  const { current } = createOfficeSellResource
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
function mapStateToProps({ createOfficeSellResource }) {
  return { createOfficeSellResource }
}

export default connect(mapStateToProps)(CreateOfficeSellResource)
