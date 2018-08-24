import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Modal,Input,Table,Button,InputNumber} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import './BrokerageMatching.css'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
function BrokerageMatching({dispatch,brokerageMatching,form }) {
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
    pageNo,programmeModalStatus,
    brokerageVisible,
		brokerageSchemeName,
		brokerageBrokerRatio,
		brokeragePlatformRatio,
		brokerageProvinceAgentRatio,
		brokerageCityAgentRatio,
		brokerageAreaAgentRatio,
		brokerageDealCenterRatio,
		brokerageAdvisorJolesRatio,
		brokerageTotalWarning,
    eidtStatus,
  }=brokerageMatching;
  const totalRatio=brokerageBrokerRatio
		+brokeragePlatformRatio
		+brokerageProvinceAgentRatio
		+brokerageCityAgentRatio
		+brokerageAreaAgentRatio
		+brokerageDealCenterRatio
		+brokerageAdvisorJolesRatio;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'佣金方案名称',
      dataIndex:'name',
    },
    {
      title:'经纪人',
      dataIndex:'broker',
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
      title:'师傅角色',
      dataIndex:'master',
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
					type:'brokerageMatching/initail',
					payload:{loading:true}
				})
				dispatch({
					type:'brokerageMatching/deletAllocation',
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
      type:'brokerageMatching/initail',
      payload:{
        eidtStatus:true,
        programmeModalStatus:true,
      }
    })
    dispatch({
      type:'brokerageMatching/editBeforeSaerch',
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
			dispatch({type:'brokerageMatching/initail',
				payload:{loading:true}
			})
			dispatch({
				type:'brokerageMatching/pageOnchange',
				payload:{
					pageNo:page,
          name:keyWord,
				}
			})
		}
	};
  //搜索
  const searchBrokerageMatching=()=>{
    form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
      dispatch({
  			type:'brokerageMatching/initail',
  			payload:{loading:true}
  		})
			dispatch({
				type:'brokerageMatching/searchBrokerage',
				payload:{
					name:values.keyWord,
				}
			})
		});
  }
  const handleReset=()=>{
		form.resetFields();
		dispatch({
			type:'brokerageMatching/initail',
			payload:{loading:true}
		})
		dispatch({
			type:'brokerageMatching/findCommission',
		})
		//初始化到初始状态
	};
  const createProgramme=()=>{
    dispatch({
      type:'brokerageMatching/initail',
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
        type:'brokerageMatching/initail',
        payload:{loading:true}
      })
      if(!!id){
        dispatch({
          type:'brokerageMatching/editProgramme',
          payload:{
            name:values.name,
            id:id,
            master:values.brokerageAdvisorJolesRatio,
            countyAgency:values.brokerageAreaAgentRatio,
            broker:values.brokerageBrokerRatio,
            cityAgency:values.brokerageCityAgentRatio,
            tradingCenter:values.brokerageDealCenterRatio,
            provinceAgency:values.brokerageProvinceAgentRatio,
            platform:values.brokeragePlatformRatio,
          }
        })
      }else{
        dispatch({
          type:'brokerageMatching/addProgramme',
          payload:{
            name:values.name,
            master:values.brokerageAdvisorJolesRatio,
            countyAgency:values.brokerageAreaAgentRatio,
            broker:values.brokerageBrokerRatio,
            cityAgency:values.brokerageCityAgentRatio,
            tradingCenter:values.brokerageDealCenterRatio,
            provinceAgency:values.brokerageProvinceAgentRatio,
            platform:values.brokeragePlatformRatio,
          }
        })
      }
      form.resetFields();
		});
  }
  const programmeOnCancel=()=>{
    form.resetFields();
    dispatch({
      type:'brokerageMatching/initail',
      payload:{
        programmeModalStatus:false,
        eidtStatus:false,
        loading:false,
        id:'',
        name:'',
        brokerageBrokerRatio:0,
        brokeragePlatformRatio:0,
        brokerageProvinceAgentRatio:0,
        brokerageCityAgentRatio:0,
        brokerageAreaAgentRatio:0,
        brokerageDealCenterRatio:0,
        brokerageAdvisorJolesRatio:0,
      }
    })
    form.resetFields();
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
                    pattern:/^\d+(?:.\d{1,2})?$/,
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
			itemName:'经纪人',
			ratioName:'brokerageBrokerRatio',
			ratio:brokerageBrokerRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageBrokerRatio:value,
					}
				})
			}
		}, {
			itemName:'平台',
			ratioName:'brokeragePlatformRatio',
			ratio:brokeragePlatformRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokeragePlatformRatio:value,
					}
				})
			},
		}, {
			itemName:'省级代理',
			ratioName:'brokerageProvinceAgentRatio',
			ratio:brokerageProvinceAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageProvinceAgentRatio:value,
					}
				})
			},

		}, {
			itemName:'市级代理',
			ratioName:'brokerageCityAgentRatio',
			ratio:brokerageCityAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageCityAgentRatio:value,
					}
				})
			},
		}, {
			itemName:'县级代理',
			ratioName:'brokerageAreaAgentRatio',
			ratio:brokerageAreaAgentRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageAreaAgentRatio:value,
					}
				})
			},
		},{
			itemName:'交易中心',
			ratioName:'brokerageDealCenterRatio',
			ratio:brokerageDealCenterRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageDealCenterRatio:value,
					}
				})
			},
		},{
			itemName:'师傅角色',
			ratioName:'brokerageAdvisorJolesRatio',
			ratio:brokerageAdvisorJolesRatio,
			onChange:(value)=>{
				dispatch({
					type:'brokerageMatching/initail',
					payload:{
						brokerageAdvisorJolesRatio:value,
					}
				})
			},
		},{
			itemName:'总计',
			ratio:totalRatio
		},
	];
  return (
    <DxPanel title='佣金配比方案'>
      <Form inline style={{margin:'20px 0'}}>
  			<FormItem
  				label="方案名称"
  			>
  				{getFieldDecorator('keyWord', {
  				})(
  					<Input placeholder="搜索名称"/>
  				)}
  			</FormItem>
  			<Button style={{margin:'0 6px 0 0'}} onClick={searchBrokerageMatching} type="primary">搜索</Button>
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

function mapStateToProps({brokerageMatching}) {
  return {brokerageMatching }
}

export default connect(mapStateToProps)(Form.create()(BrokerageMatching));
