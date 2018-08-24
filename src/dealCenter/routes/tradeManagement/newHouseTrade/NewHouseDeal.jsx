import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button,Icon,Table,Tabs,Popover,Modal,Input,Row, Col,Card,Select}from 'antd'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../../commons/View/SearchInput'

//
import './NewHouseDeal.css'

//模拟图片数据
import textPic from '../../../assets/yay.jpg'

const NewHouseDeal = ({ children, location, dispatch,newHouseDeal}) => {
  const currentProject='远洋山水';
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/tradeManagement/newHouseTrade/${path}`,
      }));
    }
  }


  const searchInputProps={
    type:'button',
    placeholder:'请在此输入项目名称或所在区域名称进行搜索',
    searchFuc:(value)=>{console.log('搜索value',value)},
  }
  //表格上方tag切换回调
  const tableTagOnChange=()=>{

  }
  //设置模拟数据
  //已报备
  const hasReportedTablePropsData=[];
  for (let i = 0; i < 50; i++) {
    hasReportedTablePropsData.push({
      key: i,
      serialNumber:i,
      filingBroker: `名字 ${i}`,
      reportCustomer: `名字22 ${i}`,
      customerPhoneNumber: '120533253555',
      Gender: '男',
      reportTime: '06-10 19:00',
      bookingRoomTime: '06-20 19:00',
      propertyType: '普通住宅',
      intentionHousingResources: 'A区域/1号楼/1单元/1003室',
      status: '带看房',
      operation: '业务办理',
    });
  }
  const showModal=()=>{
    dispatch({
      type:'newHouseDeal/doCollapse'
    })
  }
  const handleOk=()=>{
    dispatch({
      type:'newHouseDeal/handleOk'
    })
  }
  const handleCancel=()=>{
    dispatch({
      type:'newHouseDeal/handleCancel'
    })
  }
  const showModalRefind=()=>{
    dispatch({
      type:'newHouseDeal/hanleRefund'
    })
  }
  const handleRefundOk=()=>{
    dispatch({
      type:'newHouseDeal/handleRefundOk'
    })
  }
  const handleRefundCancel=()=>{
    dispatch({
      type:'newHouseDeal/handleRefundCancel'
    })
  }
  const hasReportedTablePropsPopoverContent=<div>
    <p className='newhousedeal-operation-item' onClick={showModal}>驳回看房</p>
    <p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook')}>处理看房</p>
    <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy')}>办理团购</p>
  </div>
  const hasReportedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      }, {
        title: '报备经纪人',
        dataIndex: 'filingBroker',
      }, {
        title: '报备客户',
        dataIndex: 'reportCustomer',
      },{
        title: '客户手机号',
        dataIndex: 'customerPhoneNumber',
      },{
        title:'性别',
        dataIndex:'Gender',
      },{
        title:'报备时间',
        dataIndex:'reportTime',
      },{
        title:'预约看房时间',
        dataIndex:'bookingRoomTime',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'状态',
        dataIndex:'status',
        sorter: (a, b) => a- b,
      },{
        title:'操作',
        dataIndex:'operation',
        render:text=><div>
           <Popover placement='bottom' content={hasReportedTablePropsPopoverContent} title={false} trigger="click">
             <span className='newhousedeal-operation'>业务办理</span>
           </Popover>
        </div>,
      }
    ],
    dataSource:hasReportedTablePropsData,
    pagination:{
      total: hasReportedTablePropsData.length,
      onShowSizeChange: (current, pageSize) => {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange: (current) => {
        console.log('Current: ', current);
      },
      showQuickJumper:true,
    },
  }
  //已确看
  const hasConfirmedTablePropsPopoverContent=<div>
    <p className='newhousedeal-operation-item' onClick={()=>routePush('customerDoLook')}>处理确看</p>
    <p className='newhousedeal-operation-item' onClick={()=>routePush('creatGroupBuy')}>办理团购</p>
  </div>
  const hasConfirmedTablePropsData=[];
  for (let i = 0; i < 50; i++) {
    hasConfirmedTablePropsData.push({
      key: i,
      serialNumber:i,
      agent: `名字 ${i}`,
      customer: `名字22 ${i}`,
      agentPhoneNumber: '120533253555',
      customerPhoneNumber: '120533253555',
      protectionPeriod: '剩余30天',
      houseStatus: '已确看',
      houseTime: '06-20 19:00',
      propertyType: '普通住宅',
      intentionHousingResources: 'A区域/1号楼/1单元/1003室',
      operation: '业务办理',
    });
  }
  const hasConfirmedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      }, {
        title: '带看经纪人',
        dataIndex: 'agent',
      }, {
        title: '经纪人电话',
        dataIndex: 'agentPhoneNumber',
      },{
        title: '确看客户',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'客户保护期',
        dataIndex:'protectionPeriod',
        sorter: (a, b) => a- b,
      },{
        title:'看房状态',
        dataIndex:'houseStatus',
      },{
        title:'看房时间',
        dataIndex:'houseTime',
      },{
        title:'操作',
        dataIndex:'operation',
        render:text=><div>
           <Popover placement='bottom' content={hasConfirmedTablePropsPopoverContent} title={false} trigger="click">
             <span className='newhousedeal-operation'>业务办理</span>
           </Popover>
           <span className='newhousedeal-operation' onClick={()=>routePush('doLookDetails')}>确看记录</span>
        </div>,
      }
    ],
    dataSource:hasConfirmedTablePropsData,
    pagination:{
      total: hasConfirmedTablePropsData.length,
      onShowSizeChange: (current, pageSize) => {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange: (current) => {
        console.log('Current: ', current);
      },
      showQuickJumper:true,
    },
  }
  //已团购
  const hasGroupPurchaseTablePropsPopoverContent=<div>
    <p className='newhousedeal-operation-item' onClick={()=>routePush('creatTransactions')}>办理成交</p>
    <p className='newhousedeal-operation-item' onClick={showModalRefind}>团购退款</p>
  </div>
  const hasGroupPurchaseTablePropsData=[];
  for (let i = 0; i < 50; i++) {
    hasGroupPurchaseTablePropsData.push({
      key: i,
      serialNumber:i,
      customer: `名字22 ${i}`,
      customerPhoneNumber: '120533253555',
      hasGroupBuy: '1万抵10万',
      houseStatus: '已确看',
      groupBuyTime: '06-20 19:00',
      propertyType: '普通住宅',
      status:'已团购 未上传协议',
      groupBuyAmount:'10000元',
      intentionHousingResources: 'A区域/1号楼/1单元/1003室',
      operation:{
        shouldBandle:i%2==0,
        hasAgreement:i%3==0,
      },
    });
  }
  const hasGroupPurchaseTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },{
        title: '客户姓名',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        sorter: (a, b) => a- b,
      },{
        title:'意向房源',
        dataIndex:'intentionHousingResources',
      },{
        title:'已购团购',
        dataIndex:'hasGroupBuy',
        sorter: (a, b) => a- b,
      },{
        title:'团购时间',
        dataIndex:'groupBuyTime',
      },{
        title:'团购金额',
        dataIndex:'groupBuyAmount',
      },{
        title:'状态',
        dataIndex:'status',
      },{
        title:'操作',
        dataIndex:'operation',
        render:obj=><div>
           {obj.shouldBandle && <Popover placement='bottom' content={hasGroupPurchaseTablePropsPopoverContent} title={false} trigger="click">
             <span className='newhousedeal-operation'>业务办理</span>
           </Popover>}
           <span className='newhousedeal-operation' onClick={()=>routePush(obj.hasAgreement?'groupBuyDetails':'uploadData')}>
             {obj.hasAgreement?'详情':'补交协议'}</span>
        </div>,
      }
    ],
    dataSource:hasGroupPurchaseTablePropsData,
    pagination:{
      total: hasGroupPurchaseTablePropsData.length,
      onShowSizeChange: (current, pageSize) => {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange: (current) => {
        console.log('Current: ', current);
      },
      showQuickJumper:true,
    },
  }
  //已成交
  const hasTradedTablePropsData=[];
  for (let i = 0; i < 50; i++) {
    hasTradedTablePropsData.push({
      key: i,
      serialNumber:i,
      agent: `名字 ${i}`,
      customer: `名字22 ${i}`,
      customerPhoneNumber: '120533253555',
      dealHousingResources: 'A区域/1单元/1层/103室',
      houseStatus: '已确看',
      dealTime: '06-20 19:00',
      dealType: '普通住宅',
      dealStatus:'已成交 成交待审核',
      dealDiscount:'1万抵10万',
      dealAmount:'均价30000元/㎡ 总价300万',
      operation:{
        shouldBandle:i%2==0,
        hasAgreement:i%3==0,
      },
    });
  }
  const hasTradedTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'serialNumber',
      },{
        title: '带看经纪人',
        dataIndex: 'agent',
      },{
        title: '客户姓名',
        dataIndex: 'customer',
      },{
        title:'联系电话',
        dataIndex:'customerPhoneNumber',
      },{
        title:'成交类型',
        dataIndex:'dealType',
        sorter: (a, b) => a- b,
      },{
        title:'成交房源',
        dataIndex:'dealHousingResources',
      },{
        title:'成交时间',
        dataIndex:'dealTime',
      },{
        title:'成交优惠',
        dataIndex:'dealDiscount',
      },{
        title:'成交金额',
        dataIndex:'dealAmount',
      },{
        title:'成交状态',
        dataIndex:'dealStatus',
        sorter: (a, b) => a- b,
      },{
        title:'操作',
        dataIndex:'operation',
        render:text=><span className='newhousedeal-operation' onClick={()=>routePush('dealDetails')}>详情</span>,
      }
    ],
    dataSource:hasTradedTablePropsData,
    pagination:{
      total: hasTradedTablePropsData.length,
      onShowSizeChange: (current, pageSize) => {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange: (current) => {
        console.log('Current: ', current);
      },
      showQuickJumper:true,
    },
  }

  const preferentialInformation={
    columns:[
      {
        title: '退款类型',
        dataIndex: 'refindPic',
        key: 'refindPic',
      },
      {
        title: '支付项目',
        dataIndex: 'paymentItems',
        key: 'paymentItems',
      },
      {
        title: '订单订单',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
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
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
      },
    ],
    dataSource:[
      {
        key:'001',
        refindPic:"电商团购",
        paymentItems:"远洋山水",
        orderNumber:332005469041,
        payAway:"POS机支付/工商银行",
        paySerialNumber:65535,
        payCustomer:"张三",
        customerPhone:"15120050558",
        payTime:"2016-10-24 19:00",
        payCash:"10000元",
        payStatus:"已支付",
        operation:"交易详情"
      },
    ],
  };

  return (
    <div className='newhousedeal'>
      <div className='newhousedeal-panel'>
        <div className='newhousedeal-sortBox'>
          <div className='newhousedeal-sortBox-left'>
            <Select defaultValue='currentProject' placeholder='请选择项目' style={{ width:'100%' }} allowClear disabled>
              <Option value='currentProject'>{`当前项目：${currentProject}`}</Option>
            </Select>
          </div>
          <div className='newhousedeal-sortBox-right'>
            <SearchInput {...searchInputProps}/>
          </div>
        </div>
        <div className='newhousedeal-operatingArea'>
          <Row type='flex' justify='space-between'>
            <Col span={4}>
              <Card onClick={(e,id)=>routePush('creatClient')}>
                录客户
              </Card>
            </Col>
            <Col span={4}>
              <Card onClick={(e,id)=>routePush('creatGroupBuy')}>
                录团购
              </Card>
            </Col>
            <Col span={4}>
              <Card onClick={(e,id)=>routePush('creatTransactions')}>
                录成交
              </Card>
            </Col>
            <Col span={4}>
              <Card onClick={(e,id)=>routePush('projectDetails')}>
                项目详情
              </Card>
            </Col>
            <Col span={4}>
              <Card onClick={(e,id)=>routePush('inventoryControl')}>
                房源销控
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div className='newhousedeal-panel newhousedeal-main'>
        <Tabs onChange={tableTagOnChange} type="card">
          <TabPane tab='已报备' key='hasReported'>
            <Table className='newhousedeal-table' {...hasReportedTableProps} />
          </TabPane>
          <TabPane tab='已确看' key='hasConfirmed'>
            <Table className='newhousedeal-table' {...hasConfirmedTableProps} />
          </TabPane>
          <TabPane tab='已团购' key='hasGroupPurchase'>
            <Table className='newhousedeal-table' {...hasGroupPurchaseTableProps} />
          </TabPane>
          <TabPane tab='已成交' key='hasTraded'>
            <Table className='newhousedeal-table' {...hasTradedTableProps} />
          </TabPane>
          <TabPane tab='已爽约' key='hasMiss'>
            <Table className='newhousedeal-table' {...hasTradedTableProps} />
          </TabPane>
          <TabPane tab='已撤回' key='hasRevoke'>
            <Table className='newhousedeal-table' {...hasTradedTableProps} />
          </TabPane>
        </Tabs>

      </div>
      {/*以下为驳回理由的模态框*/}
      <Modal title="驳回理由" visible={newHouseDeal.RejectModelStatus}
        onOk={handleOk} onCancel={handleCancel} okText="提交"
        >
        <p>请输入驳回理由</p>
        <Input type="textarea" placeholder="请输入驳回理由，文字不超过五十个字符"
          maxLength={50} autosize={{ minRows: 2, maxRows: 6 }}
        />
      </Modal>
      {/*以下为团购退款的模态框*/}
      <Modal title="电商团购-退款申请"
        visible={newHouseDeal.RefundModelStatus}
        onOk={handleRefundOk} onCancel={handleRefundCancel} okText="提交退款"
        >
        <p>订单信息</p>
        <Table {...preferentialInformation} pagination={false}/>
        <p>退款理由</p>
        <Input type="textarea" placeholder="请在此输入退款理由"
          autosize={{ minRows: 2, maxRows: 6 }}
        />
      </Modal>
    </div>
  )
}

NewHouseDeal.propTypes = {
  newHouseDeal: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({newHouseDeal}) {
  return {newHouseDeal}
}

export default connect(mapStateToProps)(NewHouseDeal)
