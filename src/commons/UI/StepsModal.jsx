import React, { Component, PropTypes } from 'react'

import {Modal} from 'antd'
import {DxSteps,DxStep} from '../View/DxSteps'


import './StepsModal.css'




export default function StepsModal(props){
  const {
    title,
    children,
    visible,
    stepList,
    stepStatus,
    current,
    width=500,
    footer,
    onCancel=function(){},
  }=props;
  return(
    <div className='dx_stepsModal'>
      <Modal visible={visible} title={title} footer={footer} width={width} onCancel={onCancel} wrapClassName='dx_stepsModal_modal'>
        {stepList.length!=0 && <DxSteps current={current} status={stepStatus}>
          {stepList.map(item=><DxStep title={item.title} key={`step_${item.title}`} description={!!item.description?item.description:''}/>)}
        </DxSteps>}
        {children}
      </Modal>
    </div>
  )
}
