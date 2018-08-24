import React, { PropTypes } from 'react'

import {Table,Timeline,Input,Button,Row,Col,Form,Cascader} from 'antd'
const FormItem = Form.Item;
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import DxPanel from '../../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../commons/View/PromptModal'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import NHTradeInfo from '../../../../commons/components/NHTradeInfo'

//模拟图片数据
import textPic from '../../../assets/yay.jpg'

import './CustomerDoLook.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
function CustomerDoLook({customerDoLook,dispatch,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
}}){
  const {
    promptObj,
    trackJSON,
    projectInfo,
    loading,
    type,
    selectHouseKey,
    houseTreeData,
    showHouseObj,
  }=customerDoLook;
  const sureDoLook=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'customerDoLook/postRemarks',
        payload:data.remarks,
      })
    });
  }
  const cancleDoLook=()=>{
    resetFields();
    dispatch(routerRedux.goBack())
  }
  const promptOk=()=>{
    dispatch({
      type:'customerDoLook/closePrompt',
      payload:{
        visible:false,
      },
    });
  }
  const promptCancel=()=>{
    dispatch({
      type:'customerDoLook/closePrompt',
      payload:{
        visible:false,
      },
    });
  }
  const intentionBuyBouseSelectDataProps ={
    options:houseTreeData,
    onChange:(arr)=>{dispatch({type:'customerDoLook/doSelectHouseKey',payload:arr})},
    value:selectHouseKey,
  }

  const groupBuyHouseProps={
    houseInfo:showHouseObj,
    other:!!showHouseObj.cellStatus?showHouseObj.cellStatus:'',
    hideHead:true,
  }
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  return(
    <div className='dealCenter-customerDoLook'>
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      {!!trackJSON && <NHTradeInfo trackJSON={trackJSON} projectInfo={projectInfo}/>
      }
      {type==='noHouse' && <DxPanel title='请选择客户意向房源'>
        <div className='dealCenter-intentionBuyBouse'>
          <div className='sort-address-msg'>
            <span><span style={{color:'red'}}>* </span>意向房源：</span>
            <Cascader {...intentionBuyBouseSelectDataProps} placeholder='请选择团购意向房源' style={{width:'250px'}}/>
            <span style={{paddingLeft:'15px'}}>{selectHouseKey.length==0?'未选择':`已选择：${selectHouseKey.join('/')}`}</span>
          </div>
          {showHouseObj.id!='defalut' &&
          <IntentionHouse {...groupBuyHouseProps}/>}
        </div>
      </DxPanel>}
      <DxPanel title='看房备注'>
        <Row>
          <Col sm={24} md={24}>
            <FormItem
              label='看房备注'
              hasFeedback
              {...formItemLayout}
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
          </Col>
        </Row>
      </DxPanel>
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={sureDoLook}>用户确看</Button>
        <Button type='ghost' onClick={cancleDoLook}>取消</Button>
      </div>
    </div>
  )
}
function mapStateToProps({customerDoLook}) {
  return {customerDoLook}
}
export default connect(mapStateToProps)(Form.create()(CustomerDoLook));
