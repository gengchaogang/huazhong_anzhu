import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Button, Upload, Icon, Modal } from 'antd';
import './uploadAptitude.css';
import TitleBar from '../../../../commons/UI/TitleBar';
import PicturesWall from '../../../../backStage/components/resourceManagement/newHousePro/create/uploadAptitude/PicturesWall';
function UploadAptitude({ location, dispatch,uploadAptitude }) {
  const {fileList1,previewVisible,previewImage}=uploadAptitude;
  const handleSubmit=()=>{
  	alert('点你妹儿!');
  };
  const goIndex=()=>{
  	alert ('你确定你要放弃发布?');
  };
  const PicturesWallProps={
    fileList1,
    previewVisible,
    previewImage,
    handleCancel: () => {
      dispatch({
        type:'uploadAptitude/changeVisiblePreviewImage',
        payload:{
          previewVisible: false,
        }
      });
    },

    handlePreview: (file) => {
      dispatch({
        type:'uploadAptitude/changeVisiblePreviewImage',
        payload:{
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        }
      });
    },

    handleChange :({ fileList }) => {
      console.log('fileList>>>>>',fileList);
      dispatch({
        type:'uploadAptitude/changeVisiblePreviewImage',
        payload:{
          fileList,
        }
      });
    },
  };
  return (
    <div className='uploadAptitudeContainer'>
      <TitleBar title='上传项目资质'/>
      <PicturesWall PicturesWallProps={PicturesWallProps}/>
      <div style={{margin:'16px 0'}}>
	    	<Button style={{borderColor:'#43B38D',marginLeft:0, backgroundColor:'#43B38D'}} type="primary" onClick={handleSubmit}>发布申请</Button>
	    	<Button type="default" onClick={goIndex}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({ uploadAptitude }) {
  return { uploadAptitude }
}
export default connect(mapStateToProps)(UploadAptitude);
