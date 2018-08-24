import React from 'react';
import {connect} from 'dva';
import SecondNavBar from './SecondNavBar';
import TitleBar from '../../../../../commons/UI/TitleBar';
import './CheckRecord.css'
import {Table,Button} from 'antd';
function CheckRecord(){
  const columns = [{
  title: '序号',
  dataIndex: 'number',
}, {
  title: '约看时间',
  dataIndex: 'appointmentTime',
}, {
  title: '带看时间',
  dataIndex: 'seeTime',
},{
  title:'经纪人',
  dataIndex:'agent'
},{
  title:'联系电话',
  dataIndex:'phone'
},{
  title:'客户',
  dataIndex:'customer'
},{
  title:'联系电话',
  dataIndex:'customerPhone'
},{
  title:'代理经纪人',
  dataIndex:'agentBroker'
},{
  title:"联系电话",
  dataIndex:'agentPhone'
},{
  title:'状态',
  dataIndex:"status"
}];

const data = [{
  key: '1',
  number: 1,
  appointmentTime: '2016-12-12  12：22：23',
  seeTime: '2016-12-12  12：22：23',
  agent:'王小明',
  phone:'15100000000',
  customer:'王小明',
  customerPhone:'151****0000',
  agentBroker:"王小明",
  agentPhone:'15100000000',
  status:'已带看',
}, {
  key: '2',
  number: 2,
  appointmentTime: '2016-12-12  12：22：23',
  seeTime: '- -',
  agent:'王小明',
  phone:'15100000000',
  customer:'王小明',
  customerPhone:'151****0000',
  agentBroker:"王小明",
  agentPhone:'15100000000',
  status:'未带看',
}, {
  key: '3',
  number: 3,
  appointmentTime: '2016-12-12  12：22：23',
  seeTime:'- -',
  agent:'王小明',
  phone:'15100000000',
  customer:'王小明',
  customerPhone:'151****0000',
  agentBroker:"王小明",
  agentPhone:'15100000000',
  status:'房源经纪人执行“爽约”',
},{
  key: '4',
  number: 4,
  appointmentTime: '2016-12-12  12：22：23',
  seeTime:'- -',
  agent:'王小明',
  phone:'15100000000',
  customer:'王小明',
  customerPhone:'151****0000',
  agentBroker:"王小明",
  agentPhone:'15100000000',
  status:'房源经纪人执行“爽约”',
},{
  key: '5',
  number: 5,
  appointmentTime: '2016-12-12  12：22：23',
  seeTime: '2016-12-12  12：22：23',
  agent:'王小明',
  phone:'15100000000',
  customer:'王小明',
  customerPhone:'151****0000',
  agentBroker:"王小明",
  agentPhone:'15100000000',
  status:'已带看',
}];
const handleAll=()=>{
console.log("全部")
}
const alreadySee=()=>{
console.log("已带看")
}
const notSee=()=>{
console.log("未带看")
}
const miss=()=>{
console.log("爽约")
}
const handleBack=()=>{
  console.log("返回")
}
const pagination={
  showQuickJumper:true
}
  return(
    <div>
      <SecondNavBar/>
      <hr className="splitLine"/>
      <Table
        pagination={pagination}
        columns={columns}
        dataSource={data}
        bordered
        title={() =><div><Button type='primary' onClick={handleAll}>全部</Button><Button type='primary' onClick={alreadySee}>已带看</Button><Button type='primary' onClick={notSee}>未带看</Button><Button type='primary' onClick={miss}>爽约</Button></div>}
      />
      <Button type="primary" onClick={handleBack}>返回</Button>
    </div>
  )
}

function mapStateToProps({main}){
  return{main}
}
export default connect(mapStateToProps)(CheckRecord);
