import React, { PropTypes } from 'react'
import {Table,Modal,Form, Icon, Input, Button,Radio,Select   } from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import './InventoryControl.css'

function InventoryControl({dispatch,inventoryControl}){
  const showModal=()=>{
    dispatch({
      type:'inventoryControl/doCollapse'
    })
  }
  const handleOk=()=> {
    console.log('Clicked OK');
    dispatch({
      type:'inventoryControl/handleOk'
    })
  }
  const handleCancel=(e)=> {
    console.log(e);
    dispatch({
      type:'inventoryControl/handleCancel'
    })
  }
  const columns = [{
  title: '序号',
  dataIndex: 'number',
  }, {
    title: '区域',
    dataIndex: 'area',
  }, {
    title: '单元',
    dataIndex: 'unit',
  }, {
    title: '楼梯类型',
    dataIndex: 'stairType',
  }, {
    title: '楼层',
    dataIndex: 'floor',
  }, {
    title: '房号',
    dataIndex: 'roomNumber',
  }, {
    title: '房屋属性',
    dataIndex: 'housingProperty',
  }, {
    title: '建筑面积（㎡）',
    dataIndex: 'builtupArea',
  }, {
    title: '销售单价（元）',
    dataIndex: 'salePrice',
  }, {
    title: '销售总价（万）',
    dataIndex: 'saleTotal',
  }, {
    title: '户型',
    dataIndex: 'apartmentLayout',
  }, {
    title: '销售状态',
    dataIndex: 'salesStatus',
  }, {
    title: '操作',
    dataIndex:'operation' ,
    render:text=> <div>
                      <span onClick={showModal} className='newhousedeal-operation newhousedeal-edit'>编辑</span>
                      <span onClick={clickWatch} className='newhousedeal-operation'>查看</span>
                  </div>,
  }];
  const data = [
    {
      key:'001',
      number:1,
      area:'A',
      unit:1,
      stairType:"步楼梯",
      floor:"1/5",
      roomNumber:"1001",
      housingProperty:"仓库",
      builtupArea:"100",
      salePrice:"100",
      saleTotal:"100",
      apartmentLayout:"A户型",
      salesStatus:"在售",
    },{
      key:'002',
      number:1,
      area:'A',
      unit:1,
      stairType:"步楼梯",
      floor:"1/5",
      roomNumber:"1001",
      housingProperty:"仓库",
      builtupArea:"100",
      salePrice:"100",
      saleTotal:"100",
      apartmentLayout:"A户型",
      salesStatus:"在售",
    },
  ];
  const clickWatch=()=>{
    console.log("查看");
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    }
  };
  const FormItem = Form.Item;
  const Option = Select.Option;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary">Reload</Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
      <Modal title="房源编辑" visible={inventoryControl.inventoryControlModal}
          onOk={handleOk} onCancel={handleCancel} className="houseEidt"
        >
          <Form>
            <FormItem>
              <div>房源信息</div>
              <Select size="large" defaultValue="请选择" style={{ width: 200 }}>
                <Option value="普通住宅">普通住宅</Option>
                <Option value="别墅">别墅</Option>
                <Option value="商铺">商铺</Option>
                <Option value="经济适用房">经济适用房</Option>
                <Option value="写字楼">写字楼</Option>
                <Option value="车库">车库</Option>
                <Option value="公寓">公寓</Option>
              </Select>
            </FormItem>
            <FormItem>
              <div>区</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>楼号</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>单元</div>
              <Input placeholder="请在此输入房源所在单元号" />
            </FormItem>
            <FormItem>
              <div>楼梯类型</div>
              <Select size="large" defaultValue="请选择" style={{ width: 200 }}>
                <Option value="步楼梯">步楼梯</Option>
                <Option value="电楼梯">电楼梯</Option>
              </Select>
            </FormItem>
            <FormItem>
              <div>楼层</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>总楼层</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>房号</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>装修状况</div>
              <Select size="large" defaultValue="请选择" style={{ width: 200 }}>
                <Option value="毛坯">毛坯</Option>
                <Option value="简装">简装</Option>
                <Option value="精装">精装</Option>
              </Select>
            </FormItem>
            <FormItem>
              <div>建筑面积</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>销售单价</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>销售总价</div>
              <Input/>
            </FormItem>
            <FormItem>
              <div>所属户型</div>
              <Select size="large" defaultValue="请选择" style={{ width: 200 }}>
                <Option value="A户型">A户型</Option>
                <Option value="B户型">B户型</Option>
                <Option value="C户型">C户型</Option>
                <Option value="D户型">D户型</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Radio.Group>
                <Radio value="代售">代售</Radio>
                <Radio value="锁定">锁定</Radio>
                <Radio value="已售">已售</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
      </Modal>
    </div>
  )
}
InventoryControl.propTypes={

}
function mapStateToProps({inventoryControl}) {
  return {inventoryControl}
}
export default connect(mapStateToProps)(InventoryControl)
