import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import './BusinessInformationManagement.css'
import DxPanel from '../../../commons/components/DxPanel'
import textPic from '../../assets/yay.jpg'

function BusinessInformationManagement({businessInformationManagement}) {
  const {mainInformation}=businessInformationManagement;
  return (
    <div>
      <DxPanel title="交易中心信息">
        <div>
          <div>交易中心ID：{mainInformation.code}</div>
          <div>交易中心名称：{mainInformation.name}</div>
          <div>交易中心负责人：{mainInformation.header}</div>
          <div>营业地址：{mainInformation.address}</div>
          <div>营业电话：{mainInformation.businessPhone}</div>
        </div>
      </DxPanel>
      <DxPanel title="交易中心业务联系人信息">
        <div>
          <div>业务联系人：{mainInformation.contacts}</div>
          <div>联系电话：{mainInformation.contactsPhone}</div>
        </div>
      </DxPanel>
      <DxPanel title="企业信息">
        <div>
          <div>企业名称：{mainInformation.companyName}</div>
          <div>企业法人：{mainInformation.corporation}</div>
          <div>企业营业执照：</div>
          {mainInformation.licensePic?
            (<div className='businessInformationManagement' style={{backgroundImage:`URL(${mainInformation.licensePic})`}}></div>):
            (<div className='businessInformationManagement' style={{backgroundImage:`URL(${textPic})`}}></div>)
          }
        </div>
      </DxPanel>
    </div>
  );
}

BusinessInformationManagement.propTypes = {
}
function mapStateToProps({businessInformationManagement}) {
  return { businessInformationManagement };
}

export default connect(mapStateToProps)(BusinessInformationManagement)
