import React, { PropTypes } from 'react'
import { routerRedux,Link } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Checkbox,Select} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import PromptModal from '../../../../commons/View/PromptModal'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
const FormItem = Form.Item;
const Option = Select.Option;
import './NHGroupBuyRefundApply.css'
const steps =[
  '申请退款',
  '退款审核',
  '财务审核',
  '执行退款',
];

const tableColumns=[
  {
    title:'退款类型',
    dataIndex:'refundType',
    key:'refundType',
  },{
    title:'支付项目',
    dataIndex:'projectName',
    key:'projectName',
  },{
    title:'支付订单',
    dataIndex:'orderNumber',
    key:'orderNumber',
  },{
    title:'支付方式',
    dataIndex:'payWay',
    key:'payWay',
  },
  {
    title:'支付流水号',
    dataIndex:'paySerialNumber',
    key:'paySerialNumber',
  },
  {
    title:'支付客户',
    dataIndex:'customerName',
    key:'customerName',
  },{
    title:'客户电话',
    dataIndex:'customerPhone',
    key:'customerPhone',
  },{
    title:'支付时间',
    dataIndex:'payTime',
    key:'payTime',
  },{
    title:'支付金额',
    dataIndex:'payAmount',
    key:'payAmount',
  },{
    title:'支付状态',
    dataIndex:'payStatus',
    key:'payStatus',
  },{
    title:'操作',
    dataIndex:'operation',
    key:'operation',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/newHouseTrade/newHouseTradeInfoDetails',
      state:{
        groupKey:record.groupKey,
      }
    }}>交易详情</Link>,
  }
]
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const NHGroupBuyRefundApply=({dispatch,nhGroupBuyRefundApply:{
  promptObj,
  upLoadPicList,
  auditorList,
  orderInfo,
  buttonLoading,
  groupBuyId,
},form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  setFieldsValue,
  getFieldValue,
  resetFields,
}})=>{

  function updateApplyForm(){
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'nhGroupBuyRefundApply/postRefundApplyData',
        payload:data,
      })
    });
  }
  console.log('orderInfo',orderInfo);
  return (
    <div className='nhGroupBuyRefundApply applyInfoCom'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'nhGroupBuyRefundApply/closePrompt'})} onCancel={()=>dispatch({type:'nhGroupBuyRefundApply/closePrompt'})}/>
      <DxPanel title='电商团购退款申请'>
        <DxSteps current={0} status='process'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
        </DxSteps>
        <DxPanelMini title='订单信息'>
          <Table dataSource={orderInfo?[JSON.parse(orderInfo)]:[]} rowKey={(record)=>`key_${record.groupBuyId}`} columns={tableColumns} pagination={false}/>
        </DxPanelMini>
        <DxPanelMini title='退款理由'>
          <div style={{paddingTop:'20px'}}>
            <FormItem
              label='退款理由描述'
              hasFeedback
              labelCol={{xs: 8,sm:6,md:4,lg:3}}
              wrapperCol={{xs: 16,sm:14,md:12,lg:10}}
              >
              {getFieldDecorator('reason', {
                validateTrigger: 'onBlur',
                rules: [
                  {required: true, message: '退款申请原因未填写' },
                  {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
                  {max:50, message: '最多可输入50个中文字符'},
                ],
              })(
                <Input type='textarea' autosize={{ minRows: 2, maxRows: 2 }} placeholder='请在此输入退款申请原因'/>
              )}
            </FormItem>
            <DxUpLoadPic {...upLoadProps} changeList={(arr)=>dispatch({type:'nhGroupBuyRefundApply/updatePicList',payload:arr})}
            showPicList={upLoadPicList}/>
          </div>
        </DxPanelMini>
        <DxPanelMini title='选择审核人员'>
          <div style={{paddingTop:'20px'}}>
            <FormItem
              label='审核人员'
              labelCol={{xs: 8,sm:6,md:4,lg:3}}
              wrapperCol={{xs: 10,sm:8,md:6,lg:4}}
            >
             {getFieldDecorator('auditor', {
               rules: [
                 { required: true, message: '审核对象未选择' },
               ],
             })(
               <Select
                 style={{width:'100%'}}
                 showSearch
                 labelInValue
                 placeholder='请选择或搜索审核对象'
                 optionFilterProp='children'
                 filterOption={(input,option)=>filterAuditor(input,option)}
               >
                 {auditorList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
               </Select>
             )}
            </FormItem>
          </div>
        </DxPanelMini>
        <div className='anzhua_button_bottom'>
          <Button type='primary' onClick={updateApplyForm} loading={buttonLoading}>提交申请</Button>
          <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>取消</Button>
        </div>
      </DxPanel>
    </div>
  )
}

NHGroupBuyRefundApply.propTypes = {
  nhGroupBuyRefundApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
function mapStateToProps({nhGroupBuyRefundApply}) {
  return {nhGroupBuyRefundApply}
}
export default connect(mapStateToProps)(Form.create()(NHGroupBuyRefundApply));
