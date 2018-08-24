import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table,Modal,Checkbox,Input } from 'antd';
import SearchInput from '../../../../../commons/View/SearchInput'
import DxPanel from '../../../../../commons/components/DxPanel'
import './AvailabilityDetails.css'
import textPic from '../../../../assets/yay.jpg'
import './VideoImage.css'
import JumpButton from './JumpButton'

function VideoImage({dispatch }) {
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
  return (
    <div>
      <JumpButton/>
      <DxPanel title='经纪人上传'>
        <div>
          <div>
            <div className='videoImageImg' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='videoImage'>
              <span>王小明</span>
              <span>上传 15张</span>
              <span>上传时间：2016-12-12 14：54：45</span>
              <Button type='primary'>采纳视频图片</Button>
            </div>
          </div>
          <div className='imgAdopt'>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
          </div>
          <div>
            <div className='videoImageImg' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='videoImage'>
              <span>王小明</span>
              <span>上传 15张</span>
              <span>上传时间：2016-12-12 14：54：45</span>
              <Button type='ghost'>已采纳</Button>
            </div>
          </div>
          <div className='imgAdopt'>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
            <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
          </div>
          <Button onClick={goBack}>返回</Button>
        </div>

      </DxPanel>

    </div>
  );
}

function mapStateToProps({ videoImage }) {
  return { videoImage }
}

export default connect(mapStateToProps)(VideoImage);
