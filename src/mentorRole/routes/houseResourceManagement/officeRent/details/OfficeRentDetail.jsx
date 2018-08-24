import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Steps,Button,Form,message,Input,Modal,Checkbox} from 'antd'
import DxPanel from '../../../../../commons/components/DxPanel'
import OfficeRentDetailOne from './OfficeRentDetailOne'
import OfficeRentDetailImg from './OfficeRentDetailImg'
import OfficeRentDetailBroker from './OfficeRentDetailBroker'
import OfficeRentDetailWatchDetail from './OfficeRentDetailWatchDetail'
import OfficeRentDetailDone from './OfficeRentDetailDone'
import './officeRentDetail.css'
const Step = Steps.Step;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['房源线下已售', '房源信息错误', '包含非法信息','其它'];
function OfficeRentDetail({dispatch,officeRentDetail,form}){
  const {getFieldDecorator}=form;
  const {
    current,
    houseBaseInfo,
    listOwer,
    brokerPromotion,
    guideArr,
    total,
    pageNo,
    status,
    id,
    offLineStatus,
    transCode,
    track,
  }=officeRentDetail;
  const goback=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'officeRentDetail/setState',
      payload:{
        current:0,
      }
    })
  }
  const pageChange=(key)=>{
    dispatch({
      type:'officeRentDetail/findAllGuide',
      payload:{
        pageNo:key-1,
        id:id,
        status:status,
      }
    })
  }
  const radioChange=(key)=>{
    dispatch({
      type:'officeRentDetail/findAllGuide',
      payload:{
        pageNo:0,
        id:id,
        status:(key=='全部'?'':key)
      }
    })
  }
  const steps = [{
    title: '房源详情',
    content: <OfficeRentDetailOne listOwer={listOwer} houseBaseInfo={houseBaseInfo}/>,
    },
    {
      title: '视频图片',
      content: <OfficeRentDetailImg houseBaseInfo={houseBaseInfo}/>,
    },
    {
    title: '代理经纪人',
    content: <OfficeRentDetailBroker brokerPromotion={brokerPromotion}/>,
    },
    {
    title: '带看记录',
    content: <OfficeRentDetailWatchDetail guideArr={guideArr} total={total} pageNo={pageNo} pageChange={pageChange} radioChange={radioChange}/>,
    },
    {
    title: '成交',
    content: <OfficeRentDetailDone track={track}/>,
    },
  ];

  //带看记录的回调
  const next=()=>{
    const currents =current + 1;
    dispatch({
      type:'officeRentDetail/setState',
      payload:{current:currents}
    })
    if(current==4 && transCode){
      dispatch({
        type:'officeRentDetail/getTrack',
        payload:{groupKey:transCode}
      })
    }
  }
  const prev=()=>{
    const currents =current - 1;
    dispatch({
      type:'officeRentDetail/setState',
      payload:{current:currents}
    })
  }
  //下架
  const offLineClick=()=>{
    dispatch({
      type:'officeRentDetail/setState',
      payload:{offLineStatus:true}
    })
  }
  //确定下架
  const offLineOk=()=>{
    form.validateFields((err,values)=>{
      let reason='';
      if(values.offLineReason){
        reason=values.offLineReason.join('/')+'/'+values.offLineReasonEles;
      }else{
        reason=values.offLineReasonEles;
      }
      dispatch({
        type:'officeRentDetail/offLineOk',
        payload:{
          houseId:id,
          offLineReason:reason,
        }
      })
    })
    form.resetFields();
  }
  //取消下架
  const offLineCancel=()=>{
    form.resetFields();
    dispatch({
      type:'officeRentDetail/setState',
      payload:{
        offLineStatus:false,
      }
    })
  }
  return(
    <div>
      <DxPanel title=" ">
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
      </DxPanel>
      <div>{steps[current].content}</div>
      <DxPanel title=" ">
        <div>
          <Button type='primary' onClick={offLineClick}>下架</Button>
          {
            current < steps.length - 1
            &&
            <Button type="primary" onClick={next}>下一步</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('！已经是最后一步了')}>完成</Button>
          }
          {
            current > 0
            &&
            <Button type='ghost' style={{ marginLeft: 8 }} onClick={prev}>
              上一步
            </Button>
          }
          <Button onClick={goback} className='gobacks' type='ghost'>返回</Button>
        </div>
      </DxPanel>
      <Modal title='下架' visible={offLineStatus}
        onOk={offLineOk} onCancel={offLineCancel}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('offLineReason', {
            })(
              <CheckboxGroup options={plainOptions}/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('offLineReasonEles', {
            })(
              <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
function mapStateToProps({officeRentDetail}){
  return{
    officeRentDetail
  }
}
OfficeRentDetail = Form.create({})(OfficeRentDetail);
export default connect(mapStateToProps)(OfficeRentDetail)
