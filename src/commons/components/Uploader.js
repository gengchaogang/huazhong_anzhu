/**
 * Created by Jason on 2017/1/5.
 */
import React, { PropTypes } from 'react';
import { Upload, Icon, Modal } from 'antd';

function Uploader(props){
	const {
		fileList,
		handleChange,
		handleCancel,
		handlePreview,
		previewVisible,
		previewImage,
		tip,
		uploadText,
		fieldName,
	}=props;
	const uploadButton = (
		<div>
			<Icon type="plus" />
			{/*
			 */}
			<div className="ant-upload-text">{uploadText?uploadText:'点击上传'}</div>
		</div>
	);
	const props1={
		name:fieldName,
		action:"www.baidu.com",
		listType:"picture-card",
		fileList:fileList,
		onPreview:handlePreview,
		onChange:handleChange,
	};
	return (
		<div>
			<Upload {...props1}>
				{ fileList.length==5?null:uploadButton}
			</Upload>
			<p>{tip}</p>
			<Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</div>
	);
}
Uploader.propTypes = {
	fileList:PropTypes.array.isRequired,
	handleChange:PropTypes.func.isRequired,
	handleCancel:PropTypes.func.isRequired,
	handlePreview:PropTypes.func.isRequired,
	previewVisible:PropTypes.bool.isRequired,
	previewImage:PropTypes.string.isRequired,
	tip:PropTypes.string,
	uploadText:PropTypes.string,
	fieldName:PropTypes.string.isRequired,
};
export default Uploader;