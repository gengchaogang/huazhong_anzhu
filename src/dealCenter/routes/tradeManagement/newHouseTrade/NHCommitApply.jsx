import React, { PropTypes } from 'react'
import { routerRedux,Link } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Checkbox,Select} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
import PromptModal from '../../../../commons/View/PromptModal'
import DxValueList from '../../../../commons/UI/DxValueList'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
const FormItem = Form.Item;
const Option = Select.Option;
import './NHCommitApply.css'
const steps =[
  '申请成交',
  '成交审核',
  '财务审核',
  '执行分佣',
];

const tableColumns=[
  {
    title: '所属项目',
    dataIndex: 'project',
    key: 'project',
  },{
    title: '物业类型',
    dataIndex: 'propertyType',
    key: 'propertyType',
  },{
    title: '成交房源',
    dataIndex: 'intentionHouse',
    key: 'intentionHouse',
  },{
    title: '团购优惠',
    dataIndex: 'groupBuyType',
    key: 'groupBuyType',
  },{
    title: '实际成交单价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },{
    title: '实际成交总价',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
  },{
    title: '成交佣金',
    dataIndex: 'commission',
    key: 'commission',
  },{
    title: '成交经纪人',
    dataIndex: 'agent',
    key: 'agent',
  },{
    title: '申请时间',
    dataIndex: 'time',
    key: 'time',
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
const NHCommitApply=({dispatch,nhCommitApply:{
  promptObj,
  upLoadPicList,
  auditorList,
  orderInfo,
  commissionInfos,
  buttonLoading,
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
        type:'nhCommitApply/postRefundApplyData',
        payload:data,
      })
    });
  }
  console.log('orderInfo',orderInfo);

  return (
    <div className='nhCommitApply applyInfoCom'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'nhCommitApply/closePrompt'})} onCancel={()=>dispatch({type:'nhCommitApply/closePrompt'})}/>
      <DxPanel title='新房成交申请'>
        <div>
          <DxSteps current={0} status='process'>
            {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
          </DxSteps>
          <DxPanelMini title='成交详情'>
            <Table dataSource={orderInfo?[JSON.parse(orderInfo)]:[]} rowKey={(record)=>`key_${record.groupKey}`} columns={tableColumns} pagination={false}/>
          </DxPanelMini>
          {!!commissionInfos && <DxPanelMini title='佣金分配'  hasPadding={true}>
            <DxValueList valueList={JSON.parse(commissionInfos)}/>
          </DxPanelMini>}
          <DxPanelMini title='成交理由'>
            <div style={{paddingTop:'20px'}}>
              <FormItem
                label='申请说明'
                hasFeedback
                labelCol={{xs: 8,sm:6,md:4,lg:3}}
                wrapperCol={{xs: 16,sm:14,md:12,lg:10}}
                >
                {getFieldDecorator('reason', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {required: true, message: '成交申请原因未填写' },
                    {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
                    {max:50, message: '最多可输入50个中文字符'},
                  ],
                })(
                  <Input type='textarea' autosize={{ minRows: 2, maxRows: 2 }} placeholder='请在此输入成交申请原因'/>
                )}
              </FormItem>
              <DxUpLoadPic {...upLoadProps} changeList={(arr)=>dispatch({type:'nhCommitApply/updatePicList',payload:arr})}
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
        </div>
      </DxPanel>
    </div>
  )
}

NHCommitApply.propTypes = {
  nhCommitApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
function mapStateToProps({nhCommitApply}) {
  return {nhCommitApply}
}
export default connect(mapStateToProps)(Form.create()(NHCommitApply));
