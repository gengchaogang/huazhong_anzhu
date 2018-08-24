import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Select,Modal,Checkbox,Tooltip} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import './SystemMessage.css'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function SystemMessage({dispatch,form ,systemMessage}) {
  const plainOptions=['短信', 'push消息', '站内信'];
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {loading,messageData,total,pageNo,editStatus,
    describes,template,messageTypes,messageType,code,templates,
  }=systemMessage;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'编号',
      dataIndex:'code',
    },
    // {
    //   title:'用户角色',
    //   dataIndex:'',
    // },
    {
      title:'消息方式',
      dataIndex:'messageType',
    },
    {
      title:'消息标题',
      dataIndex:'describes',
    },
    {
      title:'消息内容',
      dataIndex:'template',
      render:text=>{
        if(!!text){
          return (
            <div>
              <Tooltip placement="top" title={text} arrowPointAtCenter>
                <p className='abs-right_name'>{text}</p>
              </Tooltip>
            </div>
          )
        }
      }
    },
    {
      title:'状态',
      dataIndex:'isEnable',
      render:text=>{
        if(text===true){
          return <span>启用</span>
        }else {
          return <span>未启用</span>
        }
      }
    },
    {
      title:'操作',
      dataIndex:'operations',
      render:(text,record)=>{
        if(record.isEnable===true){
          return <div>
            <span className='operationsColor' onClick={()=>changeEnable(record)}>停用</span>
            <span className='operationsColor' onClick={()=>editMessage(record)}>编辑</span>
          </div>
        }else{
          return <div>
            <span className='operationsColor' onClick={()=>changeEnable(record)}>启用</span>
            <span className='operationsColor' onClick={()=>editMessage(record)}>编辑</span>
          </div>
        }
      }
    },
  ]
  //启用/停用
  const changeEnable=(key)=>{
    Modal.confirm({
      title: '提示',
      content:(key.isEnable===true?'确认要停用此消息？':'确认要启用此消息？'),
      onOk() {
        dispatch({type:'systemMessage/initail',payload:{loading:true}})
        dispatch({
          type:'systemMessage/changeEnable',
          payload:{
            code:key.code,
            isEnable:!key.isEnable,
          }
        })
      },
      onCancel() {},
    });
  }
  //编辑
  const editMessage=(key)=>{
    let typeArr;
    if(!!key.messageType){
      typeArr=key.messageType.split('/')
    }
    dispatch({
      type:'systemMessage/initail',
      payload:{
        describes:key.describes,
        code:key.code,
        messageType:key.messageType,
        template:key.template,
        editStatus:true,
        messageTypes:typeArr,
      }
    })
  }
  //编辑时确定
  const editOk=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      dispatch({type:'systemMessage/initail',
        payload:{
          loading:true,
          describes:values.describes,
          messageType:values.messageTypes.join('/'),
          template:values.template,
          code:code,
      }})
      dispatch({
        type:'systemMessage/editOk',
        payload:{
          describes:values.describes,
          messageType:values.messageTypes.join('/'),
          template:values.template,
          code:code,
        }
      })
    })
    resetFields();
  }
  //编辑时取消
  const editCancel=()=>{
    resetFields();
    dispatch({
      type:'systemMessage/initail',
      payload:{
        describes:'',
        code:'',
        messageType:'',
        template:'',
        messageTypes:[],
        editStatus:false,
        loading:false,
      }
    })
  }
  //搜索
  const serachClick=()=>{
    form.validateFields((err,values)=>{
      console.log(values);
    })
  }
  const resetClick=()=>{
    form.resetFields();
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    showTotal:total => `共 ${total} 项`,
    onChange:(page)=>{
      dispatch({type:'systemMessage/initail',payload:{loading:true}})
      dispatch({
        type:'systemMessage/findAll',
        payload:{
          pageNo:page-1,
          pageSize:10,
        }
      })
    }
  }
  return (
    <div>
      {/*<Form inline style={{margin:'20px 0'}}>
  			<FormItem
  				label="关键字"
  			>
  				{getFieldDecorator('keyword', {
  				})(
  					<Input placeholder="请输入消息内容或编号"/>
  				)}
  			</FormItem>
  			<FormItem
  				label='用户角色'
  			>
  				{getFieldDecorator('user', {
  				})(
  					<Select style={{minWidth:'150px'}}></Select>
  				)}
  			</FormItem>
  			<FormItem
  				label='消息方式'
  			>
  				{getFieldDecorator('informationWay', {
  				})(
  					<Select style={{minWidth:'150px'}}></Select>
  				)}
  			</FormItem>
  			<FormItem
  				label='状态'
  			>
  				{getFieldDecorator('status', {
  				})(
  					<Select style={{minWidth:'150px'}}></Select>
  				)}
  			</FormItem>
  			<Button style={{margin:'0 6px 0 0'}} onClick={serachClick} type="primary">搜索</Button>
  			<Button type='ghost' onClick={resetClick}>重置</Button>
  		</Form>*/}
      <Table columns={columns} loading={loading}
        dataSource={messageData}
        pagination={pagination}

      />
      <Modal title='编辑' visible={editStatus}
        onOk={editOk} onCancel={editCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label='消息标题'>
           {getFieldDecorator('describes', {
             initialValue:describes,
              rules: [{ required: true, message: '' },],
              })(
                <Input type='text'/>
             )}
           </FormItem>
          <FormItem {...formItemLayout} label='消息内容'>
           {getFieldDecorator('template', {
             initialValue:template,
              rules: [{ required: true, message: '必填' },],
              })(
                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
             )}
          </FormItem>
          <FormItem {...formItemLayout} label='消息类型'>
            {getFieldDecorator('messageTypes', {
              initialValue:messageTypes,
               rules: [{ required: true, message: '必选' },],
               })(
                <CheckboxGroup options={plainOptions} />
             )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({systemMessage}) {
  return {systemMessage }
}

export default connect(mapStateToProps)(Form.create()(SystemMessage));
