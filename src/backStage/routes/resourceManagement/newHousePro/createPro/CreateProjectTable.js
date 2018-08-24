import React from 'react'
import {connect} from 'dva'
import TitleBar from '../../../../../commons/UI/TitleBar'
import './CreateProjectTable.css'
import {Button,Table,Row,Col} from 'antd'
import TableList from "../../../../components/resourceManagement/newHousePro/create/createConcessions/TableList"
function CreateProjectTable({CreateProjectTable,dispatch,next,prev}){
  const { loading, selectedRowKeys } =CreateProjectTable;
  const columns = [{
  title: '序号',
  dataIndex: 'number',
  render: text => <span>{text}</span>,
}, {
  title: '区域',
  dataIndex: 'area',
}, {
  title: '单元',
  dataIndex: 'unit',
},{
  title:'楼梯类型',
  dataIndex:'stairType'
},{
  title:'楼层',
  dataIndex:"floor"
},{
  title:'房号',
  dataIndex:'houseNumber'
},{
  title:'房屋属性',
  dataIndex:'houseProps'
},{
  title:'建筑面积 (㎡)',
  dataIndex:'buildArea'
},{
  title:'销售单价 (元)',
  dataIndex:'salePrice'
},{
  title:'销售总价 (元)',
  dataIndex:'saleTotal'
},{
  title:'户型',
  dataIndex:'houseType'
},{
  title:'销售状态',
  dataIndex:'saleType'
},{
  title:'操作',
  dataIndex:'operation',
    colSpan:8
},{
  title:'',
  dataIndex:'delete'
}];
const test=()=>{
  console.log("aaaaaa")
}
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    number: `Edward King ${i}`,
    area: "A",
    unit: 1,
    stairType:'步梯楼',
    floor:'1/5',
    houseNumber:'1001',
    houseProps:'仓库',
    buildArea:"100",
    salePrice:'100',
    saleTotal:"100",
    houseType:'A户型',
    saleType:'在售',
    operation:<Button type="primary" onClick={test}>编辑</Button>,
    delete:<Button type="primary">删除</Button>,
  });
}
// rowSelection object indicates the need for row selection
const hasSelected = selectedRowKeys.length > 0;
const onSelectChange=(selectedRowKeys)=>{
  dispatch({
    type:'CreateProjectTable/modifySelect',
    payload:selectedRowKeys
  })
}
const rowSelection = {
  selectedRowKeys,
  onChange:onSelectChange,
};
const pagination={
  showQuickJumper:true
}

const start=()=>{
  console.log("a")
  dispatch({
    type:'CreateProjectTable/modifyLoading'
  });
  setTimeout(() => {
      dispatch({
        type:'CreateProjectTable/modifyBoth'
      })
    }, 1000);
}
  return(
    <div className="CreateProjectTable">
      <TitleBar title="项目销控表"/>
      <Row gutter={8}>
        <Col span={18}></Col>
        <Col span={6}>
          <Button type="primary">上传新房销控表</Button>
          <Button type="primary">下载新房销控表模板</Button>
        </Col>
      </Row>
      <div style={{ marginBottom: 16 }}>
          <Button type='primary'>绑定户型</Button>
          <Button type="primary" onClick={start}
            disabled={!hasSelected} loading={loading}
          >删除房源</Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
        </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
      <Button type="primary" onClick={prev}>返回上一步</Button><Button type="primary" onClick={next}>下一步创建电商优惠</Button>
    </div>
  )
}



function mapStateToProps({ CreateProjectTable }) {
  return { CreateProjectTable }
}
export default connect(mapStateToProps)(CreateProjectTable);
