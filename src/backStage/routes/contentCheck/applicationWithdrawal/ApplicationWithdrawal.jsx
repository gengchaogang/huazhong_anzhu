import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader,Select,message} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import './ApplicationWithdrawal.css'
const TabPane = Tabs.TabPane;
const Option=Select.Option;
const FormItem = Form.Item;
function ApplicationWithdrawal({dispatch,form,applicationWithdrawal}) {
  const {cascaderOptions,dataSource,casoptions,status,detailsStatus,
    addTime,
    areaPath,
    finishTime,
    money,
    id,
    name,
    optUserId,
    optUserName,
    optUserType,
    phone,
    reason,
    result,
    dealStatus,
    userType,
    keyword,
    refuseStatus,
    total,
    pageNo,
  }=applicationWithdrawal;
  const {getFieldDecorator}=form;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'申请时间',
      dataIndex:'addTime',
    },
    {
      title:'姓名',
      dataIndex:'name',
    },
    {
      title:'角色',
      dataIndex:'userType',
    },
    {
      title:'地区',
      dataIndex:'areaPath',
    },
    {
      title:'金额(元)',
      dataIndex:'money',
    },
    {
      title:'状态',
      dataIndex:'status',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{operationClick(record)}}>{status=='已处理'?'查看':'处理'}</span>
      </div>
    }
  ]
  const operationClick=(record)=>{
    dispatch({type:'applicationWithdrawal/operationClick',
      payload:{
        id:record.id,
      }
    })
  }
  //搜索
  const search=()=>{
    form.validateFields((err, values)=>{
      let area='';
      if(values.areaPath){
        area=values.areaPath.join('/')
      }
      dispatch({
        type:'applicationWithdrawal/findAll',
        payload:{
          pageNo:0,
          keyword:values.keyword,
          status:status,
          areaPath:area,
        }
      })
    })
  }
  //重置
  const resetField=()=>{
    form.resetFields();
  }
  const callback=(key)=>{
    dispatch({
      type:'applicationWithdrawal/findAll',
      payload:{
        status:key,
        keyword:keyword,
        areaPath:areaPath,
        pageNo:0,
      }
    })
  }
  //同意
  const detailsAgreen=()=>{
    dispatch({
      type:'applicationWithdrawal/detailsAgreen',
      payload:{
        id:id,
        reason:'',
        result:'通过',
        status:status,
      }
    })
  }
  //取消（关闭模态框）
  const detailsCancel=()=>{
    dispatch({
      type:'applicationWithdrawal/initailSuccess',
      payload:{
        detailsStatus:false,
      }
    })
    form.resetFields();
  }
  //拒绝
  const refuse=()=>{
    dispatch({
      type:'applicationWithdrawal/initailSuccess',
      payload:{
        refuseStatus:true,
      }
    })
  }
  //关闭拒绝原因模态框
  const refuseCancel=()=>{
    dispatch({
      type:'applicationWithdrawal/initailSuccess',
      payload:{
        refuseStatus:false,
      }
    })
    form.resetFields();
  }
  //拒绝Ok
  const refuseOk=()=>{
    form.validateFields((errs,values)=>{
      if(!values.reason){
        return message.error('拒绝原因必填')
      }else {
        dispatch({
          type:'applicationWithdrawal/detailsAgreen',
          payload:{
            reason:values.reason,
            status:status,
            id:id,
            result:'拒绝',
            pageNo:0,
          }
        })
        // console.log(values,'values');
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({
        type:'applicationWithdrawal/findAll',
        payload:{
          pageNo:page-1,
          keyword:keyword,
          status:status,
          areaPath:areaPath,
        }
      })
    }
  }
  return (
    <div>
      <Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder='搜索姓名'/>
					)}
				</FormItem>
				<FormItem
					label="地区"
				>
					{getFieldDecorator('areaPath', {
					})(
						<Cascader placeholder='河北省 / 保定' options={casoptions}/>
					)}
				</FormItem>
        <Button type='primary' onClick={search}>搜索</Button>
        <Button type='ghost' onClick={resetField}>重置</Button>
			</Form>
      <Tabs onChange={callback} type="card">
        <TabPane key='待处理' tab="待处理">
          <Table columns={columns}
            dataSource={dataSource}
            pagination={pagination}
          />
        </TabPane>
        <TabPane key='已处理' tab="已处理">
          <Table columns={columns}
            dataSource={dataSource}
            pagination={pagination}
          />
        </TabPane>
      </Tabs>
      <Modal title='提现申请' visible={detailsStatus} onCancel={detailsCancel}
        footer={dealStatus=='待处理'?
          <div>
            <Button type='ghost' onClick={detailsCancel}>取消</Button>
            <Button type='primary' onClick={refuse}>拒绝</Button>
            <Button type='primary' onClick={detailsAgreen}>同意</Button>
          </div>:
          <div>
            <Button type='primary' onClick={detailsCancel}>确定</Button>
          </div>
        }
      >
        <div>
          <div>申请时间：{addTime}</div>
          <div>状态：<span className='dealStatus'>{dealStatus}</span></div>
          <div>姓名：{name}</div>
          <div>手机号码：{phone}</div>
          <div>角色：{userType}</div>
          <div>地区：{areaPath}</div>
          <div>提现金额：{money}元</div>
          {result=='拒绝' && <div>
            <div>审核结果：<span className='resultStatus'>{result}</span></div>
            <div>拒绝原因：<span className='resultStatus'>{reason}</span></div>
            <div>审核人员：{optUserType} {optUserName}</div>
            <div>审核时间：{finishTime}</div>
          </div>}
          {result=='通过' && <div>
            <div>审核结果：<span>{result}</span></div>
            <div>审核人员：{optUserType} {optUserName}</div>
            <div>审核时间：{finishTime}</div>
          </div>}
        </div>
      </Modal>
      <Modal title='拒绝原因' visible={refuseStatus}
        onCancel={refuseCancel} onOk={refuseOk}
      >
        <Form>
          <FormItem
            label="关键字"
          >
            {getFieldDecorator('reason', {
            })(
              <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({applicationWithdrawal}) {
  return {applicationWithdrawal}
}
ApplicationWithdrawal = Form.create({})(ApplicationWithdrawal);
export default connect(mapStateToProps)(ApplicationWithdrawal);
