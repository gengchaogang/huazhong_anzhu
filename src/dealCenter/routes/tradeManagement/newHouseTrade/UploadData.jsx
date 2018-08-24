import React, { PropTypes } from 'react'
import {Select,Table,Icon,Timeline,Cascader,Button,
  Radio,Upload, Modal,Input,Row,Col}from 'antd'
import textPic from '../../../assets/yay.jpg'
import DxPanel from '../../../../commons/components/DxPanel'
import UserMsg from '../../../components/UserMsg'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import './UploadData.css'

function UploadData({dispatch}){
  const textUserMsgData=[
    {
      title:'客户姓名：',
      value:'黄林峰',
    },{
      title:'性别：',
      value:'男',
    },{
      title:'联系电话',
      value:'15120050558',
    },{
      title:'身份证号：',
      value:'110621198610240038',
    },{
      title:'客户保护期剩余：',
      value:'25天',
    }
  ];

  const intentionListingsTableProps={
    showHeader:false,
    pagination:false,
    columns:[
      {
        title: 'pic',
        dataIndex: 'pic',
        width:'180px',
        key: 'pic',
      },{
        title: 'details',
        dataIndex: 'details',
        key: 'details',
      }
    ],
    dataSource:[
      {
        pic:<div className='dx-table-pic' style={{backgroundImage:`URL(${textPic})`}}></div>,
        key:'001',
        details:'A区域/7号楼/1单元/701室/三室一厅/100㎡ 均价：1000元/㎡  总价：200万/套',
      }
    ],
  };
  const houseRecordTimeLineData=[
    {
      timeStamp:'10-24 19:00',
      content:'客户来源：由林枫添加。',
    },{
      timeStamp:'10-24 20:00',
      content:'客户报备：由林枫报备客户。',
    },{
      timeStamp:'10-24 22:00',
      content:'房源确看：由驻场人员 李四 确看。  确看备注：一二三四五六七八九十。',
    },{
      timeStamp:'10-24 23:00',
      content:'房源确看：由驻场人员 李四 确看。  确看备注：一二三四五六七八九十。',
    }
  ];
  const preferentialInformation={
    showHeader:true,
    pagination:false,
    columns:[
      {
        title: '优惠信息',
        dataIndex: 'pic',
        key: 'pic',
      },
      {
        title: '适用类型',
        dataIndex: 'details',
        key: 'details',
      },
      {
        title: '订单编号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '支付方式',
        dataIndex: 'payAway',
        key: 'payAway',
      },
      {
        title: '支付流水号',
        dataIndex: 'paySerialNumber',
        key: 'paySerialNumber',
      },
      {
        title: '支付客户',
        dataIndex: 'payCustomer',
        key: 'payCustomer',
      },
      {
        title: '客户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },
      {
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '支付金额',
        dataIndex: 'payCash',
        key: 'payCash',
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      },
    ],
    dataSource:[
      {
        key:'001',
        pic:<sapn className="purchasedDiscount">1万抵十万</sapn>,
        details:'100㎡-200㎡',
        number:332005469041,
        payAway:'POS机支付/工商银行',
        paySerialNumber:65535,
        payCustomer:'张三',
        customerPhone:'15120050558',
        payTime:'2016-10-24 19:00',
        payCash:'10000元',
        payStatus:'已支付',
      },
    ],
  };
  const filingBrokerTableProps={
    showHeader:false,
    pagination:false,
    columns:[
      {
        title: 'pic',
        dataIndex: 'pic',
        width:'180px',
        key: 'pic',
      },{
        title: 'details',
        dataIndex: 'details',
        key: 'details',
      }
    ],
    dataSource:[
      {
        pic:<div className='dx-table-pic' style={{backgroundImage:`URL(${textPic})`}}></div>,
        key:'001',
        details:'姓名：胖子 性别：男 联系电话：15120050558',
      }
    ],
  };
  const state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };
  const handleCancel=()=>{this.setState({ previewVisible: false })};
  const handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  const handleChange = ({ fileList }) => this.setState({ fileList })
  const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
  );
  //请上传电商合同和协议
  const onUploadAgreements=()=>{
    console.log('请上传电商合同和协议')
  }
  return(
    <div>
      <DxPanel title='意向项目'>
        <div>远洋山水</div>
      </DxPanel>
      <DxPanel title='客户信息'>
        <div className='dealCenter-userMsgBox-userMsg'>
          <UserMsg userMsgData={textUserMsgData}/>
        </div>
      </DxPanel>
      <DxPanel title='意向房源'>
        <div className='intentionListings'>
          <Table {...intentionListingsTableProps}/>
        </div>
      </DxPanel>
      <div className='watchAgentHouseRecord'>
      <Row>
        <Col span={6}>
          <DxPanel title='报备经纪人'>
            <div>
              <div className='dx-table-pic' style={{backgroundImage:`URL(${textPic})`}}></div>
              <div>姓名:胖子</div>
              <div>联系电话:15618546115</div>
            </div>
          </DxPanel>
        </Col>
        <Col span={18}>
          <DxPanel title='看房记录2'>
            <Timeline>
              {houseRecordTimeLineData.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
              <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
              <span className='houseRecord-content'>{item.content}</span>
              </Timeline.Item>)}
            </Timeline>
          </DxPanel>
        </Col>
      </Row>
      </div>
      <DxPanel title='已购电商优惠'>
        <div className='businessDiscount'>
          <Table {...preferentialInformation}/>
        </div>
      </DxPanel>
      <DxPanel title='团购锁定意向房源'>
        <div className='intentionListings'>
          <Table {...intentionListingsTableProps}/>
          团购锁定意向房源剩余：5天15小时
        </div>
      </DxPanel>
      <DxPanel title='请上传电商合同和协议'>
        <div className="clearfix">
          <Upload
            action="/upload.do"
            listType="picture-card"
            fileList={state.fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {state.fileList.length >= 11 ? null : uploadButton}
          </Upload>
          <Modal visible={state.previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={state.previewImage} />
          </Modal>
          <div>注：电商合同最多可上传10张，单张最大不超过2M</div>
          <div className="RemarksButton">
            <Button type="primary" onClick={onUploadAgreements}>保存</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}
UploadData.propTypes={

}

function mapStateToProps({uploadData}) {
  return {uploadData}
}

export default connect(mapStateToProps)(UploadData)
