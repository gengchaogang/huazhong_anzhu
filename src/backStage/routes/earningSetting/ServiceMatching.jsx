import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Modal,Input,Table,Button,InputNumber} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import './ServiceMatching.css'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
function ServiceMatching({dispatch,serviceMatching,form }) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {dataSource,loading,total,
    keyWord,
    name,
    id,
    pageNo,
    programmeModalStatus,
    brokerageVisible,
    countyAgency,
    cityAgency,
    tradingCenter,
    provinceAgency,
    platform,
    eidtStatus,
  }=serviceMatching;
  const totalRatio=
    countyAgency+
    cityAgency+
    tradingCenter+
    provinceAgency+
    platform;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'服务费方案名称',
      dataIndex:'name',
    },
    {
      title:'平台',
      dataIndex:'platform',
    },
    {
      title:'省级代理',
      dataIndex:'provinceAgency',
    },
    {
      title:'市级代理',
      dataIndex:'cityAgency',
    },
    {
      title:'区县代理',
      dataIndex:'countyAgency',
    },
    {
      title:'交易中心',
      dataIndex:'tradingCenter',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{eidtAllocation(record.key)}}>编辑</span>
        <span className='operationColor' onClick={()=>{deletAllocation(record.key)}}>删除</span>
      </div>
    },
  ]
  const deletAllocation=(key)=>{
    Modal.confirm({
			title: '提示',
			content: '确认要删佣金配比方案吗？',
			okText: '确定',
			cancelText: '取消',
			onOk:()=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{loading:true}
				})
				dispatch({
					type:'serviceMatching/deletAllocation',
					payload:{
						id:key,
					}
				})
			}
		});
  }
  //编辑
  const eidtAllocation=(key)=>{
    dispatch({
      type:'serviceMatching/initail',
      payload:{
        eidtStatus:true,
        programmeModalStatus:true,
      }
    })
    dispatch({
      type:'serviceMatching/editBeforeSaerch',
      payload:{
        id:key,
      }
    })
  }
  //分页
  const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		current:pageNo,
		onChange:(page)=>{
			dispatch({type:'serviceMatching/initail',
				payload:{loading:true}
			})
			dispatch({
				type:'serviceMatching/pageOnchange',
				payload:{
					pageNo:page,
          name:keyWord,
				}
			})
		}
	};
  //搜索
  const searchServiceMatching=()=>{
    form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
      dispatch({
  			type:'serviceMatching/initail',
  			payload:{loading:true}
  		})
			dispatch({
				type:'serviceMatching/searchService',
				payload:{
					name:values.keyWord,
				}
			})
		});
  }
  const handleReset=()=>{
		form.resetFields();
		dispatch({
			type:'serviceMatching/initail',
			payload:{loading:true}
		})
		dispatch({
			type:'serviceMatching/findAllintail',
		})
		//初始化到初始状态
	};
  const createProgramme=()=>{
    dispatch({
      type:'serviceMatching/initail',
      payload:{
        programmeModalStatus:true,
      }
    })
  }
  const programmeOnOk=()=>{
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type:'serviceMatching/initail',
        payload:{loading:true}
      })
      if(!!id){
        dispatch({
          type:'serviceMatching/editProgramme',
          payload:{
            id:id,
            name:values.name,
            countyAgency:values.countyAgency,
            cityAgency:values.cityAgency,
            tradingCenter:values.tradingCenter,
            provinceAgency:values.provinceAgency,
            platform:values.platform,
          }
        })
      }else{
        dispatch({
          type:'serviceMatching/addProgramme',
          payload:{
            name:values.name,
            countyAgency:values.countyAgency,
            cityAgency:values.cityAgency,
            tradingCenter:values.tradingCenter,
            provinceAgency:values.provinceAgency,
            platform:values.platform,
          }
        })
      }
      form.resetFields();
		});
  }
  const programmeOnCancel=()=>{
    form.resetFields();
    dispatch({
      type:'serviceMatching/initail',
      payload:{
        programmeModalStatus:false,
        eidtStatus:false,
        loading:false,
        id:'',
        cityAgency:0,
        countyAgency:0,
        name:'',
        platform:0,
        provinceAgency:0,
        tradingCenter:0,
      }
    })
  }
  const fangcolumns=[
		{
			title:'组成项目',
			dataIndex:'itemName',
		},{
		  title:'比例',
			dataIndex:'ratio',
			render:(text,record)=>{
		  	switch (record.itemName){
					case '总计':
						return(
							<span>{record.ratio}%</span>
						);
					default:
						return(
							<FormItem>
								{getFieldDecorator(record.ratioName, {
                  initialValue:record.ratio,
									rules: [{
										required: true,
										type:'number',
										message: '请输入分配比例!'
									}],
								})(
									<InputNumber min={0} max={100} onChange={record.onChange}/>
								)}
								<span className="ant-form-text"> %</span>
							</FormItem>
						)
				}
			}
		}
	];
  const tableData=[
    {
			itemName:'平台',
			ratioName:'platform',
			ratio:platform,
			onChange:(value)=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{
						platform:value,
					}
				})
			},
		}, {
			itemName:'省级代理',
			ratioName:'provinceAgency',
			ratio:provinceAgency,
			onChange:(value)=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{
						provinceAgency:value,
					}
				})
			},
		}, {
			itemName:'市级代理',
			ratioName:'cityAgency',
			ratio:cityAgency,
			onChange:(value)=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{
						cityAgency:value,
					}
				})
			},
		}, {
			itemName:'县级代理',
			ratioName:'countyAgency',
			ratio:countyAgency,
			onChange:(value)=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{
						countyAgency:value,
					}
				})
			},
		},{
			itemName:'交易中心',
			ratioName:'tradingCenter',
			ratio:tradingCenter,
			onChange:(value)=>{
				dispatch({
					type:'serviceMatching/initail',
					payload:{
						tradingCenter:value,
					}
				})
			},
		},{
			itemName:'总计',
			ratio:totalRatio
		},
	];
  return (
    <DxPanel title='交易服务费配比方案'>
      <Form inline style={{margin:'20px 0'}}>
  			<FormItem
  				label="方案名称"
  			>
  				{getFieldDecorator('keyWord', {
  				})(
  					<Input placeholder="搜索名称"/>
  				)}
  			</FormItem>
  			<Button style={{margin:'0 6px 0 0'}} onClick={searchServiceMatching} type="primary">搜索</Button>
  			<Button type='ghost' onClick={handleReset}>重置</Button>
  		</Form>
      <Button type='primary' onClick={createProgramme}>新建方案</Button>
      <Table columns={columns} dataSource={dataSource}
        loading={loading}
        pagination={pagination}
      />
    <Modal title={eidtStatus==false?'创建方案':'编辑方案'} visible={programmeModalStatus}
          onOk={programmeOnOk} onCancel={programmeOnCancel}
        >
        <Form>
          <FormItem
            label='方案名称'
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              initialValue:name,
              rules: [
                { required: true, message: '请输入方案名称'},
              ],
            })(
              <Input type='text'  placeholder='请输入方案名称'/>
            )}
          </FormItem>
          <FormItem
            label='配比设置'
            {...formItemLayout}
          >
            <p>所有组成项目比例之和必须等于100%</p>
            <Table
  						id="createMatchProjectModalTable"
  						bordered
  						loading={false}
  						columns={fangcolumns}
  						dataSource={tableData}
  						rowKey={record => record.itemName}
  						pagination={false}
  					/>
          </FormItem>
    		</Form>
      </Modal>
    </DxPanel>
  );
}

function mapStateToProps({serviceMatching}) {
  return {serviceMatching }
}

export default connect(mapStateToProps)(Form.create()(ServiceMatching));
