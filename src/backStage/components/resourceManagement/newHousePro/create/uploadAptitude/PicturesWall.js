import React, { PropTypes } from 'react';
import { Button, Upload, Icon, Modal, Row, Col } from 'antd';
import Uploader from './Uploader';
function PicturesWall({
  PicturesWallProps
  }){
  const {handleCancel,previewVisible,previewImage,...uploaderProps}=PicturesWallProps;
  const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
  return (
    <div>
      <Row  type="flex" justify='start'>
        <Col ><Uploader {...uploaderProps} tip='营业执照'  fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='电商代理合同' fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='预售许可证' fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='土地使用证' fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='规划许可证' fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='建设许可证' fieldName='Img_businesslicense'/></Col>
        <Col ><Uploader {...uploaderProps} tip='补充' fieldName='Img_others'/></Col>
      </Row>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <p style={{marginTop:'16px'}}>最多可上传10张/单张不超过2M</p>
    </div>
  );
};
export default PicturesWall;