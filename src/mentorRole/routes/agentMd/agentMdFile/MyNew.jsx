// import React from 'react';
// import {connect} from 'dva';
// import { routerRedux } from 'dva/router';
//
// function MyNew({dispatch,myNew}){
// const {editVisible}=myNew
//
// const preEditTeamName=()=>{
//
//   //console.log(12);
//   dispatch({
//     type:"myNew/goSta",
//     payload:{
//       editVisible:true
//     }
//   })
//
//
// }
//     return(
//       <div>
//       <button onClick={preEditTeamName}>点我</button>
//       </div>
//     )
//   }
//
//
//
// function mapStateToProps({myNew}){
//
//   return{myNew}
// }
// export default connect(mapStateToProps)(MyNew);



import React from 'react';
import {connect} from 'dva'
import { routerRedux } from 'dva/router';
import {Form,Input,Col,Row,Cascader,Select,Button,Tabs,Table,Modal,Spin } from 'antd'
import './officeRent.css'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
import { log } from 'util';

const FormItem=Form.Item;
const Option=Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};


/***************************************************************/
/**************************************************************/
/**********  写字楼出租：已发布，未指派经纪人、已下架、已售 *******/
/*************************************************************/
/*************************************************************/

function MyNew({form,dispatch,myNew}){
  const {
    pwd,
    tudiGongVisible,
    area,
    selectedRowRecord,
    selectedRowKeys,
    isBroker,
    activeKey,
    tableLoading,
    promptObj,
    loadingShadow,
    publishedHousePage,
    unassignedAgentPage,
    removedPage,
    soldPage,
    cooperationPage,
    eopOptions,
    labels,
    resourcesNumber,
    } = myNew;



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
  					type:'myNew/getUnassignedAgentList',
  					payload:{
  						pageNo:page-1,
  						pageSize:unassignedAgentPage.pageSize,
//              hasBroker:"否",
              isCurrentUser:"是",
              resourcesType:"写字楼",
              saleWay:"出租",
              keyword:myNew.resourcesNumber,
              fullPath:myNew.area,
  					}
  				})
  			},
  	};



  const {getFieldDecorator}=form;
  const columns = [{
      title: '序号',
      dataIndex: 'indexXh',
    }, {
      title: '门店名称',
      dataIndex: 'name',
    }, {
      title: '门店区域',
      dataIndex: 'area',

    }, {
      title: '联系人',
      dataIndex: 'contacts',

    },{
      title: '联系人电话',
      dataIndex: 'contactsTell',

    },{
      title: '经纪人数量',
      dataIndex: 'brokersCount',

    }, {
      title: '创建时间',
      dataIndex: 'createDateTime',

    },{
      title: '操作',
      render:(text,record,index)=>{
      if(activeKey==='unassignedAgent'){
        return(
          <div className="operation">

            <span onClick={()=>handleEdit(text,record,index)} className="edit"></span>
            <span onClick={()=>handleDelete(text,record,index)} className="delete"></span>
          </div>
        )            //{!isBroker && <span onClick={()=>assignAgent(text,record,index)} className="assignedBroker"></span>}
      }else{
        return;
      }
      }
    }];



  // 编辑数据
  const handleEdit=(text,record,index)=>{
    dispatch(routerRedux.push({
      pathname:'/agentmd/agentMd/addMd',
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
                type:"myNew/deleteHouse",
                payload:record,
            })
          },
          onCancel() {},
      });
  }
  const onSelectChange=(value,selectedOptions)=>{
    let areaName = "";
    console.log(selectedOptions);
    if (selectedOptions != null && selectedOptions.length > 0) {
        selectedOptions.map((item,index)=>{
            areaName += "/" + item['label'];
        })
    }
    
 
    
    dispatch({
      type:"myNew/saveSearchArea",
      payload:{
        area:areaName
      }
    })
  }

  // 添加
  const createNewHouse=()=>{  //todo
    dispatch(routerRedux.push({
      pathname:'/agentmd/agentMd/addMd',
      state:{
        eopOptions:eopOptions
      }
    }))
  }

  const onTabsChange=(key)=>{
    form.resetFields();
      dispatch({
        type:"myNew/saveSelectedRowKeys",
        payload:{
          selectedRowKeys:[]
        }
      })
      dispatch({
        type:"myNew/setState",
        payload:{
          activeKey:key,
          area:null
        }
      });
      dispatch({
        type:'myNew/loadList',
        payload:{
          isReFresh:true
        }
      })
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        values.area=area;
        myNew.area=values.area;
        myNew.resourcesNumber=values.resourcesNumber;
        dispatch({
          type:"myNew/loadList",
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
          type:"myNew/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
      if(promptObj.todo==='closeModalAndWritePass'){
        dispatch({
          type:"myNew/togglePrompt",
          payload:{
            visible:false
          }
        })
        dispatch({
          type:"myNew/changeVisible",
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
      type:"myNew/sharHouse",
      payload:{
        selectedRowKeys:selectedRowKeys,
        selectedRowRecord:selectedRowRecord,
      }
    })
  }
  const onPublishedHouseSelectChange = (selectedRowKeys,selectedRows) => {
    dispatch({
      type:"myNew/saveSelectedRowKeys",
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
      type:"myNew/saveTudigongPass",
      payload:{
        pwd:e.target.value
      }
    })
  }
  const handleOk=()=>{
    if(!!pwd){
      dispatch({
        type:"myNew/sharHouse",
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
      type:"myNew/changeVisible",
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
                              type:"myNew/setState",
                              payload:{
                                area:null
                              }
                            })
                            dispatch({
                              type:"myNew/loadList",
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
              <div className='addHouse'>
                <Button type="default" onClick={createNewHouse} icon="plus" size="large">新增房源</Button>
               
              </div>
            </Col>
          </Row>
          <div className="mentorTabs">
            <Tabs
              activeKey='unassignedAgent'
              onChange={onTabsChange}
              type="card"
              defaultActivKey="unassignedAgent"
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




                  <TabPane tab="全部" key="unassignedAgent">
                      <Table
                        loading={tableLoading}
                        dataSource={unassignedAgentPage.content}
                        columns={columns}
                        pagination={paginationUnassignedAgent}
                       />
                  </TabPane>

                {/*  <TabPane tab="已租房源" key="sold">
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
*/}
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

function mapStateToProps({myNew}){
  return{myNew}
}
export default connect(mapStateToProps)(Form.create({})(MyNew));
