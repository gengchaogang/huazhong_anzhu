import React, { PropTypes } from 'react'
import { Modal ,Button } from 'antd'
import './DxConfirmModal.css'

const DxConfirmModal = ({
  className,
  width=300,
  title='提示',
  visible,
  okBtnLoading=false,
  description='确认执行？',
  onOk,
  onCancel,
  onClose=onCancel,
  okText='确定',
  cancelText='取消',
  afterClose,
}) => {
  return (
    <Modal width={width} className={`dxConfirmModal ${className}`} onCancel={onClose} visible={visible} footer={null} afterClose={afterClose}>
      <p className='dxConfirmModal_title'>{title}</p>
      <p className='dxConfirmModal_description'>{description}</p>
      <div className='dxConfirmModal_footer'>
        <Button type='primary'  onClick={onOk} loading={okBtnLoading}>{okText}</Button>
        <Button type='ghost'  onClick={onCancel}>{cancelText}</Button>
      </div>
    </Modal>
  )
}


export default DxConfirmModal
