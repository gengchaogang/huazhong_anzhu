import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';

import { Table, Button } from 'antd';
function TableList({
                    resultData,
                    projectId,
                    reEdit,
                    current,
                    dispatch,
                    concessionsId,
                    delLoading,
                    selectedRowKeys,
                    // onSelectChange,
                    totalElements,
                    changeDelLoading,
                    changeEditVisible,//更改编辑的modal Visible
                    pageSize}){
  const editItem=(record)=>{
    if(!reEdit){
      changeEditVisible(record,true);
      dispatch({
        type:"createProjectConcessions/changeKey",
        payload:{
          concessionsId:record.key
        }
      })
      dispatch({
        type:'createProjectConcessions/searchOneData',
        payload:{
          projectId:projectId,
          id:record.key,
        }
      })
      //在此修改数据提交到后台
      //弹出修改模态框
    }
  };
	const columns = [{
    title: '序号',
    dataIndex: 'number',
  }, {
    title: '优惠名称',
    dataIndex: 'name',
  }, {
    title: '优惠金额',
    dataIndex: 'originalPrice',
  }, {
    title: '所需金额',
    dataIndex: 'price',
  }, {
    title: '活动有效期',
    dataIndex: 'validDate',
  }, {
    title: '适用类型',
    dataIndex: 'houseType',
  }, {
    title: '团购锁定房源(天)',
    dataIndex: 'holdDays',
  }, {
    title: '创建时间',
    dataIndex: 'createDateTime',
  },{
    title:'操作',
    render:(text, record) => {
      return (
        <span>
          {!reEdit && <a style={{color:'#5DCEE0'}} onClick={()=>editItem(record)}>编辑</a>}
        </span>
      )
    }
  }];
  const deleteData=()=>{
		// dispath向服务器删除该条数据,并且初始化数据?
    dispatch({
      type:"createProjectConcessions/deleteIds",
      payload:{
        ids:selectedRowKeys,
      }
    })
    dispatch({
      type:"createProjectConcessions/clearSelectedRowKeys"
    })
	};
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
        type:'createProjectConcessions/modifySelect',
        payload:selectedRowKeys
      })
    }
  const rowSelection = {
    selectedRowKeys,
    onChange:onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const pagination={
  	total:totalElements,
    showTotal:total=> `共 ${total} 项`,
    defaultCurrent:1,
    onChange:(page)=>{
    	//dispatch到后台配置page参数,分页拉取数据;
      dispatch({
        type:"createProjectConcessions/changePage",
        payload:{
          pageNo:page,
          pageSize:10,
          projectId:projectId,
        }
      })
    }
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
        	type="primary"
        	onClick={deleteData}
          disabled={reEdit || !hasSelected}
          loading={delLoading}
        >
        	删除
        </Button>
        <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}</span>
      </div>
      <Table
      	bordered
      	rowSelection={rowSelection}
      	columns={columns}
      	dataSource={resultData}
      	pagination={pagination}
    	/>
    </div>
  );
}
TableList.propTypes = {
  delLoading: PropTypes.bool,
  selectedRowKeys: PropTypes.array,
  total: PropTypes.number,
  pageSize: PropTypes.number,
};
export default TableList;
