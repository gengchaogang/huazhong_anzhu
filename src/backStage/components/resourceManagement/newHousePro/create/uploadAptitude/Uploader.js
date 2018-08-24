import React, { PropTypes } from 'react';
import { Button, Upload, Icon, Modal } from 'antd';

function Uploader({
  fileList1,
  handleChange,
  handlePreview,
  tip,
  fieldName,
  }){
  const uploadButton = (
      <div>
        <Icon type="plus" />
      {/*
      */}
        <div className="ant-upload-text">点击上传</div>
      </div>
    );
  const props1={
    name:fieldName,
    action:"www.baidu.com",
    listType:"picture-card",
    fileList:fileList1,
    onPreview:handlePreview,
    onChange:handleChange,
  };
  console.log('fileList1.length',fileList1.length);
  return (
    <div className="clearfix" >
      <Upload {...props1}>
        { fileList1.length==1?null:uploadButton}
      </Upload>
      <p>{tip}</p>
    </div>
  );
};
export default Uploader;