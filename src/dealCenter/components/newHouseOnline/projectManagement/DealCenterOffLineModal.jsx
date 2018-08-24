import React from 'react'
import {Select,Input,Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col,Form,DatePicker } from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import {isNull} from '../../../../commons/utils/currencyFunction'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import './dealCenterOffLineModal.css'
const Step = Steps.Step;
const FormItem=Form.Item;
const Option=Select.Option
let stepState={};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formItemLayout1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};
function DealCenterOffLineModal({projectManagement,dispatch,form}){
  const {getFieldDecorator}=form
  const {
    employees,
    projectId,
    currentRecord,
    detailsTableData,
    visible,
    showPicList,
    // offLineTime,
    userName,
  }=projectManagement
  console.log('currentRecord',currentRecord);
  switch(currentRecord){
    case '等待受理':
      stepState={
        current:0,
        status:'waiting',
      };
      break;
    case '贷款申请驳回':
      stepState={
        current:1,
        status:'error',
        description1:'已驳回'
      };
      break;
    case '等待批款':
      stepState={
        current:2,
        status:'waiting'
      };
      break;
    case '批款驳回':
      stepState={
        current:2,
        status:'error',
        description2:'已驳回'
      };
      break;
    case '已批款':
      stepState={
        current:2,
        status:'finish',
      };
      break;

    default:
      break;
  }
  const handleCancel=()=>{
    dispatch({
      type:"projectManagement/showOffLineModal",
      payload:{
        visible:false,
        showPicList:[],
      }
    })
    form.resetFields()
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    form.validateFields((err, values) => {
      const picList=[]
      if (!err) {
        // values.offLineTime=offLineTime;
        values.projectId=projectId;
        if(showPicList.length!==0){
          showPicList.map(item=>{
            picList.push(
              item.id
            )
            values.accessCode=picList;
          })
        }
        const postAgr = {
          employeesId:values.employees,
          accessCode:picList,
          projectId:projectId,
          description:values.description,
        }
        console.log('Received values of form: ', postAgr);
        dispatch({
          type:"projectManagement/offLine",
          payload:postAgr
        })
      }
    });
  }
  const upLoadPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:5,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    hideName:true,
    changeList:(data)=>{
      dispatch({
        type:"projectManagement/changePicList",
        payload:data
      })
    },//更新list回调
  }
  const columns=[{
      title:"项目名称",
      dataIndex:"name",
    },{
      title:"所在区域",
      dataIndex:"areaPath"
    },{
      title:"带看数",
      dataIndex:"lookNumber"
    },{
      title:"已售优惠",
      dataIndex:'discount'
    },{
      title:"成交套数",
      dataIndex:"transactionsNumber",
      render:(text)=>currentRecord.transactions,
    },{
      title:"创建时间",
      dataIndex:"createDateTime"
    },{
      title:"创建人",
      dataIndex:"createUser"
    },{
      title:"房源销控",
      dataIndex:"sellTotle"
    }
    // ,{
    //   title:"操作",
    //   render:(text,record,index)=>{
    //     return(
    //       <span className="toDetail">项目详情</span>
    //     )
    //   }
    // }
  ]
  const tableData=[{
    key:currentRecord.id,
    name:currentRecord.name,
    areaPath:currentRecord.areaPath,
    lookNumber:currentRecord.lookNumber,
    transactionsNumber:currentRecord.transactionsNumber,
    discount:currentRecord.discount,
    createDateTime:currentRecord.createDateTime,
    createUser:currentRecord.createUser,
    sellTotle:currentRecord.sellTotle,
  }]
  // const onDatePickerChange=(date, dateString)=>{
  //   dispatch({
  //     type:"projectManagement/saveDate",
  //     payload:{
  //       offLineTime:dateString
  //     }
  //   })
  // }
  const onSelectChange=(value,option)=>{
    dispatch({
      type:"projectManagement/saveUserName",
      payload:{
        userName:option.props.children
      }
    })
  }
  const stepList = [
    {
      title:'申请下架',
      description:stepState.description0,
    },{
      title:'下架审核',
      description:stepState.description1,
    },{
      title:'项目已下架',
      description:stepState.description2,
    }
  ]
  return(
    <Modal
      width={900}
      visible={visible}
      footer={<div>
        <Button type="ghost" onClick={handleCancel}>关闭</Button>
        <Button onClick={handleSubmit} type="primary">提交申请</Button>
      </div>}
      onCancel={handleCancel}
      title="新房项目申请下架"
      >
      <div className="dealCenterOffLineModal">
        <DxSteps current={isNull(stepState.current,0)} status={isNull(stepState.status,'process')}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
        {/*<Steps current={stepState.current} status={stepState.status}>
          <Step description={stepState.description0} title="申请下架" />
          <Step description={stepState.description1} title="下架审核" />
          <Step description={stepState.description2} title="项目已下架" />
        </Steps>*/}
        <DxPanelMini title='新房项目'>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </DxPanelMini>
        <DxPanelMini title='下架信息' hasPadding={true}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="下线理由" {...formItemLayout1}>
                {
                  form.getFieldDecorator('description',{
                    rules:[{required:false,message:'请输入下线理由和应对办法!'}]})(
                      <Input placeholder='请在此输入下线理由和应对办法' type="textarea" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem {...formItemLayout}>
                <DxUpLoadPic {...upLoadPicProps}/>
              </FormItem>
            </Col>
          </Row>
          {/*<Row>
            <Col sm={24} md={12}>
              <FormItem label="下架时间" {...formItemLayout}>
                {
                  form.getFieldDecorator('offLineTime',{
                    rules:[{required:true,message:'请选择下架日期!'}]})(
                      <DatePicker onChange={onDatePickerChange} size="large" />
                    )
                }
              </FormItem>
            </Col>
          </Row>*/}
          <Row>
            <Col sm={24} md={12}>
              <FormItem {...formItemLayout} label="审核人员">
    						{getFieldDecorator('employees', {
    							rules: [
    								{ required: true, message: '请选择项目发布审核人员' },
    							],
    						})(
                  <Select>
                    {!!employees?employees.map(function(item){
                      return(<Option key={`${item.userId}`} value={`${item.userId}`}>{item.name}</Option>)
                    }):null}
                  </Select>
    						)}
    					</FormItem>
            </Col>
          </Row>
        </Form>
      </DxPanelMini>
      </div>
    </Modal>
  )
}
function mapStateToProps({projectManagement}){
  return{
    projectManagement
  }
}
export default connect(mapStateToProps)(Form.create({})(DealCenterOffLineModal))
