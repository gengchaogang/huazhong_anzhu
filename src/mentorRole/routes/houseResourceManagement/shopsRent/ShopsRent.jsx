import React from 'react';
import {connect} from 'dva'
import { routerRedux } from 'dva/router';
import {Form,Input,Col,Row,Cascader,Select,Button,Tabs,Table,Modal,Spin } from 'antd'
import './shopsRent.css'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';

const FormItem=Form.Item;
const Option=Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function ShopsRent({form,dispatch,mentorShopsRent}){
  const {
    pwd,
    tudiGongVisible,
    selectedRowRecord,
    selectedRowKeys,
    isBroker,
    activeKey,
    tableLoading,
    currentPage,
    total,
    promptObj,
    loadingShadow,
    publishedHousePage,
    unassignedAgentPage,
    removedPage,
    soldPage,
    cooperationPage,
    eopOptions,
    area,
    resourcesNumber,
    } = mentorShopsRent;

  //  已发布房源
  const paginationPublishedHouse = {
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: publishedHousePage.pageSize,
			current:publishedHousePage.current,
			defaultCurrent:1,
			total:publishedHousePage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'mentorShopsRent/getNewHouseDealTableData',
					payload:{
						pageNo:page-1,
						pageSize:publishedHousePage.pageSize,
            hasBroker:"是",
            houseState:'已发布',
            isCooperationSale:"关闭",
            isCurrentUser:"是",
            resourcesType:"商铺",
            saleWay:"出租",
            keyword:mentorShopsRent.resourcesNumber,
            fullPath:mentorShopsRent.area,
					}
				})
			},
	};

  //  未指派经纪人
  const paginationUnassignedAgent = {
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: unassignedAgentPage.pageSize,
			current:unassignedAgentPage.current,
			defaultCurrent:1,
			total:unassignedAgentPage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'mentorShopsRent/getNewHouseDealTableData',
					payload:{
						pageNo:page-1,
						pageSize:unassignedAgentPage.pageSize,
    //        hasBroker:"否",
            isCurrentUser:"是",
            resourcesType:"商铺",
            saleWay:"出租",
            keyword:mentorShopsRent.resourcesNumber,
            fullPath:mentorShopsRent.area,
					}
				})
			},
	};

  //  已下架
  const paginationRemoved = {
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: removedPage.pageSize,
			current:removedPage.current,
			defaultCurrent:1,
			total:removedPage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'mentorShopsRent/getNewHouseDealTableData',
					payload:{
						pageNo:page-1,
						pageSize:removedPage.pageSize,
            houseState:'已下架',
            isCurrentUser:"是",
            resourcesType:"商铺",
            saleWay:"出租",
            keyword:mentorShopsRent.resourcesNumber,
            fullPath:mentorShopsRent.area,
					}
				})
			},
	};

  //  已售
  const paginationSold = {
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: soldPage.pageSize,
			current:soldPage.current,
			defaultCurrent:1,
			total:soldPage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'mentorShopsRent/getNewHouseDealTableData',
					payload:{
						pageNo:page-1,
						pageSize:soldPage.pageSize,
            houseState:'已售',
            isCurrentUser:"是",
            resourcesType:"商铺",
            saleWay:"出租",
            keyword:mentorShopsRent.resourcesNumber,
            fullPath:mentorShopsRent.area,
					}
				})
			},
	};
  //  合作速销
  const paginationCooperation = {
			showQuickJumper:commonFinalCode.showQuickJumper,
			pageSize: cooperationPage.pageSize,
			current:cooperationPage.current,
			defaultCurrent:1,
			total:cooperationPage.total,
			showTotal:total => `共${total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'mentorShopsRent/getCooperationList',
					payload:{
						pageNo:page-1,
						pageSize:cooperationPage.pageSize,
            hasBroker:"是",
            isCooperationSale:"开启",
            isCurrentUser:"是",
            resourcesType:"商铺",
            saleWay:"出租",
            keyword:mentorShopsRent.resourcesNumber,
            fullPath:mentorShopsRent.area,
					}
				})
			},
	};
  const {getFieldDecorator}=form;
  const columns = [{
      title: '序号',
      dataIndex: 'indexXh',
    }, {
      title: '房源编号',
      dataIndex: 'resourcesNumber',
    }, {
      title: '城市',
      dataIndex: 'areaName',
      render:(text,record,index)=>{
        var areaNameLet=text.split("/");
        areaNameLet=areaNameLet.filter(function(value){return !!value;});
        return (<span>{areaNameLet.join("/")}</span>)
      },
    }, {
      title: '楼盘名称',
      dataIndex: 'communityName',
      render:(text,record,index)=>{
        return (
          <span>
            <div title={text}>{text.length>20?text.substr(0,20)+'..':text}</div>
          </span>
        )
      },
    }, {
      title: '楼层',
      dataIndex: 'storey',
      render:(text,record,index)=>{
        return (
  				<span>{text}/{record.totalFloors}</span>
  			)
      }
    },{
      title: '面积',
      dataIndex: 'floorArea',
      render:(text,record,index)=>{
        return (
  				<span>{text}㎡</span>
  			)
      }
    }, {
      title: '租金',
      dataIndex: 'totlePriceShowName',
      render:(text,record,index)=>{
        return (
  				<span>{text}{record.uintPirce}</span>
  			)
      }
    },{
      title: '状态',
      dataIndex: 'houseState',
    }, {
      title: '操作',
      render:(text,record,index)=>{
        if(!!activeKey&&activeKey==='publishedHouse'||activeKey==='cooperation'){
          return (
            <div className="operation">
              {!isBroker && <span onClick={()=>checkeAgent(text,record,index)} className="searchIcon"></span>}
              <span onClick={()=>handleEdit(text,record,index)} className="edit"></span>
              <span onClick={()=>handleDelete(text,record,index)} className="delete"></span>
            </div>
        )
      }else if(activeKey==='unassignedAgent'||activeKey==='removed'){
        return(
          <div className="operation">

            <span onClick={()=>handleEdit(text,record,index)} className="edit"></span>
            <span onClick={()=>handleDelete(text,record,index)} className="delete"></span>
          </div>
        )//  {!isBroker && <span onClick={()=>assignAgent(text,record,index)} className="assignedBroker"></span>}
      }else if(activeKey==='sold'){
        return(
          <div className="operation">
            <i onClick={()=>toBrokerDetail(text,record,index)} className="broker_check"></i>
            <span onClick={()=>handleDelete(text,record,index)} className="delete"></span>
          </div>
        )
      }else{
        return;
      }
      }
    }];
    const toBrokerDetail=(text,record,index)=>{
      dispatch(routerRedux.push({
        pathname:'houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingDetails',
        state:{
          projectId:record.id
        }
      }))
    }
    const checkResource=(text,record,index)=>{

    }
  const checkeAgent=(text,record,index)=>{
      dispatch(routerRedux.push({
        pathname:'/houseResourceRentManagement/directAssignAgent',
        state:{
          id:record.id
        }
      }))
    }
  const assignAgent=(text,record,index)=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/directAssignAgent',
      state:{
        id:record.id
      }
    }))
  }

  const handleEdit=(text,record,index)=>{
      dispatch(routerRedux.push({
        pathname:'/houseResourceRentManagement/shopsRent/createShopsRentResource',
        state:{
            isUpdate:true,
            dataId:record['id'],
        }
      }))
  }

  const handleDelete=(text,record,index)=>{
      confirm({
          title: commonFinalCode.deleteConfirm_msg,
          onOk() {
            dispatch({
                type:"mentorShopsRent/deleteHouse",
                payload:record,
            })
          },
          onCancel() {},
      });
  }
  const onSelectChange=(value,selectedOptions)=>{
    let areaName = "";
    if (selectedOptions != null && selectedOptions.length > 0) {
        selectedOptions.map((item,index)=>{
            areaName = areaName + "/" + item['label'];
        })
    }
    dispatch({
      type:"mentorShopsRent/saveSearchArea",
      payload:{
        area:areaName
      }
    })
  }
  const createNewHouse=()=>{  //todo
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent/createShopsRentResource',
      state:{
        eopOptions:eopOptions
      }
    }))
  }


  const onTabsChange=(key)=>{
    form.resetFields();
    dispatch({
      type:"mentorShopsRent/saveSelectedRowKeys",
      payload:{
        selectedRowKeys:[]
      }
    })
    dispatch({
      type:"mentorShopsRent/setState",
      payload:{
        activeKey:key,
        area:null
      }
    });
    dispatch({
      type:'mentorShopsRent/loadList',
      payload:{
        isReFresh:true
      }
    })
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        values.area=area;
        mentorShopsRent.resourcesNumber=values.resourcesNumber;
        mentorShopsRent.area=values.area;
        dispatch({
          type:"mentorShopsRent/loadList",
          payload:{
            area:values.area,
            resourcesNumber:values.resourcesNumber,
          }
        })
      }
    });
  }


  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"mentorShopsRent/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
      if(promptObj.todo==='closeModalAndWritePass'){
        dispatch({
          type:"mentorShopsRent/togglePrompt",
          payload:{
            visible:false
          }
        })
        dispatch({
          type:"mentorShopsRent/changeVisible",
          payload:{
            tudiGongVisible:true,
          }
        })
      }
  }
  const onCancelCallBack=()=>{}

  //一键群发
  const shareHouse=()=>{
    dispatch({
      type:"mentorShopsRent/sharHouse",
      payload:{
        selectedRowKeys:selectedRowKeys,
        selectedRowRecord:selectedRowRecord,
      }
    })
  }
  const onPublishedHouseSelectChange = (selectedRowKeys,selectedRows) => {
    dispatch({
      type:"mentorShopsRent/saveSelectedRowKeys",
      payload:{
        selectedRowKeys:selectedRowKeys,
        selectedRowRecord:selectedRows
      }
    })
  }
  const rowSelection = {
    selectedRowKeys,
    onChange:onPublishedHouseSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  //分享房源
  const saveTudigongPass=(e)=>{
    dispatch({
      type:"mentorShopsRent/saveTudigongPass",
      payload:{
        pwd:e.target.value
      }
    })
  }
  const handleOk=()=>{
    if(!!pwd){
      dispatch({
        type:"mentorShopsRent/sharHouse",
        payload:{
          selectedRowKeys:selectedRowKeys,
          selectedRowRecord:selectedRowRecord,
          pwd:pwd,
        }
      })
    }
  }
  const handleCancel=()=>{
    dispatch({
      type:"mentorShopsRent/changeVisible",
      payload:{
        tudiGongVisible:false,
      }
    })
  }
  return(
    <div className="mentorRole-houseSell">
      {
        isBroker!==null?
        <div>
          <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
          <DxLoadingShadow visible={loadingShadow} />
          <div className="searchBar">
            <Form onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={5}>
                  <FormItem label="关键字" {...formItemLayout}>
                    {getFieldDecorator('resourcesNumber', {
                      rules: [{ required: false, message:'' }],
                    })(
                      <Input placeholder="搜索小区名称或房源编号" size='large'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="城市" {...formItemLayout}>
                    {getFieldDecorator('area', {
                      rules: [{ required: false, message:'请选择城市列表' }],
                    })(
                      <Cascader options={eopOptions}changeOnSelect={true} onChange={onSelectChange} placeholder="请选择城市列表" />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <Row gutter={8}>
                    <Col span={6}>
                      <Button type='primary' htmlType="submit" size='large'>搜索</Button>
                    </Col>
                    <Col span={6}>
                      <Button type='reset'
                        onClick={
                          ()=>{
                            form.resetFields()
                            dispatch({
                              type:"mentorShopsRent/setState",
                              payload:{
                                area:null
                              }
                            })
                            dispatch({
                              type:"mentorShopsRent/loadList",
                              payload:{}
                            })
                          }
                        }
                        size='large'>重置</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            <Col>
              <div className="addHouse">
                <Button size='large' onClick={createNewHouse} icon="plus">新增房源</Button>
                  {
                    isBroker?
                    <div className="selectItemDiv">
                      <Button type="primary" onClick={shareHouse} disabled={!hasSelected}>一键群发</Button>
                      <span className="selectItem">{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                    </div>
                    :null
                  }
              </div>
            </Col>
          </Row>
          <div className="mentorTabs">
            <Tabs
              activeKey={activeKey}
              onChange={onTabsChange}
              type="card"
              defaultActivKey="publishedHouse"
              className="tabs"
              animated={false}
              >
                {/*
              <TabPane tab="合作速销房源" key="cooperation">
                  <Table
                    loading={tableLoading}
                    dataSource={cooperationPage.content}
                    columns={columns}
                    pagination={paginationCooperation}
                    rowSelection={isBroker?rowSelection:null}
                   />
              </TabPane>
                <TabPane tab="私有房源" key="publishedHouse">
                    <Table
                      loading={tableLoading}
                      dataSource={publishedHousePage.content}
                      columns={columns}
                      pagination={paginationPublishedHouse}
                      rowSelection={isBroker?rowSelection:null}
                     />
                </TabPane>
                */}
                {
                  isBroker?
                    null
                    :
                    <TabPane tab="全部房源" key="unassignedAgent">
                        <Table
                          loading={tableLoading}
                          dataSource={unassignedAgentPage.content}
                          columns={columns}
                          pagination={paginationUnassignedAgent}
                         />
                    </TabPane>
                }
                <TabPane tab="已租房源" key="sold">
                  <Table
                    loading={tableLoading}
                    dataSource={soldPage.content}
                    columns={columns}
                    pagination={paginationSold}
                    />
                </TabPane>
                <TabPane tab="已下架房源" key="removed">
                    <Table
                      loading={tableLoading}
                      dataSource={removedPage.content}
                      columns={columns}
                      pagination={paginationRemoved}
                     />
                </TabPane>
            </Tabs>
          </div>
        </div>
        :
        <div className="mentorDataLoading">
          <Spin />
        </div>
      }
    </div>
  )
}

function mapStateToProps({mentorShopsRent}){
  return{mentorShopsRent}
}
export default connect(mapStateToProps)(Form.create({})(ShopsRent));
