import React,{ PropTypes }from 'react'
import {Table,Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
function HouseRecord(props){
  const {
    totalElements,
    tableLoading,
    tableData,
    handleAll,
    alreadySee,
    notSee,
    miss,
    onPageChange,
  }=props;
  console.log('tableLoading',tableLoading);
  const columns = [{
      title: '序号',
      dataIndex: 'number',
    }, {
      title: '约看时间',
      dataIndex: 'appointmentTime',
    }, {
      title: '带看时间',
      dataIndex: 'guideTime',
    },{
      title:'经纪人',
      dataIndex:'customerBrokerName'
    },{
      title:'联系电话',
      dataIndex:'customerBrokerPhone'
    },{
      title:'客户',
      dataIndex:'customerName'
    },{
      title:'联系电话',
      dataIndex:'customerPhone'
    },{
      title:'代理经纪人',
      dataIndex:'houseBrokerName'
    },{
      title:"联系电话",
      dataIndex:'houseBrokerPhone'
    },{
      title:'状态',
      render:(text,record,index)=>{
        if(record.status==="等待带看"){
          return(<span>未带看</span>)
        }else if(record.status==='带看成功'){
          return(<span>已带看</span>)
        }else{
          return(<span>带看失败</span>)
        }
      }
  }];
  const pagination={
    showQuickJumper:true,
    total:totalElements,
    showTotal:()=>{return `共 ${totalElements} 项`},
    pageSize:10,
    onChange:(page)=>{
      onPageChange(page)
    }
  }
  const searchAll=()=>{
  handleAll()
  }
  const searchSeen=()=>{
  alreadySee()
  }
  const notToSee=()=>{
  notSee()
  }
  const missTo=()=>{
  miss()
  }
  return(
    <DxPanel title="带看记录">
      <Table
        loading={tableLoading}
        pagination={pagination}
        columns={columns}
        dataSource={tableData}
        title={() =><div className="details_buttons"><Button type='primary' onClick={searchAll}>全部</Button><Button type='primary' onClick={searchSeen}>已带看</Button><Button type='primary' onClick={notToSee}>未带看</Button><Button type='primary' onClick={missTo}>爽约</Button></div>}
      />
    </DxPanel>
  )
}
HouseRecord.propTypes = {
  // detailsData: PropTypes.object.isRequired,
  // type:PropTypes.string.isRequired,
};
export default HouseRecord
