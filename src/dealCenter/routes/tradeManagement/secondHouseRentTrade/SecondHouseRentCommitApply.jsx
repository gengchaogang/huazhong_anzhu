import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Input,Row,Col,Table,Form,Button,Radio,Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import {
  getNumByPersent,
  floorTwoNumber,
  accMul,
  accSub,
} from '../../../../commons/utils/publicFunction'
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseRentTradeDetails from '../../../components/secondHouseRentTrade/SecondHouseRentTradeDetails'
import SHRentCommitApplyModal from '../../../components/secondHouseRentTrade/SHRentCommitApplyModal'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
import ShRefundFormItem from '../../../components/ShRefundFormItem'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './SecondHouseRentCommitApply.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const bankOptions=[
  {
    label:'中国银行',
    value:'中国银行',
  },{
    label:'中国农业银行',
    value:'中国农业银行',
  },{
    label:'中国工商银行',
    value:'中国工商银行',
  },{
    label:'中国建设银行',
    value:'中国建设银行',
  }
];
const SecondHouseRentCommitApply=({dispatch,secondHouseRentCommitApply,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
  setFieldsValue,
  getFieldValue,
  }})=>{
  const{
    trackJSON,
    commitInfo,
    promptObj,
    isFailCommit,
    upLoadPicList,
    canBeRelease,
    commitType,
    commissionType,
    releaseIntention,
    auditorList,
    applyModal,
    houseInfo,
  }=secondHouseRentCommitApply;
  function updateCommitApply(){
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseRentCommitApply/checkPreCommitApply',
        payload:data,
      })
    });
  }
  const commitData=!!commitInfo?JSON.parse(commitInfo):{};
  return (
    <div className='secondHouseRentCommitApply'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentCommitApply/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentCommitApply/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      {!!applyModal.visible && <SHRentCommitApplyModal
        isFailCommit={isFailCommit} {...applyModal} auditorList={auditorList} houseInfo={houseInfo} onOk={(value)=>dispatch({
        type:'secondHouseRentCommitApply/doCommitAppply',
        payload:value,
      })} onCancel={()=>dispatch({type:'secondHouseRentCommitApply/closeApplyModal'})} upPicChange={(arr)=>dispatch({
        type:'secondHouseRentCommitApply/changeApplyModalUpPicList',
        payload:arr,
      })}/>}
      <Form>
        {!!canBeRelease && <DxPanel title='成交资金释放'>
          <div>
          {!!releaseIntention && <div className='releaseItem'>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='释放类型'
                  {...formItemLayout}
                >
                  {getFieldDecorator('intention_releaseType', {
                    initialValue:'意向金',
                  })(
                    <Input type='text' disabled/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12} style={{display:'none'}}>
                <FormItem
                  label='收费流水号'
                  {...formItemLayout}
                >
                  {getFieldDecorator('intention_inComeSerialNumber', {
                    initialValue:releaseIntention.inComeSerialNumber,
                  })(
                    <Input type='text' disabled/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='释放金额'
                  {...formItemLayout}
                >
                  {getFieldDecorator('intention_releaseAmount', {
                    initialValue:releaseIntention.amount,
                  })(
                    <Input type='text' disabled addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div className='releaseItem_releaseTo'>
              <Row>
                <Col sm={24} md={12}>
                  <Row>
                    <Col span={6} className='dhq_label'>收款方：</Col>
                    <Col span={14}>
                      <RadioGroup onChange={(e)=>dispatch({
                          type:'secondHouseRentCommitApply/onIntResToChange',
                          payload:e.target.value,
                        })} value={releaseIntention.releaseTo}>
                        <RadioButton value='客户'>客户</RadioButton>
                        <RadioButton value='业主'>业主</RadioButton>
                      </RadioGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>}
          {(!!releaseIntention && releaseIntention.releaseTo==='业主') && <div className='addOwner'>
            <ShRefundFormItem getFieldDecorator={getFieldDecorator}/>
          </div>}
          <DxUpLoadPic {...upLoadProps} changeList={(arr)=>dispatch({type:'secondHouseRentCommitApply/updatePicList',payload:arr})}
          showPicList={upLoadPicList}/>
          </div>
        </DxPanel>}
        {!!commitInfo && <DxPanel title='成交分佣设置'>
          <div>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='成交佣金总额'
                  {...formItemLayout}
                >
                  {getFieldDecorator('commissionAmount', {
                    initialValue:commitData.commission,
                  })(
                    <Input type='text' disabled addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='平台抽佣'
                  {...formItemLayout}
                >
                  {getFieldDecorator('commissionRate', {
                    initialValue:accMul(commitData.commissionRate,100),
                  })(
                    <Input type='text' disabled addonAfter='%'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='剩余佣金总额'
                  {...formItemLayout}
                >
                  {getFieldDecorator('surplusCommissionAmount', {
                    initialValue:commitData.surplusCommissionAmount,
                  })(
                    <Input type='text' disabled addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            {commitType==='cooperation' && <div>
              <b style={{display:'block'}}>合作成交</b>
              {commissionType==='rate' && <Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='租户经纪人'
                    {...formItemLayout}
                    extra={`佣金收益：${
                      floorTwoNumber(accMul(Number(commitData.surplusCommissionAmount),(getFieldValue('customerBrokerCommissionRate')
                      ?getNumByPersent(getFieldValue('customerBrokerCommissionRate'))
                      :commitData.customerBrokerCommissionRate)))
                  }元`}
                  >
                    {getFieldDecorator('customerBrokerCommissionRate', {
                      initialValue:`${accMul(commitData.customerBrokerCommissionRate,100)}`,
                      rules:[
                        { required: true, message: '租户经纪人佣金比例未输入！' },
                        { type:'string',pattern:/^(100|[1-9]?\d(\.\d?)?)$/, message: '输入内容非法' },
                      ],
                    })(
                      <Input type='text' addonAfter='%'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='房源经纪人'
                    {...formItemLayout}
                    extra={`佣金收益：${
                      floorTwoNumber(accMul(Number(commitData.surplusCommissionAmount),Number(getFieldValue('customerBrokerCommissionRate')
                      ?(accSub(1,getNumByPersent(getFieldValue('customerBrokerCommissionRate'))))
                      :commitData.brokerCommissionRate)))
                    }元`}
                  >
                    {getFieldDecorator('brokerCommissionRate', {
                      initialValue:accMul(commitData.brokerCommissionRate,100),
                    })(
                      <span>
                        {
                          getFieldValue('customerBrokerCommissionRate')
                            ?(accSub(100,(getFieldValue('customerBrokerCommissionRate'))))
                            :`${accMul(commitData.brokerCommissionRate,100)}`
                        }
                        %
                      </span>
                    )}
                  </FormItem>
                </Col>
              </Row>}
              {commissionType==='quota' && <Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='租户经纪人'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('customerBrokerCommissionAmount', {
                      initialValue:commitData.customerBrokerCommissionAmount,
                    })(
                      <Input type='text' disabled addonAfter='元'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='房源经纪人'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('brokerCommissionAmount', {
                      initialValue:commitData.brokerCommissionAmount,
                    })(
                      <Input type='text' disabled addonAfter='元'/>
                    )}
                  </FormItem>
                </Col>
              </Row>}
            </div>}
            {commitType==='own' && <div>
              <b style={{display:'block'}}>自有客户</b>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='租户经纪人'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('brokerCommissionAmount', {
                      initialValue:commitData.brokerCommissionAmount,
                    })(
                      <Input type='text' disabled addonAfter='元'/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>}
          </div>
          <p>注：以上数值仅供参考，最终结果以实际分佣数值为准。</p>
        </DxPanel>}
      </Form>
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={updateCommitApply}>申请成交</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentCommitApply.propTypes = {
  secondHouseRentCommitApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentCommitApply}) {
  return {secondHouseRentCommitApply}
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default connect(mapStateToProps)(Form.create()(SecondHouseRentCommitApply));
