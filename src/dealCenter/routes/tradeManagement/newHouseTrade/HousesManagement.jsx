import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Select,Table,Button,Modal}from 'antd'
const Option = Select.Option;
import UserMsg from '../../../components/UserMsg'
import DxPanel from '../../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../commons/View/PromptModal'
import './HousesManagement.css'
function HousesManagement({housesManagement,dispatch}){
  const {
    loading,
    projectId,
    projectName,
    housesInfoData,
    tableLoading,
    pageNo,
    totalElements,
    promptObj,
    modalVisible,
    selectStatus,
  }=housesManagement;
  const confirmToChange=(id,status)=>{
    if(status==='已售'){
      Modal.confirm({
        title:'提示',
        content:'该房源已经售出，确定要修改该房源的状态？',
        onOk:()=>{
          dispatch({
            type:'housesManagement/openChangeStatusModal',
            payload:{id,status,}
          });
          return false;
        }
      })
    }else{
      dispatch({
        type:'housesManagement/openChangeStatusModal',
        payload:{id,status,}
      })
    }
  }
  const houseTableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'number',
      }, {
        title: '区域',
        dataIndex: 'area',
      }, {
        title: '单元',
        dataIndex: 'unit',
      },{
        title:'楼梯类型',
        dataIndex:'stairType',
      },{
        title:"装修状况",
        dataIndex:'decoration',
      },{
        title:'楼层',
        dataIndex:"floor",
      },{
        title:'总楼层',
        dataIndex:'totalFloor',
      },{
        title:'房号',
        dataIndex:'roomNumber',
      },{
        title:'楼号',
        dataIndex:'buildingNumber',
      },{
        title:'房源类型',
        dataIndex:'housingType',
      },{
        title:'建筑面积 (㎡)',
        dataIndex:'floorArea',
      },{
        title:'销售单价 (元)',
        dataIndex:'price',
      },{
        title:'销售总价 (元)',
        dataIndex:'totalPrice',
      },{
        title:'户型',
        dataIndex:'houseTypeName',
      },{
        title:'销售状态',
        dataIndex:'state',
      },{
        title:'操作',
        render:(text,record)=>{
          return <span className='housesManagement_opreation' onClick={()=>confirmToChange(record.number,record.state)}>更新状态</span>}
      },
    ],
    dataSource:housesInfoData,
    loading:tableLoading,
    rowKey:(record)=>record.number,
    pagination:{
      showQuickJumper:true,
      total:totalElements,
      current:pageNo,
      onChange:(nextPage)=>dispatch({
        type:'housesManagement/initHousesTableData',
        payload:nextPage,
      })
    }
  }
  return(
    <div className='housesManagement'>
      <PromptModal {...promptObj} onOk={()=>dispatch({
        type:'housesManagement/closePrompt',
      })} onCancel={()=>dispatch({
        type:'housesManagement/closePrompt',
      })}/>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      <Modal title='请修改房源状态' visible={modalVisible} okText='修改状态' width={290} onOk={()=>dispatch({type:'housesManagement/doChangeHousesStatus'})} onCancel={()=>dispatch({type:'housesManagement/closeModal'})}>
        <Select style={{width:250}} value={selectStatus} onSelect={(value)=>dispatch({
            type:'housesManagement/changeSlectStatus',
            payload:value,
          })}>
          <Option value='待售'>待售</Option>
          <Option value='已售'>已售</Option>
          <Option value='锁定'>锁定</Option>
        </Select>
      </Modal>
      <DxPanel title='销控表所属项目'>
        <span>{projectName}</span>
      </DxPanel>
      <DxPanel title='销控表管理'>
        <Table {...houseTableProps}/>
      </DxPanel>
      <div style={{textAlign:'right'}}>
        <Button className='anzhu_button' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

HousesManagement.propTypes={

}
function mapStateToProps({housesManagement}) {
  return {housesManagement}
}
export default connect(mapStateToProps)(HousesManagement)
