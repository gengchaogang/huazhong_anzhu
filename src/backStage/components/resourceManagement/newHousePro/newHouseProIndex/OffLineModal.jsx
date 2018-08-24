import React from 'react'
import {Input,Modal, Button, Steps, Table, message,Timeline,Icon,Row,Col,Form,DatePicker } from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxUpLoadPic from '../../../../../commons/View/DxUpLoadPic'
import './offLineModal.css'
const Step = Steps.Step;
const FormItem=Form.Item;
let stepState={};

function OffLineModal({newHouseProIndex,dispatch,form}){
  const {getFieldDecorator}=form
  const {currentRecord,detailsTableData,visible,showPicList,offLineDate}=newHouseProIndex
  // console.log('currentRecord',currentRecord);
  switch(currentRecord.applyAuditStatus){
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
      type:"newHouseProIndex/showOffLineModal",
      payload:{
        visible:false
      }
    })
    form.resetFields()
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    form.validateFields((err, values) => {
      const picList=[]
      if (!err) {
        values.offLineTime=offLineDate;
        values.projectId=currentRecord.key;
        if(showPicList.length!==0){
          showPicList.map(item=>{
            picList.push(
              item.id
            )
            values.accessCode=picList;
          })
        }
        dispatch({
          type:"newHouseProIndex/offLine",
          payload:values
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
        type:"newHouseProIndex/changePicList",
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
      dataIndex:"viewsCount"
    },{
      title:"已售优惠",
      dataIndex:'sellediscount'
    },{
      title:"成交套数",
      dataIndex:"sellCount"
    },{
      title:"创建时间",
      dataIndex:"createDateTime"
    },{
      title:"创建人",
      dataIndex:"createUser"
    },{
      title:"房源销控",
      dataIndex:"housingSalesControl"
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <span className="toDetail">项目详情</span>
        )
      }
    }]
  const tableData=[{
    key:currentRecord.key,
    name:currentRecord.name,
    areaPath:currentRecord.areaPath,
    viewsCount:currentRecord.lookNumber,
    sellediscount:currentRecord.discount,
    sellCount:currentRecord.transactionsNumber,
    createDateTime:currentRecord.createDateTime,
    createUser:currentRecord.createUser,
    housingSalesControl:currentRecord.sellTotle,
  }]
  const onDatePickerChange=(date, dateString)=>{
    dispatch({
      type:"newHouseProIndex/saveDate",
      payload:{
        offLineDate:dateString
      }
    })
  }
  return(
    <Modal
      width={900}
      visible={visible}
      footer=""
      onCancel={handleCancel}
      title="新房项目申请下架"
      >
      <div className="offLineModal">
        <Steps current={stepState.current} status={stepState.status}>
          <Step description={stepState.description0} title="解押申请" />
          <Step description={stepState.description1} title="解押办理" />
          <Step description={stepState.description2} title="已批款" />
        </Steps>
        <div>
          <h4 className="title">新房项目</h4>
          <Table
            // dataSource={!!detailsTableData?detailsTableData:[]}
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
        </div>
        <Form onSubmit={handleSubmit}>
          <h4 className="title">下线理由</h4>
          <FormItem label="">
            {
              form.getFieldDecorator('description',{
                rules:[{required:false,message:'请输入下线理由和应对办法!'}]})(
                  <Input placeholder='请在此输入下线理由和应对办法' type="textarea" />
              )
            }
          </FormItem>
          <DxUpLoadPic {...upLoadPicProps}/>
          <h4 className="title">下架时间</h4>
          <FormItem label="">
            {
              form.getFieldDecorator('offLineDate',{
                rules:[{required:false,message:'请选择下架日期!'}]})(
                  <DatePicker onChange={onDatePickerChange} />
                )
            }
          </FormItem>
          <FormItem label="">
            <Button htmlType='submit' type="primary">提交申请</Button>
            <Button type="ghost" onClick={handleCancel}>关闭</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
  )
}
function mapStateToProps({newHouseProIndex}){
  return{
    newHouseProIndex
  }
}
export default connect(mapStateToProps)(Form.create({})(OffLineModal))
