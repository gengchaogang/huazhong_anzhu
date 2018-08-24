import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader,Select,Tooltip,
  Radio,Row,Col} from 'antd';
import PromptModal from '../../../../commons/View/PromptModal'
import DxPanel from '../../../../commons/components/DxPanel'
import notexist from '../../../assets/images/notexist.png'
import './Feedback.css'
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};
function Feedback({dispatch,feedback,form}) {
  const {
    labelFeedbackType,dataSource,status,pageNo,total,type,content,loading,
    createTime,contentFeedback,imgUrl,userType,loginName,areaPath,dealTime,
    dealUserName,result,dealModal,id,
  }=feedback;
  const text1=<span>{contentFeedback}</span>;
  const {getFieldDecorator}=form;
  const columns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"反馈时间",
      dataIndex:"createTime"
    },{
      title:"内容",
      dataIndex:"content",
      render:text=>{
        if(!!text){
          let text2 = <span>{text}</span>;
          return (
            <div>
              <Tooltip placement="top" title={text2} arrowPointAtCenter>
                <p className='abs-right_name'>{text}</p>
              </Tooltip>
            </div>
          )
        }
      }
    },{
      title:"经纪人",
      dataIndex:"userName"
    },{
      title:"账号",
      dataIndex:"loginName"
    },{
      title:"操作",
      render:(text,record,index)=>{
        if(status=='待处理'){
          return(
            <span className="operation" onClick={()=>{dealDetails(record.key)}}>处理</span>
          )
        }else{
          return(
            <span className="operation" onClick={()=>{dealDetails(record.key)}}>详情</span>
          )
        }
      }
  }]
  const dealDetails=(key)=>{
    dispatch({
      type:'feedback/dealDetails',
      payload:{
        id:key,
      }
    })
  }
  const pagination={
    total:total,
    current:pageNo,
    showTotal:()=>{return `共 ${total} 项`},
    onChange:(page)=>{
      dispatch({type:'feedback/initailSuccess',payload:{loading:true}})
      dispatch({
        type:'feedback/findAll',
        payload:{
          pageNo:page-1,
          status:status,
          content:content,
          type:type,
        }
      })
    }
  }
  const onTabsChange=(key)=>{
    dispatch({type:'feedback/initailSuccess',payload:{loading:true}})
    dispatch({
      type:'feedback/findAll',
      payload:{
        status:key
      }
    })
  }
  // const handleCallBackOk=()=>{
  //   // if(promptObj.todo==='closeModal'){
  //   //   dispatch({
  //   //     type:"feedback/togglePrompt",
  //   //     payload:{visible:false}
  //   //   })
  //   // }
  // }
  // const handleCallBackCancel=()=>{}

  const handleReset=()=>{
    form.resetFields()
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({type:'feedback/initailSuccess',payload:{loading:true}})
        dispatch({
          type:'feedback/findAll',
          payload:{
            content:values.content,
            type:values.type,
            status:status,
          }
        })
      }
    });
  }
  const dealDetailCnacel=()=>{
    dispatch({type:'feedback/initailSuccess',
      payload:{dealModal:false,}
    })
  }
  const dealDetailOk=()=>{
    if(status=='待处理'){
      form.validateFields((err,values)=>{
        dispatch({type:'feedback/dealDetailOk',
          payload:{
            id:id,
            result:values.isTypeEffective,
            type:values.choseModalType,
          }
        })
      })
      form.resetFields();
    }else{
      dispatch({type:'feedback/initailSuccess',
        payload:{dealModal:false,}
      })
    }
  }
  return (
    <div className="feedback">
      <DxPanel title="意见反馈">
        <Form inline onSubmit={handleSubmit}>
          <FormItem
              label="关键字"
            >
            {getFieldDecorator('content', {
            })(
              <Input placeholder="搜索意见建议内容"/>
            )}
          </FormItem>
          <FormItem
            label="反馈类型"
          >
            {getFieldDecorator('type', {
            })(
              <Select size="large" style={{ width: 200 }}>
                {!!labelFeedbackType && labelFeedbackType.map((item,index)=>(
                    <Option value={item.value} key={`key_${index}`}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <Button style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
          <Button  onClick={handleReset} type='ghost'>重置</Button>
        </Form>
        <Tabs onChange={onTabsChange} type="card">
          <TabPane tab="待处理" key="待处理">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="已处理" key="已处理">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              loading={loading}
            />
          </TabPane>
        </Tabs>
        <Modal visible={dealModal} title={status=='待处理'?'处理反馈':'反馈详情'}
          onCancel={dealDetailCnacel} onOk={dealDetailOk}
        >
        <Row>
          <Col lg={{ span: 24, offset: 2 }}>
            <p className='feedbackP'>反馈时间：{createTime}</p>
          </Col>
          <Col lg={{ span: 24, offset: 2 }}>
            <Tooltip placement="top" title={contentFeedback} arrowPointAtCenter>
              <p className='feedbackneirong'>反馈内容：{contentFeedback}</p>
            </Tooltip>
          </Col>
          <Col lg={{ span: 24, offset: 2 }}>
            <div className='feedbackP'>
              <p>内容截图:</p>
              {imgUrl.length>0 && imgUrl.map((item,index)=>(
                <span key={`item_${index}`} style={{backgroundImage:`URL(${item||notexist})`}}
                  className='feedbackUrl'>
                </span>
              ))}
            </div>
          </Col>
          <Col lg={{ span: 24, offset: 2 }}>
            <p className='feedbackP'>用户角色：{userType}</p>
          </Col>
          <Col lg={{ span: 24, offset: 2 }}>
            <p className='feedbackP'>用户帐号：{loginName}</p>
          </Col>
          <Col lg={{ span: 24, offset: 2 }}>
            <p className='feedbackP'>用户地区：{areaPath}</p>
          </Col>
        </Row>
          {status==='待处理'?
          <Form onSubmit={dealDetailOk}>
            <FormItem label='反馈类型'
              {...formItemLayout}
            >
              {getFieldDecorator('choseModalType', {
              })(
                <Select size="large" style={{ width: 200 }}>
                  {!!labelFeedbackType && labelFeedbackType.map((item,index)=>(
                      <Option value={item.value} key={`key_${index}`}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              label='处理结果'
            {...formItemLayout}>
              {getFieldDecorator('isTypeEffective', {
              })(
                <RadioGroup>
                  <RadioButton value="有效受理">有效受理</RadioButton>
                  <RadioButton value="无效反馈">无效反馈</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Form>:
          <Row>
            <Col lg={{ span: 24, offset: 2 }}>
              <p className='feedbackP'>处理时间：{dealTime}</p>
            </Col>
            <Col lg={{ span: 24, offset: 2 }}>
              <p className='feedbackP'>处理人员：{dealUserName}</p>
            </Col>
            <Col lg={{ span: 24, offset: 2 }}>
              <p>处理结果：{result}</p>
            </Col>
          </Row>}
        </Modal>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({feedback}) {
  return {feedback}
}

export default connect(mapStateToProps)(Form.create({})(Feedback));
