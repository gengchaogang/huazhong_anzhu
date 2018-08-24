import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {
  isNull,
} from '../../../../commons/utils/currencyFunction'
import {
  getNumByPersent,
  accMul,
} from '../../../../commons/utils/publicFunction'
import {Input,Row,Col,Table,Form,Button,Radio,Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
import SHSellCommitApplyModal from '../../../components/secondHouseSellTrade/SHSellCommitApplyModal'
import ShRefundFormItem from '../../../components/ShRefundFormItem'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './SecondHouseSellCommitApply.css'
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
const SecondHouseSellCommitApply=({dispatch,secondHouseSellCommitApply,form: {
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
    upLoadPicList,
    canBeRelease,
    commitType,
    commissionType,
    auditorList,
    applyModal,
    releaseIntention,
    releasePayDown,
    houseInfo,
    isFailCommit,
  }=secondHouseSellCommitApply;
  let ownerAdd=false;
  function updateCommitApply(){
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseSellCommitApply/checkPreCommitApply',
        payload:data,
      })
    });
  }
  const commitData=!!commitInfo?JSON.parse(commitInfo):{};
  return (
    <div className='secondHouseSellCommitApply'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellCommitApply/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellCommitApply/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      {!!applyModal.visible && <SHSellCommitApplyModal {...applyModal} isFailCommit={isFailCommit} auditorList={auditorList} houseInfo={houseInfo} onOk={(value)=>dispatch({
        type:'secondHouseSellCommitApply/doCommitAppply',
        payload:value,
      })} onCancel={()=>dispatch({type:'secondHouseSellCommitApply/closeApplyModal'})} upPicChange={(arr)=>dispatch({
        type:'secondHouseSellCommitApply/changeApplyModalUpPicList',
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
                          type:'secondHouseSellCommitApply/onIntResToChange',
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
          {!!releasePayDown && <div className='releaseItem'>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='释放类型'
                  {...formItemLayout}
                >
                  {getFieldDecorator('downPay_releaseType', {
                    initialValue:'首付款',
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
                  {getFieldDecorator('downPay_inComeSerialNumber', {
                    initialValue:releasePayDown.inComeSerialNumber,
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
                  {getFieldDecorator('downPay_releaseAmount', {
                    initialValue:releasePayDown.amount,
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
                          type:'secondHouseSellCommitApply/onDowResToChange',
                          payload:e.target.value,
                        })} value={releasePayDown.releaseTo}>
                        <RadioButton value='客户'>客户</RadioButton>
                        <RadioButton value='业主'>业主</RadioButton>
                      </RadioGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>}
          {((!!releasePayDown && releasePayDown.releaseTo==='业主') || (!!releaseIntention && releaseIntention.releaseTo==='业主')) && <div className='addOwner'>
            <ShRefundFormItem getFieldDecorator={getFieldDecorator}/>
          </div>}
          <DxUpLoadPic {...upLoadProps} changeList={(arr)=>dispatch({type:'secondHouseSellCommitApply/updatePicList',payload:arr})}
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
                    label='买方经纪人'
                    {...formItemLayout}
                    extra={`佣金收益：${
                      Math.floor(Number(commitData.surplusCommissionAmount)*Number(getFieldValue('customerBrokerCommissionRate')
                      ?getNumByPersent(getFieldValue('customerBrokerCommissionRate'))
                      :commitData.customerBrokerCommissionRate))
                  }元`}
                  >
                    {getFieldDecorator('customerBrokerCommissionRate', {
                      initialValue:`${accMul(commitData.customerBrokerCommissionRate,100)}`,
                      rules:[
                        { required: true, message: '买方经纪人佣金比例未输入！' },
                        { type:'string',pattern:/^(100|[1-9]?\d(\.\d?)?)$/, message: '输入内容非法' },
                      ],
                    })(
                      <Input type='text'  addonAfter='%'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='卖方经纪人'
                    {...formItemLayout}
                    extra={`佣金收益：${
                      Math.floor(Number(commitData.surplusCommissionAmount)*Number(getFieldValue('customerBrokerCommissionRate')
                      ?(1-getNumByPersent(getFieldValue('customerBrokerCommissionRate')))
                      :commitData.brokerCommissionRate))
                    }元`}
                  >
                    {getFieldDecorator('brokerCommissionRate', {
                      initialValue:`${accMul(commitData.brokerCommissionRate,100)}`,
                    })(
                      <span>
                        {
                          getFieldValue('customerBrokerCommissionRate')
                            ?(100-(getFieldValue('customerBrokerCommissionRate')))
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
                    label='买方经纪人'
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
                    label='卖方经纪人'
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
                    label='卖方经纪人'
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
            <p>注：以上数值仅供参考，最终结果以实际分佣数值为准。</p>
          </div>
        </DxPanel>}
      </Form>
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={updateCommitApply}>申请成交</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellCommitApply.propTypes = {
  secondHouseSellCommitApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellCommitApply}) {
  return {secondHouseSellCommitApply}
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default connect(mapStateToProps)(Form.create()(SecondHouseSellCommitApply));
