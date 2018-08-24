import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import { Form,Icon,Input,Row,Col,Button,Select,Radio,Table,message,Cascader} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import DxPanel from '../../../../commons/components/DxPanel'
import SearchInput from '../../../../commons/View/SearchInput'
import BrokerInfoList from '../../../components/NewHouseTrade/BrokerInfoList'
import ProjectInfo from '../../../components/NewHouseTrade/ProjectInfo'
import PromptModal from '../../../../commons/View/PromptModal'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'

import ChooseUserModal from '../../../components/NewHouseTrade/ChooseUserModal'
//模拟图片数据
import textPic from '../../../assets/yay.jpg'


import './CreatClient.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const anzhuFormItemLayoutBolck = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21},
  },
};
function CreatClient({dispatch,creatClient,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
}}){
  const {
    broker,
    house,
    projectInfo,
    btnLoading,
    projectId,
    projectList,
    loading,
    lockProject,
    projectName,
    promptObj,
    houseTreeData,
    houseTreeMap,
    selectHouseKey,
    showHouseObj,
    chooseBrokerModal,
    selectBrokerInfo,
  }=creatClient;

  //确看备注的添加并确看
  const onNotesToAddConfirm=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'creatClient/submitData',
        payload:data,
      })
    });
  }
  //确看备注的返回
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/newHouseTrade`,
      }));
    }
  }

  const brokerInfoListProps={
    listData:broker.brokerList,
    doSelect:(id)=>{dispatch({type:'creatClient/selectBroker',payload:id})}
  }
  const intentionBuyBouseSelectDataProps ={
    options:houseTreeData,
    onChange:(arr)=>{dispatch({type:'creatClient/doSelectHouseKey',payload:arr})},
    value:selectHouseKey,
  }
  const groupBuyHouseProps={
    houseInfo:showHouseObj,
    other:!!showHouseObj.cellStatus?showHouseObj.cellStatus:'',
    hideHead:true,
  }
  const chooseBrokerModalProps={
    title:'请选择确看经纪人',
    type:'broker',
    visible:chooseBrokerModal.visible,
    userList:chooseBrokerModal.brokerInfoList,
    doSelectUser:(selectId)=>dispatch({
      type:'creatClient/selectBroker',
      payload:selectId,
    }),
    doSearch:(searchValue)=>dispatch({
      type:'creatClient/searchBorker',
      payload:searchValue,
    }),
    onOk:()=>dispatch({
      type:'creatClient/sureDoSelectBroker',
    }),
    onCancel:()=>dispatch({
      type:'creatClient/giveUpSelectBroker',
    }),
  }
  return(
    <div className='creatClient_box'>
      <PromptModal {...promptObj} onOk={()=>{dispatch({type:'creatClient/okPrompt'})}} onCancel={()=>{dispatch({type:'creatClient/cancelPrompt'})}}/>
      <ChooseUserModal {...chooseBrokerModalProps}/>
      <DxPanel title={!!lockProject?'客户意向项目':'请选择客户意向项目'}>
        <ProjectInfo projectInfo={projectInfo}/>
      </DxPanel>
      <Form horizontal>
        <DxPanel title='客户信息'>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='客户姓名'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('clientName', {
                    rules: [
                      { required: true, message: '客户姓名未填写' },
                      { min:1, message: '客户姓名过短' },
                      { max:6, message: '客户姓名过长' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入1~6位客户姓名'/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  {...formItemLayout}
                  label='性别：'
                >
                  {getFieldDecorator('gender', {
                    rules: [{ type: 'string', required: true, message: '客户性别未填写' }],
                  })(
                    <Select placeholder='请选择客户性别'>
                      <Option value='男'>男</Option>
                      <Option value='女'>女</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='联系电话：'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('phone', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '手机号未填写' },
                      { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入11位客户手机号' />
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='身份证号码：'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('idCart', {
                    rules: [
                      { required: true, message: '身份证号未填写' },
                      { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入18位客户身份证号' />
                  )}
                </FormItem>
              </Col>
            </Row>
        </DxPanel>
        <DxPanel title='请选择客户意向房源'>
          <div className='dealCenter-intentionBuyBouse'>
            <div className='sort-address-msg'>
              <span><span style={{color:'red'}}>* </span>意向房源：</span>
              <Cascader {...intentionBuyBouseSelectDataProps} placeholder='请选择团购意向房源' style={{width:'250px'}}/>
              <span style={{paddingLeft:'15px'}}>{selectHouseKey.length==0?'':`已选择：${selectHouseKey.join('/')}`}</span>
            </div>
            {showHouseObj.id!='defalut' &&
            <IntentionHouse {...groupBuyHouseProps}/>}
          </div>
        </DxPanel>
        {/*<DxPanel title='带看经纪人'>
          <div>
            <div className='dq_flex'>
              <div className='dq_flex_left'>
                <RadioGroup onChange={(e)=>dispatch({
                    type:'creatClient/toggleHasBroker',
                    payload:e.target.value,
                })} defaultValue={false} value={broker.hasBroker}>
                  <Radio value={false}>无经纪人</Radio>
                  <Radio value={true}>有经纪人</Radio>
                </RadioGroup>
              </div>
              {!!broker.hasBroker && <div className='dq_flex_right'>
                <SearchInput className='creatClientSearch' placeholder='请在此输入手机号' searchFuc={searchFunction} buttonTitle='检索' type="button"/>
              </div>}
            </div>
            {!!broker.hasBroker && <BrokerInfoList {...brokerInfoListProps}/>}
          </div>
        </DxPanel>*/}
        <DxPanel title='带看经纪人'>
          <div>
            <div className='dq_flex'>
              <div className='dq_flex_left'>
                <RadioGroup onChange={(e)=>dispatch({
                    type:'creatClient/toggleHasBroker',
                    payload:e.target.value,
                })} defaultValue={false} value={broker.hasBroker}>
                  <Radio value={false}>无经纪人</Radio>
                  <Radio value={true}>有经纪人</Radio>
                </RadioGroup>
              </div>
              {!!broker.hasBroker && <div className='dq_flex_right'>
                <Button className='anzhu_button' size='small' onClick={()=>dispatch({type:'creatClient/initChooseBrokerModal'})}>
                  {!!selectBrokerInfo.show?'重选经纪人':'选择经纪人'}
                </Button>
              </div>}
            </div>
            {(!!selectBrokerInfo.show && !!broker.hasBroker) && <BrokerInfoList listData={[selectBrokerInfo]} doSelect={()=>{}}/>}
          </div>
        </DxPanel>
        <DxPanel title='确看备注'>
          <div>
            <FormItem
              label='看房备注'
              hasFeedback
              {...anzhuFormItemLayoutBolck}
            >
              {getFieldDecorator('remarks', {
                rules: [
                  { required: true, message: '看房备注未填写' },
                  { max:500, message: '看房备注过长' },
                ],
              })(
                <Input type='textarea' placeholder='例如客户比较中意三室两厅的房子，价格能接受2000元㎡'/>
              )}
            </FormItem>
            <div className="anzhu_bottom_area">
              <Button type="primary" loading={btnLoading} onClick={onNotesToAddConfirm}>添加并确看</Button>
              <Button type="ghost" onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
            </div>
          </div>
        </DxPanel>
      </Form>
    </div>
  )
}
CreatClient.propTypes={

}
function mapStateToProps({creatClient}) {
  return {creatClient}
}
export default connect(mapStateToProps)(Form.create()(CreatClient));
