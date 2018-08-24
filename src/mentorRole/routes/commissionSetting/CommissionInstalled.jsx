import React from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router';
import {Form,Table,Button,Modal,Input,Row,Col,Tabs} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import './commissionInstalled.css'
const TabPane = Tabs.TabPane;
const FormItem=Form.Item;

function CommissionInstalled({form,commissionInstalled,dispatch}){
  const {getFieldDecorator}=form;

  const{
    isEmployee,
    activeKey,
    tableLoading,
    promptObj,
    editVisible,
    tableData,
    propertyType,
    selectId,
    tutorScale
  }=commissionInstalled

  const columns=[
    {
      title:"序号",
      dataIndex:"number",
    },{
      title:"物业类型",
      dataIndex:"propertyType"
    },{
      title:"导师佣金比例",
      dataIndex:'tutorScale',
      render:(text,record,index)=>{
        return(
          <div>
            {text}%
          </div>
        )
      }
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <div className="operation">
            <span onClick={()=>handleEdit(text,record,index)} className="edit"></span>
          </div>
        )
      }
    }]

  const handleEdit=(record)=>{
    dispatch({
      type:"commissionInstalled/setStatePramas",
      payload:{
        propertyType:record.propertyType,
        selectId:record.id,
        tutorScale:record.tutorScale,
        editVisible:true,
        isEmployee:record.isEmployee
      }
    });
  }

  const commissionRecord=()=>{
    dispatch(routerRedux.push({
      pathname:"/commissionSetting/commissionInstalled/commissionAdjustRecord"
    }))
  }

  const editCancel=()=>{
    dispatch({
      type:"commissionInstalled/setStatePramas",
      payload:{
        editVisible:false
      }
    })
  }

  const afterClose=()=>{
    form.resetFields(["tutorScale"]);
  }

  const onOk=()=>{
    form.validateFieldsAndScroll(["tutorScale"],(err, values) => {
      if (!err) {
        if(activeKey==='isEmployee'){
          dispatch({
            type:"commissionInstalled/addCommissionProject",
            payload:{
              id:selectId,
              propertyType:propertyType,
              tutorScale:values.tutorScale,
              isEmployee:true,
            }
          })
        }else{
          dispatch({
            type:"commissionInstalled/addCommissionProject",
            payload:{
              id:selectId,
              propertyType:propertyType,
              tutorScale:values.tutorScale,
              isEmployee:false,
            }
          })
        }
      }else{
        return
      }
    });
  }

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
			dispatch({
				type:"commissionInstalled/togglePrompt",
				payload:{
					visible:false
				}
			})
		}
  }

  const onCancelCallBack=()=>{}

  const onTabsChange=(key)=>{
    dispatch({
      type:"commissionInstalled/changeActiveKey",
      payload:{
        activeKey:key
      }
    });
    dispatch({
      type:"commissionInstalled/getInitInfo"
    })
  }

  return(
    <div className="commissionInstalled">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Modal
        visible={editVisible}
        footer={false}
        onCancel={editCancel}
        afterClose={afterClose}
        >

        <DxPanel title="设置佣金">
          <Row>
            <Col>
              <FormItem>
                  {getFieldDecorator('tutorScale', {
                    initialValue:tutorScale,
                    rules: [{ required: true, message: '请输入有效数字（0-100），2位有效小数!',pattern:/^(\d{1,2}(\.\d{0,2})?|100)$/}],
                  })(
                    <Input placeholder="请设置佣金" addonAfter='%'/>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={onOk} type="default" style={{marginTop:"20px"}}>完成</Button>
            </Col>
          </Row>
        </DxPanel>

      </Modal>
      <DxPanel title="佣金设置">
        <div className="tips">
          <Row>
            <Col>经纪人成交后，导师将抽取经纪人部分佣金作为奖励</Col>
            <Col>例如：10000元(成交佣金) x 10%(成交抽佣)=1000元(导师佣金)</Col>
          </Row>
        </div>
        <div className="content">
          <Row>
            <Col>
              <Button type="default" style={{marginBottom:"10px"}} onClick={commissionRecord}>
                佣金调整纪录
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Tabs
                activeKey={activeKey}
                onChange={onTabsChange}
                type="card"
                defaultActivKey="isEmployee"
                className="tabs"
                animated={false}
                >
                  <TabPane tab="自有经纪人" key="isEmployee">
                    <Table
                      loading={tableLoading}
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}/>
                  </TabPane>

                  <TabPane tab="平台经纪人" key="notEmployee">
                    <Table
                      loading={tableLoading}
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}/>
                  </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({commissionInstalled}){
  return{commissionInstalled}
}
export default connect(mapStateToProps)(Form.create({})(CommissionInstalled));
