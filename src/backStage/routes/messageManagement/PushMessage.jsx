import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Tabs,Cascader,Select,Modal} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import wenzi from '../../assets/images/wenzi.png'
import './PushMessage.css'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
function PushMessage({dispatch,form,pushMessage}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {cascaderArr,showPicList,sendTable,
    pageNo,total,receiveArea,title,toRoleName,loading,
  }=pushMessage;
  const toRoleNameArr=[
    {
      value: '独立经纪人',
      label: '独立经纪人',
      children: [
        {
          value: '师傅',
          label: '师傅',
        },
        {
          value: '徒弟',
          label: '徒弟',
        },
      ],
    },
    {
      value: '导师团队经纪人',
      label: '导师团队经纪人',
    },
    {
      value: '导师角色',
      label: '导师角色',
    },
  ]
  //查看推送消息列表
  const callback=(key)=>{
    if(key=='已发送'){
      dispatch({type:'pushMessage/initail',payload:{loading:true}})
      dispatch({
        type:'pushMessage/callback',
        payload:{
          pageNo:0,
          pageSize:10,
        }
      })
    }
  }

  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'pushMessage/initail',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
  const sendMessage=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      console.log(values,'values');
      let areaPath;
      if(!!values.receiveArea){
        areaPath='/'+values.receiveArea.join('/')
      }else{
        areaPath='-';
      }
      let toRoleName;
      if(!!values.toRoleName){
        toRoleName=values.toRoleName.join('-')
      }
      let pic;
      if(showPicList.length!=0){
        pic=showPicList[0].id
      }
      dispatch({
        type:'pushMessage/sendMessage',
        payload:{
          toRoleName:toRoleName,
          receiveArea:areaPath,
          title:values.title,
          message:values.message,
          picKey:pic,
        }
      })
    })
    resetFields();
  }
  const columns=[
    {
      title:'消息类型',
      render:(record)=>{
        if(record.picKey){
          if(record.isDeleted===true){
            return (
              <div>
                <span className='showPic' style={{backgroundImage:`URL(${record.picKey})`}}>
                  <span className='isdeleted'>已删除</span>
                </span>
              </div>
            )
          }else{
            return (
              <span className='showPic' style={{backgroundImage:`URL(${record.picKey})`}}></span>
            )
          }
        }else{
          return (
            <span className='showPic' style={{backgroundImage:`URL(${wenzi})`}}></span>
          )
        }
      }
    },
    {
      title:'',
      render:(record)=><div>
        <span>{record.picKey==''?'[文字] ':'[图片] '}</span>
        <span>{record.title}</span>
      </div>
    },
    {
      title:'接收区域',
      dataIndex:'receiveArea',
    },
    {
      title:'接收角色',
      dataIndex:'toRoleName',
    },
    {
      title:'发送时间',
      dataIndex:'sendDateTime',
    },
    {
      title:'操作',
      render:record=>{
        if(record.isDeleted===true){
          return <span className='yishanchu'>已删除</span>
        }else{
          return (
            <div>
              <span>{record.sendStatus}</span>
              <span className='operationsColor' onClick={()=>{deleteMessage(record.key)}}>删除</span>
            </div>
          )
        }
      }
    }
  ]
  //删除
  const deleteMessage=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除？',
      onOk() {
        dispatch({type:'pushMessage/initail',payload:{loading:true}})
        dispatch({
          type:'pushMessage/deleteMessage',
          payload:{
            id:key
          }
        })
      },
      onCancel() {},
    });
  }
  //搜索
  const searchClick=()=>{
    form.validateFields((err,values)=>{
      let areaPath;
      if(!!values.receiveAreaTable){
        areaPath='/'+values.receiveAreaTable.join('/')
      }
      let toRoleName;
      if(!!values.toRoleNameTable){
        toRoleName=values.toRoleNameTable.join('-')
      }
      dispatch({type:'pushMessage/initail',payload:{loading:true}})
      dispatch({
        type:'pushMessage/callback',
        payload:{
          pageNo:0,
          pageSize:10,
          receiveArea:areaPath,
          title:values.keyword,
          toRoleName:toRoleName,
        }
      })
    })
  }
  //重置
  const resetClick=()=>{
    dispatch({type:'pushMessage/initail',payload:{loading:true}})
    dispatch({
      type:'pushMessage/callback',
      payload:{
        pageNo:0,
        pageSize:10,
        receiveArea:'',
        title:'',
        toRoleName:'',
      }
    })
    resetFields();
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    showTotal:total => `共 ${total} 项`,
    onChange:(page)=>{
      dispatch({type:'pushMessage/initail',payload:{loading:true}})
      dispatch({
        type:'pushMessage/callback',
        payload:{
          pageNo:page-1,
          pageSize:10,
          receiveArea:receiveArea,
          title:title,
          toRoleName:toRoleName,
        }
      })
    }
  }
  return (
    <div>
      <Tabs defaultActiveKey="新建群发消息" onChange={callback} type='card'>
        <TabPane tab="新建群发消息" key="新建群发消息">
          <Form inline style={{margin:'20px 0'}}>
    				<FormItem
    					label="接收区域"
    				>
    					{getFieldDecorator('receiveArea', {
    					})(
    						<Cascader placeholder='--' changeOnSelect={true}
                  options={cascaderArr}
                />
    					)}
    				</FormItem>
            <FormItem label='接收角色'>
              {getFieldDecorator('toRoleName', {
    					})(
    						<Cascader placeholder='--' changeOnSelect={true}
                  options={toRoleNameArr}
                />
    					)}
            </FormItem>
            <div className='showArtic'>
              <Tabs type='card'>
                <TabPane tab='文字消息' key='文字消息'>
                  <div className='textareaStyle'>
                    <FormItem>
                      {getFieldDecorator('message', {
            					})(
                          <Input type="textarea"/>
            					)}
                    </FormItem>
                  </div>
                  <div className='titleStyle'>
                    <FormItem>
                      {getFieldDecorator('title', {
            					})(
                        <Input placeholder='请输入标题，最多30个字' style={{margin:'5px 0'}}/>
            					)}
                    </FormItem>
                  </div>
                </TabPane>
                <TabPane tab='图片消息' key='图片消息'>
                  <div className='uploadParent picMessage'>
                    <DxUpLoadPic {...shopsUplod}/>
                  </div>
                </TabPane>
                {/*<TabPane tab='选择素材' key='选择素材'>
                  <p className='sucai'>暂无素材</p>
                </TabPane>*/}
              </Tabs>
              <Button type='primary' onClick={sendMessage}>发送</Button>
            </div>
    			</Form>
        </TabPane>
        <TabPane tab='已发送' key='已发送'>
          <Form inline style={{margin:'20px 0'}}>
            <FormItem
    					label="关键字"
    				>
    					{getFieldDecorator('keyword', {
    					})(
    						<Input placeholder='请输入消息标题'/>
    					)}
    				</FormItem>
            <FormItem
    					label="接收区域"
    				>
    					{getFieldDecorator('receiveAreaTable', {
    					})(
    						<Cascader placeholder='--' changeOnSelect={true}
                  options={cascaderArr}
                />
    					)}
    				</FormItem>
            <FormItem label='接收角色'>
              {getFieldDecorator('toRoleNameTable', {
    					})(
    						<Cascader placeholder='--' changeOnSelect={true}
                  options={toRoleNameArr}
                />
    					)}
            </FormItem>
            <Button type="primary" onClick={searchClick} style={{margin:'0 6px 0 0'}}>搜索</Button>
            <Button type='ghost' onClick={resetClick} >重置</Button>
          </Form>
          <Table columns={columns} dataSource={sendTable}
            pagination={pagination} loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

function mapStateToProps({pushMessage}) {
  return {pushMessage }
}

export default connect(mapStateToProps)(Form.create()(PushMessage));
