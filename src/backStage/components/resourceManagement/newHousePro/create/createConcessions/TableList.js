import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';

import { Table, Button } from 'antd';
function TableList({delLoading,
                    selectedRowKeys,
                    onSelectChange,
                    total,
                    changeDelLoading,
                    changeEditVisible,//更改编辑的modal Visible
                    pageSize}){
  const editItem=(record)=>{
    changeEditVisible(record,true);
    console.log('e.target>>>record',record);
    //在此修改数据提交到后台
    //弹出修改模态框
  };
	const columns = [{
    title: '序号',
    dataIndex: 'xh',
  }, {
    title: '优惠名称',
    dataIndex: 'yhmc',
  }, {
    title: '优惠金额',
    dataIndex: 'yhje',
  }, {
    title: '所需金额',
    dataIndex: 'sxje',
  }, {
    title: '活动有效期',
    dataIndex: 'hdyxq',
  }, {
    title: '适用类型',
    dataIndex: 'sylx',
  }, {
    title: '团购锁定房源(天)',
    dataIndex: 'tgsdfy',
  }, {
    title: '创建时间',
    dataIndex: 'cjsj',
  },{
    title:'操作',
    render:(text, record) => {
      // console.log('>>>>>>>>>>!!!!',text,record);
      return (
        <span>
          <a style={{color:'#5DCEE0'}} onClick={()=>editItem(record)}>编辑</a>
        </span>
      )
    }
  }];
  //模拟数据
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      xh: i,
      yhmc: '5万低10万',
      yhje: 8*i+'万',
      sxje:'5万',
      hdyxq:'2010-10-24 24:00:00',
      sylx:'100㎡-200㎡',
      tgsdfy:88,
      cjsj:'2010-10-24 24:00:00',
    });
  }
  const deleteData=()=>{
		console.log('in deleteData',selectedRowKeys);
		// dispath向服务器删除该条数据,并且初始化数据?
    changeDelLoading(true);
    setTimeout(() => {
      changeDelLoading(false);
    }, 3000);

	};
  const rowSelection = {
    selectedRowKeys,
    onChange:onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const pagination={
  	total:total,
    showTotal:total => `共 ${total} 项`,
    pageSize:pageSize,
    defaultCurrent:1,
    onChange:(page)=>{
    	//dispatch到后台配置page参数,分页拉取数据;
    	console.log('page>>>',page);
    }
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
        	type="primary" 
        	onClick={deleteData}
          disabled={!hasSelected} 
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
      	dataSource={data}
      	pagination={pagination}
    	/>
    </div>
  );
}
TableList.propTypes = {
  delLoading: PropTypes.bool,
  selectedRowKeys: PropTypes.array,
  onSelectChange: PropTypes.func,
  total: PropTypes.number,
  pageSize: PropTypes.number,
};
export default TableList;
