import React from 'react'
import {connect} from 'dva'
import {Button, Table,Radio} from 'antd'

function Report(){
  const columns = [{
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '报备经济人',
      dataIndex: 'recordAgentBroker',
      key: 'recordAgentBroker',
    }, {
      title: '报备客户',
      dataIndex: 'recordCustomer',
      key: 'recordCustomer',
    },{
      title:'客户手机号',
      dataIndex:'customerPhone',
      key:'customerPhone'
    },{
      title:'性别',
      dataIndex:'gender',
      key:'gender'
    },{
      title:'报备时间',
      dataIndex:'recordTime',
      key:'recordTime'
    },{
      title:'预约看房时间',
      dataIndex:'seeHouseTime',
      key:'seeHouseTime'
    },{
      title:'业务类型',
      dataIndex:'propertyType',
      key:'propertyType'
    },{
      title:'意向房源',
      dataIndex:'wantHouseResource',
      key:'wantHouseResource'
    },{
      title:'状态',
      dataIndex:'state',
      key:'state'
    }];
  const data = [{
      key: '1',
      number: 1,
      recordAgentBroker: '胖子',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:'成功'
    }, {
      key: '2',
      number: 2,
      recordAgentBroker: '胖子',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:'成功'
    }, {
      key: '3',
      number: 3,
      recordAgentBroker: '胖子',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:'成功'
    },{
      key: '4',
      number: 4,
      recordAgentBroker: '赵三',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:'成功'
    },{
      key: '5',
      number: 5,
      recordAgentBroker: '李四',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:'成功'
    },{
      key: '6',
      number: 6,
      recordAgentBroker: '王五',
      recordCustomer: '黄林枫',
      customerPhone:'151*****0558',
      gender:'男',
      recordTime:'06-10 19:00',
      seeHouseTime:'06-10 19:00',
      propertyType:'普通住宅',
      wantHouseResource:'A区域/1号楼/1单元/1003室',
      state:<div>失败<Button type='primary'>驳回理由</Button></div>
    }];
  const onStateChange=(e)=>{
    console.log(`radio checked:${e.target.value}`)
  }
  return(
    <div>
      <div className="state">
        状 &nbsp; &nbsp;&nbsp;&nbsp; 态 :
        <RadioGroup onChange={onStateChange} >
          <RadioButton value="成功">成功</RadioButton>
          <RadioButton value="失败">失败</RadioButton>
        </RadioGroup>
      </div>
      <div className="table">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default connect()(Report)
