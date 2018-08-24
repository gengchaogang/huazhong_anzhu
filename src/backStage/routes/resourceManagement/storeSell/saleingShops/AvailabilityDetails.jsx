import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table,Modal,Checkbox,Input } from 'antd';
import SearchInput from '../../../../../commons/View/SearchInput'
import DxPanel from '../../../../../commons/components/DxPanel'
import './AvailabilityDetails.css'
import textPic from '../../../../assets/yay.jpg'
import JumpButton from './JumpButton'

function AvailabilityDetails({dispatch,availabilityDetails }) {
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
  const availabilityClick=()=>{
    dispatch({
      type:'availabilityDetails/availabilityClick'
    })
  }
  const avahandleOk=()=>{
    dispatch({
      type:'availabilityDetails/avahandleOk'
    })
  }
  const avahandleCancel=()=>{
    dispatch({
      type:'availabilityDetails/avahandleCancel'
    })
  }

  return (
    <div>
      <JumpButton/>
      <DxPanel title='房源状态'>
        <div>房源状态：在售</div>
      </DxPanel>
      <DxPanel title='房源信息'>
        <div>挂牌时间：2016-12-12</div>
        <div>房源编号：332005469041</div>
        <div>房源视频/图片</div>
        <div>
          <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
        <div>房源标题：万达广场（通州店） 底商  300㎡</div>
        <div>楼盘名称：万达广场（通州店）</div>
        <div>所在地区：北京市-海淀区</div>
        <div>建筑面积：85㎡</div>
        <div>使用面积：80㎡</div>
        <div>楼层：高层</div>
        <div>建筑年代：2004年</div>
        <div>期望/成交总价：1200万</div>
        <div>商铺类型：住宅底商-店铺</div>
        <div>可经营类别：餐饮没事，服装鞋包</div>
        <div>是否可分割：可分割</div>
        <div>装修情况：精装修</div>
        <div>详细地址：北京市海淀区xxxxx</div>
        <div>房源特色：名商入驻   繁华地段</div>
      </DxPanel>
      <DxPanel title='委托协议'>
        <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='房产证'>
        <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='业主身份证'>
        <div>
          <div className='availabilityDetails' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div>
            <Button type='primary' onClick={availabilityClick}>下架</Button>
            <Button type='ghost' onClick={goBack}>返回</Button>
          </div>
        </div>
      </DxPanel>
      <Modal title="下架原因" visible={availabilityDetails.modalStatus}
          onOk={avahandleOk} onCancel={avahandleCancel}
          okText='完成'
      >
        <div>
          <Checkbox >房源线下已售</Checkbox>
        </div>
        <div>
          <Checkbox >房源信息错误</Checkbox>
        </div>
        <div>
          <Checkbox >包含非法信息</Checkbox>
        </div>
        <div>
          <Checkbox >其他</Checkbox>
        </div>
        <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
      </Modal>
    </div>
  );
}

function mapStateToProps({ availabilityDetails }) {
  return { availabilityDetails }
}

export default connect(mapStateToProps)(AvailabilityDetails);
