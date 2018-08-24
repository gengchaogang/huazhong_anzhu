import React from 'react'
import {connect} from 'dva'
import {Table,Input,Button,Modal,Select,Row,Col,message,Form} from 'antd'
import img from '../../assets/images/morentouinfg.png';
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import SearchInput from '../../../commons/View/SearchInput'
import './inactiveAgent.css'
const Option = Select.Option;
const FormItem=Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function InactiveAgent({dispatch,inactiveAgent,form}){
  const {
    record,
    teamData,
    pageInfo,
    tableLoading,
    promptObj,
    customFilter,
  }=inactiveAgent;

  const {getFieldDecorator} = form;
  const columns=[
  {
    title:"头像",
    render:(text,record,index)=>{
      let url = img;
      if(record.logo){
        url = record.logo;
      }
      return(<img src={url} width='70px'/>)
    }
  }
  ,
  {
    title:"姓名",
    dataIndex:"name"
  },{
    title:"手机号码",
    dataIndex:"phoneNumber"
  },{
    title:"部门",
    dataIndex:"teamName"
  },{
    title:"操作",
    render:(text,record,index)=>{
      return(
        <div className="button">
          <span
            onClick={()=>activationBroker(text,record,index)}
            className="broker_active">
          </span>
          <span
            onClick={()=>deleteBroker(text,record,index)}
            className="broker_delete">
          </span>
        </div>
      )
    }
  }]
  const paginationInfo = {
			pageSize: pageInfo.pageSize,
			current:pageInfo.current,
			defaultCurrent:1,
			total:pageInfo.total,

			showTotal:total => `共${total}条数据`,
			onChange:(page)=>{
        dispatch({
          type:'inactiveAgent/setStatePramas',
          payload:{
            tableLoading:true,
          }
        });
				dispatch({
					type:'inactiveAgent/findBrokerUnActive',
					payload:{
						pageNo:page-1,
						pageSize:pageInfo.pageSize,
            ...customFilter,
					}
				});
			},
	};

  const activationBroker=(record)=>{ //表格激活
    const confirm = Modal.confirm;
    confirm({
      title: '确定激活经纪人？',
      content: '点击“确定”按钮后, 将激活经纪人（'+record.name+'）。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type:"inactiveAgent/activateBroker",
            payload:{
              resolve:resolve,
              id:record.id,
              ...customFilter,
            }
          });
          // dispatch({
          //   type:"inactiveAgent/sendMessage",
          //   payload:{
          //     phone:record.phoneNumber,
          //     smsTPLCode:'CODESMS_47375206'
          //   }
          // })
        });
      },
      onCancel() {},
    });
  }
  const deleteBroker=(record)=>{ //表格操作里的删除
    const confirm = Modal.confirm;
    const brokerId = record.id;
    confirm({
      title: '确定删除该经纪人？',
      content: '点击“确定”按钮后, 将删除经纪人（'+record.name+')。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type:"inactiveAgent/deleteUnActivationBroker",
            payload:{
              resolve:resolve,
              id:brokerId,
            }
          });
        });
      },
      onCancel() {},
    });
  }

  const resetSearch=()=>{
    form.resetFields();
    dispatch({
      type:'inactiveAgent/setStatePramas',
      payload:{
        customFilter:{keyword:"",teamId:""},
        tableLoading:true,
      }
    });
    dispatch({
      type:'inactiveAgent/findBrokerUnActive',
      payload:{
        pageNo:0,
        pageSize:pageInfo.pageSize,
      }
    });

  }
  const onSearch =(e)=>{
    e.preventDefault();
    const keyWord = form.getFieldValue("keyWords");
    const teamId = form.getFieldValue("teamSelect");
    dispatch({
      type:'inactiveAgent/setStatePramas',
      payload:{
        customFilter:{keyword:keyWord,teamId:teamId},
        tableLoading:true
      }
    });
    dispatch({
      type:'inactiveAgent/findBrokerUnActive',
      payload:{
        pageNo:0,
        pageSize:pageInfo.pageSize,
        keyword:keyWord,
        teamId:teamId,
      }
    });
  }

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
			dispatch({
				type:"inactiveAgent/togglePrompt",
				payload:{
					visible:false
				}
			});
		}
  }
  const onCancelCallBack=()=>{}
  return(
    <div className="inactiveAgent">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxPanel title="未激活经纪人">
      <Form onSubmit={onSearch}>
        <Row gutter={16}>

          <Col span={6}>
            <FormItem label="关键字" {...formItemLayout}>
              {getFieldDecorator('keyWords', {})(
                <Input placeholder="搜索经纪人姓名" className="searchName" size='large'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="团队" {...formItemLayout}>
              {getFieldDecorator('teamSelect', {})(
                <Select placeholder="请选择团队">
                  {teamData.map((item,index)=>{
                    return(
                      <Option key ={item.key}  value={item.key}>{item.title}</Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <Row gutter={4}>
              <Col span={8}>
                <Button type='primary' htmlType="submit" size='large'>搜索</Button>
              </Col>
              <Col span={8}>
                <Button type='reset' onClick={resetSearch} size='large'>重置</Button>
              </Col>
            </Row>
          </Col>

        </Row>
      </Form>
      <Table rowKey={record => record.id}  loading={tableLoading} columns={columns} dataSource={pageInfo.content} pagination={paginationInfo}/>

    </DxPanel>
    </div>
  )
}
function mapStateToProps({inactiveAgent}){
  return{
    inactiveAgent
  }
}
export default connect(mapStateToProps)(Form.create({})(InactiveAgent));
