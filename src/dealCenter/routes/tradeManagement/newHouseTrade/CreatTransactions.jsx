import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {Select,Table,Cascader,Button,Form,Input,Row,Col}from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import StepsModal from '../../../../commons/UI/StepsModal'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import PromptModal from '../../../../commons/View/PromptModal'
import BrokerInfoList from '../../../components/NewHouseTrade/BrokerInfoList'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'

import PicList from '../../../../commons/UI/PicList'
import DxPanel from '../../../../commons/components/DxPanel'
import ChooseUserModal from '../../../components/NewHouseTrade/ChooseUserModal'
import ClientInfoList from '../../../components/NewHouseTrade/ClientInfoList'
import NHTradeInfo from '../../../../commons/components/NHTradeInfo'
import ProjectInfo from '../../../components/NewHouseTrade/ProjectInfo'

import './CreatTransactions.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const transactionsOrderTableProps={
  columns:[
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
    }
  ],
  pagination:false,
}
//上传成交合同
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
//上传申请成交照片
const upLoadApplyProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
//成交申请模态框配置
const stepsModalProps={
  title:'新房-成交申请',
  stepList:[
    {
      title:'申请成交'
    },{
      title:'成交审核'
    },{
      title:'财务审核'
    },{
      title:'执行分佣'
    },
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
function CreatTransactions({dispatch,creatTransactions,form:{
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
}}){
  const {
    creatTransactionsModal,
    auditingModal,
    trackJSON,
    promptObj,
    loading,
    houseTreeData,
    houseTreeMap,
    selectHouseKey,
    showHouseObj,
    groupKey,
    projectInfo,
    upLoadPicList,
    projectId,
    applyUploadList,
    applyModal,
    type,
    chooseCustomerModal,
    projectName,
    lastCommitData,
  }=creatTransactions;

  const getFromValue=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'creatTransactions/checkTransactionData',
        payload:data,
      })
    });
  }
  const defalutCommitData = !!lastCommitData?JSON.parse(lastCommitData):{
    unitPrice:'',
    totalPrice:'',
    payType:'',
  }
  const chooseCustomerModalProps={
    title:'请选择已团购客户',
    type:'customer',
    visible:chooseCustomerModal.visible,
    userList:chooseCustomerModal.customerList,
    doSelectUser:(selectId)=>dispatch({
      type:'creatTransactions/selectCustomerKey',
      payload:selectId,
    }),
    doSearch:(searchValue)=>dispatch({
      type:'creatTransactions/searchCustomer',
      payload:searchValue,
    }),
    onOk:()=>dispatch({
      type:'creatTransactions/sureDoSelectCustomer',
    }),
    onCancel:()=>dispatch({
      type:'creatTransactions/giveUpSelectCustomer',
    }),
  }
  const groupBuyHouseProps={
    houseInfo:showHouseObj,
    other:!!showHouseObj.cellStatus?showHouseObj.cellStatus:'',
    hideHead:true,
  }
  const intentionBuyBouseSelectDataProps ={
    options:houseTreeData,
    onChange:(arr)=>{dispatch({type:'creatTransactions/doSelectHouseKey',payload:arr})},
    value:selectHouseKey,
  }
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  let brokerObj={
    name:'',
    phoneNumber:'',
    pic:'',
    gender:'',
    isSelect:false,
    id:'',
  }
  if(!!trackJSON){
    if(!!trackData.brokerInfo && !!trackData.brokerInfo.data){
      brokerObj.pic=trackData.brokerInfo.picUrl?trackData.brokerInfo.picUrl:'';
      trackData.brokerInfo.data.map(item=>{
        if(item.label==='姓名'){
          brokerObj.name=item.value?item.value:'';
        }else if(item.label==='性别'){
          brokerObj.gender=item.value?item.value:'';
        }else if(item.label==='联系电话'){
          brokerObj.phoneNumber=item.value?item.value:'';
        }
      })
    }
  }
  const brokerInfoProps={
    listData:!!trackJSON?[brokerObj]:[],
    doSelect:()=>{},
  }
  return(
    <div className='creatTransactions'>
      <PromptModal {...promptObj} onOk={()=>dispatch({
        type:'creatTransactions/closePrompt',
      })} onCancel={()=>dispatch({
        type:'creatTransactions/closePrompt',
      })}/>
      <ChooseUserModal {...chooseCustomerModalProps}/>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      {(type==='quick' && !!projectName) && <DxPanel title='客户意向项目'>
          <ProjectInfo projectInfo={projectInfo}/>
      </DxPanel>}
      {type==='quick' && <DxPanel title='客户信息'>
        <div className='dealCenter-userMsgBox'>
          <div className='dealCenter-userMsgBox-checkUserBox'>
            <span>请选择团购客户：</span>
            <Button size='small' className='anzhu_button' onClick={()=>dispatch({type:'creatTransactions/openChooseCustomerModal'})}>{(!!chooseCustomerModal.selectCustomerInfo && !!chooseCustomerModal.selectCustomerInfo.show)?'重选团购客户':'选择团购客户'}</Button>
          </div>
          {(!!chooseCustomerModal.selectCustomerInfo && !!chooseCustomerModal.selectCustomerInfo.show) && <ClientInfoList listData={[chooseCustomerModal.selectCustomerInfo]} doSelect={()=>{}}/>}
        </div>
      </DxPanel>}
      {(type==='quick' && !!trackJSON) && <NHTradeInfo trackJSON={trackJSON}/>}
      {type==='normal' && <NHTradeInfo trackJSON={trackJSON} projectInfo={projectInfo}/>}
      {(!!projectId && !!groupKey) && <DxPanel title='实际购买房源'>
        <div className='dealCenter-intentionBuyBouse'>
          <div className='sort-address-msg'>
            <span>意向房源：</span>
            <Cascader {...intentionBuyBouseSelectDataProps} placeholder='请选择团购意向房源' style={{width:'250px'}}/>
            <span style={{paddingLeft:'15px'}}>{selectHouseKey.length==0?'未选择':`已选择：${selectHouseKey.join('/')}`}</span>
          </div>
          {showHouseObj.key!='defalut' &&
          <IntentionHouse {...groupBuyHouseProps}/>}
          <p>提示：默认选择为交易锁定房源，如果修改房源则原锁定房源将被释放。</p>
        </div>
        <Form>
          <Row style={{paddingTop:15}}>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='实际成交单价'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('unitPrice', {
                  initialValue:defalutCommitData.unitPrice,
                  rules: [
                    { required: true, message: '实际成交单价' },
                    { type:'string',pattern:/\d$/, message: '成交单价格式不正确！' },
                  ],
                })(
                  <Input addonAfter='元/㎡' placeholder='请在此输入实际成交单价'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='实际成交总价'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('totalPrice', {
                  initialValue:defalutCommitData.totalPrice.toString(),
                  rules: [
                    { required: true, message: '实际成交总价' },
                    { type:'string',pattern:/\d$/, message: '成交总价格式不正确！' },
                  ],
                })(
                  <Input addonAfter='万' placeholder='请在此输入实际成交总价'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='支付方式'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('payType', {
                  initialValue:defalutCommitData.payType,
                  rules: [{ type: 'string', required: true, message: '支付方式不能为空' }],
                })(
                  <Select placeholder='请选择支付方式'>
                    <Option value='全款购买'>全款购买</Option>
                    <Option value='按揭购买'>按揭购买</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </DxPanel>}
      {!!groupKey && <DxPanel title='请上传成交合同或协议'>
        <DxUpLoadPic {...upLoadProps} changeList={(arr)=>dispatch({type:'creatTransactions/updatePicList',payload:arr})}
        showPicList={upLoadPicList}/>
      </DxPanel>}
      {(!!groupKey && !!trackData.brokerInfo) && <DxPanel title='成交经纪人'>
        <div className='intentionListings'>
          <span className='newHouseTrade_creatTransaction_title'>带看经纪人</span>
          {!!trackJSON && <BrokerInfoList {...brokerInfoProps}/>}
        </div>
      </DxPanel>}
      <div className="anzhua_button_bottom">
        <Button type='primary' onClick={getFromValue}>申请提交</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>取消</Button>
      </div>
      <StepsModal {...stepsModalProps} visible={applyModal.visible} footer={<div style={{textAlign:'right'}} onCancel={()=>dispatch({type:'creatTransactions/clooseApplyModal'})}>
        <Button type='ghost' onClick={()=>dispatch({type:'creatTransactions/clooseApplyModal'})}>取消</Button>
        <Button type='primary' onClick={()=>dispatch({type:'creatTransactions/doApplyTransactions'})}>成交申请</Button>
      </div>}>
        <Table {...transactionsOrderTableProps} dataSource={!!applyModal.orderInfo?[JSON.parse(applyModal.orderInfo)]:[]}/>
        <span className='newHouseTrade_creatTransaction_title'>佣金分配</span>
        {!!applyModal.commissionInfo && <DxShowMsgForm msgData={JSON.parse(applyModal.commissionInfo)}/>}
        <span className='newHouseTrade_creatTransaction_title'>申请说明</span>
        <Input value={applyModal.applyExplain} addonAfter={`${applyModal.applyExplain.length}/20`} onChange={(e)=>dispatch({
            type:'creatTransactions/changeApplyExplain',
            payload:e.target.value,
          })}/>
        <DxUpLoadPic {...upLoadApplyProps} changeList={(arr)=>dispatch({type:'creatTransactions/updateApplyPicList',payload:arr})} showPicList={applyModal.applyPicList}/>
        {applyModal.auditorList.length!=0 && <div>
          <span className='newHouseTrade_creatTransaction_title'>请选择或搜索审核对象</span>
          <Select
            showSearch
            style={{ width: 250 }}
            placeholder='请选择或搜索审核对象'
            optionFilterProp='children'
            value={applyModal.selectAuditor}
            onChange={(value)=>dispatch({
              type:'creatTransactions/changeSelectAuditor',
              payload:value,
            })}
            filterOption={(input, option) => filterAuditor(input, option)}
          >
            {applyModal.auditorList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
          </Select>
        </div>}
      </StepsModal>
    </div>
  )
}
CreatTransactions.propTypes={

}

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
function mapStateToProps({creatTransactions}) {
  return {creatTransactions}
}
export default connect(mapStateToProps)(Form.create()(CreatTransactions));
