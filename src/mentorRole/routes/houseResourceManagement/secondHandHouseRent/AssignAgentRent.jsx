import React from 'react';
import {connect} from 'dva';
import { routerRedux } from 'dva/router';
import {Row,Col,Input,Button,Table,Icon,Form,InputNumber,Checkbox,message,Tree,Select,Radio} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './assignAgentRent.css'
import img from '../../../assets/images/morentouinfg.png'
import AssignAgentModal from '../../../components/houseResourceManagement/AssignAgentModal'
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
const FormItem=Form.Item;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginBottom:'15px'
};
/***************************************************************/
/**************************************************************/
/**********  二手房出售：指派经纪人 *****************************/
/*************************************************************/
/*************************************************************/

function AssignAgentRent({dispatch,assignAgentRent,form}){
  const {getFieldDecorator} = form;
  const {
    userInfoJSON,
    currentRadio,
    labels,
    agentListTableData,
    selectedRowKeys,
    visible,
    houseBaseInfo,
    loadingShadow,
    slectedBrokers,
    openPromotionCheked,
    jeCheckBoxChecked,
    commissionAmount,
    blCheckBoxChecked,
    assignAgentRentObj,
    teamData,
    searchValue,
    expandedKeys,
    autoExpandParent,
    promptObj,
    generateTeamData,
    treeMarkers,
    agentList,
    defaultRadioValue,
    } = assignAgentRent;
  const onExpand = (expandedKeys) => {
      dispatch({
        type:"assignAgentRent/setStatePramas",
        payload:{
          expandedKeys,
          autoExpandParent: false,
        }
      })
    }
    const loop = (data,searchValue) => data&&data.map((item) => {
      const index = item.title.search(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title} oldTitle = {item.title}>
            {loop(item.children,searchValue)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} oldTitle = {item.title}/>;
    });
    const selectedTreeNode=(selectedIds, e)=>{  //点击部门或者名称
      // dispatch({
      //   type:"assignAgentRent/setStatePramas",
      //   payload:{
      //     treeMarkers:[{position:['106.23','29.44'],content:"123456"}]
      //   }
      // })
    }
    const checkedTreeNode=(checkedKeys,e)=>{  //勾选
      dispatch({
        type:"assignAgentModal/changeRowKeys",
        payload:{
          checkedKeys:checkedKeys
        }
      })
      let agentListTableData=[];
      if(agentList.length!==0){
        checkedKeys.map((item,index)=>{
          agentList.map((i)=>{
            if(item===i.item.key){
              agentListTableData.push({
                areaPath:i.item.areaPath,
                id:i.item.id,
                isBroker:i.item.isBroker,
                isEmployee:i.item.isEmployee,
                key:i.item.key,
                logo:i.item.logo,
                name:i.item.name,
                phoneNumber:i.item.phoneNumber,
                title:i.item.title,
                teamName:i.item.teamName,
              })
            }
          })
        })
      }
      dispatch({
        type:"assignAgentRent/saveAgentTableData",
        payload:{
          agentListTableData:agentListTableData
        }
      })
    }
    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };
    const searchTeam = (e) => {
      const value = e.target.value;
      const expandedKeys = generateTeamData.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, teamData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      dispatch({
        type:"assignAgentRent/setStatePramas",
        payload:{
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        }
      });

    }


  var openChangeListener = false;
  const columns = [
    {
      title:"头像",
      dataIndex:'logo',
      render:(text,record,index)=>{
        const _logo = record['logo'];
        if (_logo != null && _logo.length > 0) {
            return(
              <img src={_logo} className="listUserHeaderImage"/>
            )
        }else {
            return (<img src={img} className="listUserHeaderImage"/>);
        }
      },
      key:"logo"
    },{
      title:"姓名",
      dataIndex:'name',
    },{
      title:"性别",
      dataIndex:'gender',
    },{
      title:"联系电话",
      dataIndex:"phoneNumber"
    },{
      title:"区域",
      dataIndex:"areaPath"
    },{
    title: '操作',
    render:(text,record,index)=>{
      return(
        <div className="operation">
          <span onClick={()=>onDelete(text,record,index)} className="delete"></span>
        </div>
      )
    }
  }];

  // 删除选择的经纪人
  const onDelete=(text,record,index)=>{
    if (slectedBrokers != null){
        slectedBrokers.splice(index,1);
        dispatch({
          type:"assignAgentRent/setState",
          payload:{
            selectedRowKeys:slectedBrokers,
          }
        })
    }
  }

  const showModal=()=>{
    dispatch({
      type:"assignAgentRent/currentSelect",
      payload:{
        agentListTableData:agentListTableData,
        tableData:slectedBrokers
      }
    })
    // dispatch({
    //   type:"assignAgentRent/changeModal",
    //   payload:{
    //     visible:true
    //   }
    // });
    // dispatch({
    //   type:'assignAgentRentModal/getBrokerList',
    //   payload:{
    //     pageNo:0,
    //     pageSize:commonFinalCode.pageSize,
    //   }
    // });
  }

  // 选择经纪人确定
  const onModalOk=(data)=>{
    // 关闭弹出框
    dispatch({
      type:"assignAgentRent/changeModal",
      payload:{
        visible:false
      }
    });
    // 保存选择的经纪人信息
    dispatch({
        type:"assignAgentRent/addSelectBroker",
        payload:data,
    });
  }
  // 选择经纪人取消
  const onModalCancel=()=>{
    dispatch({
      type:"assignAgentRent/changeModal",
      payload:{
        visible:false
      }
    })
  }
  // 弹出选择经纪人框属性
  const modalProps={
    visible,
    onOk:onModalOk,
    onCancel:onModalCancel,
    title:"选择经纪人",
    width:"80%",
  }
  const props={
    agentListTableData,
    expandedKeys,
    autoExpandParent,
    checkedTreeNode,
    teamData,
    searchValue,
    searchTeam,
    loop,
    onExpand,
    selectedTreeNode,
  }


  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"assignAgentRent/togglePrompt",
          payload:{
            visible:false
          }
        })
      }else if(promptObj.todo==='backlist') {
          dispatch({
            type:"assignAgentRent/togglePrompt",
            payload:{
              visible:false
            }
          })
          setTimeout(function(){
            dispatch({
              type:"assignAgentRent/backlist",
            })
          }, 200)
      }
  }
  const onCancelCallBack=()=>{}


  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/ownerInfosRent',
      state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
          houseBaseInfo:houseBaseInfo,
      }
    }))
  }

  // 保存数据
  const toSave=()=>{
    form.validateFields((err, fieldsValue) => {
      const zyj=parseFloat(form.getFieldValue('tradingCommissions'))
      const yj=parseFloat(form.getFieldValue('commissionAmount'))
     if (err) {
        message.error('填写必填信息')
        return;
     }else if(yj>zyj){
       message.error("您输入的佣金金额大于佣金总金额")
       return;
     }else{
       if(!!fieldsValue.commissionRate&&fieldsValue.commissionRate!==''){
         fieldsValue.commissionRate=parseFloat(fieldsValue.commissionRate)/100;
       }
        dispatch({
          type:"assignAgentRent/submitData",
          payload:fieldsValue,
        });
     }
   });
  }

  /** 创建下拉框选择项 */
  const getSelectOptionsByLabelName=(labels,typeName)=>{
    if (labels != null && labels[typeName]) {
        const _array = labels[typeName];
        return _array.map((item, index)=>{
          return(
            <Option key={index} value={item.value}>{item.name}</Option>
          )
        })
    }
  }

  //------------------- 选择框事件  start--------
  const openPromotionCheckBox=(e)=>{
      const isChecked = e.target.checked;
      dispatch({
        type:"assignAgentRent/setState",
        payload:{
          openPromotionCheked:isChecked,
        }
      });
      if (isChecked) {
        // 开启合作促销
      }else {
        form.resetFields(['commissionAmount'])
        // 关闭合作促销
        dispatch({
          type:"assignAgentRent/clearCxInfo",
        });
        form.setFieldsValue({
          commissionAmount: 0.0,
        });
      }
  }

  /**  金额 CheckBox 选择 */
  const jeCheckBox=(e)=>{
      if (!openPromotionCheked) {
        message.error('请先开启合作促销');
        return;
      }
      const isChecked = e.target.checked;
      dispatch({
        type:"assignAgentRent/setState",
        payload:{
          jeCheckBoxChecked:isChecked,
        }
      });
      if (isChecked) {
        dispatch({
          type:"assignAgentRent/setState",
          payload:{
            blCheckBoxChecked:false,
          }
        });
      }else {
        form.setFieldsValue({
          commissionAmount: 0.0,
        });
      }
  }

  /**  比例 CheckBox 选择 */
  const blCheckBox=(e)=>{
      if (!openPromotionCheked) {
        message.error('请先开启合作促销');
        return;
      }
      const isChecked = e.target.checked;
      dispatch({
        type:"assignAgentRent/setState",
        payload:{
          blCheckBoxChecked:isChecked,
        }
      });
      form.setFieldsValue({
        commissionAmount: 0.0,
      });
      if (isChecked) {
        dispatch({
          type:"assignAgentRent/setState",
          payload:{
            jeCheckBoxChecked:false,
          }
        });
      }else {

      }
  }
  const onInputChange=(e)=>{
    const value=parseFloat(e.target.value)
    const zyj=parseFloat(form.getFieldValue('tradingCommissions'))
    if(value>zyj){
      message.error("您输入的佣金金额大于佣金总金额")
    }
    dispatch({
      type:"assignAgentRent/closeCommissionAmount",
      payload:{
        jeCheckBoxChecked:true,
        blCheckBoxChecked:false
      }
    })
    form.setFieldsValue({
      commissionRate:null,
    });
  }
  const onSelectChange=(value,option)=>{
    if (!openPromotionCheked) {
      message.error('请先开启合作促销');
      return;
    }
    dispatch({
      type:"assignAgentRent/closeCommissionAmount",
      payload:{
        jeCheckBoxChecked:false,
        blCheckBoxChecked:true,
      }
    })
    form.setFieldsValue({
      commissionAmount: 0.0,
    });
  }
  const onRadioGroupChange=(e)=>{
    if(e.target.value==='佣金金额'){
      dispatch({
        type:"assignAgentRent/closeCommissionAmount",
        payload:{
          defaultRadioValue:'佣金金额',
          jeCheckBoxChecked:true,
          blCheckBoxChecked:false,
        }
      })
      form.setFieldsValue({commissionRate:''})
    }else if(e.target.value==="佣金比例"){
      dispatch({
        type:"assignAgentRent/closeCommissionAmount",
        payload:{
          defaultRadioValue:'佣金比例',
          jeCheckBoxChecked:false,
          blCheckBoxChecked:true,
        }
      })
      form.setFieldsValue({commissionAmount:''})
    }
    dispatch({
      type:"assignAgentRent/saveCurrentRadio",
      payload:{
        currentRadio:e.target.value
      }
    })
  }
  //------------------- 选择框事件  end----------
  return(
    <div className="assignAgent">

      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxLoadingShadow visible={loadingShadow} />

      <AssignAgentModal {...modalProps} {...props}/>

      <Panel title="合作促销"/>
        <div className="cooperativePromotion">
          <Form>
            <Row className="firstRow">
                <Col sm={24} md={24}>
                  <FormItem label="出租总佣金" {...formItemLayout}>
                    {getFieldDecorator('tradingCommissions', {
                      initialValue: !!assignAgentRentObj.tradingCommissions?assignAgentRentObj.tradingCommissions.toString():null,
                      rules: [
                        { required: true, message:'请输入房源销售总佣金!' },
                        {type:'string',pattern:/^([1-9]\d*|)(\.\d{1,2})?$/,message:"房源销售总佣金，支持2位小数"},
                      ],
                    })(
                      <Input placeholder="请输入数字，支持2位小数" addonAfter='元'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                    <FormItem label="是否开启房源速销" {...formItemLayout}>
                      {getFieldDecorator('cooperativePromotion', {
                        initialValue: openPromotionCheked,
                        rules: [{ required: false, message:'请选择合作促销!' }],
                      })(
                        <Checkbox checked={openPromotionCheked} onChange={openPromotionCheckBox}>开启</Checkbox>
                      )}
                    </FormItem>
                    <Row>
                      <Col span={18} offset={3}>
                          <Row className="tips">
                            <Col>内容说明:</Col>
                            <Col>1.经纪人将代理房源发布到平台，全城经纪人帮您卖房，销售效率提升50%以上。</Col>
                            <Col>2.业主信息只有发布者可见。</Col>
                            <Col>3.房源代理经纪人设置合作分佣比例，房源成交后按设置比例分佣。</Col>
                          </Row>
                      </Col>
                    </Row>
                </Col>
            </Row>
            {openPromotionCheked?
                <Row>
                          <Col sm={24} md={24}>
                              <FormItem label="合作速销佣金设置" {...formItemLayout}>
                              </FormItem>
                          </Col>

                          <Col offset={3}>
                            <RadioGroup onChange={onRadioGroupChange} defaultValue={currentRadio}>
                              <Radio style={radioStyle} value='佣金金额'>佣金金额
                                <FormItem className="commissionType">
                                    {getFieldDecorator('commissionAmount', {
                                      initialValue: assignAgentRentObj.promotionMode==='金额'?assignAgentRentObj.commissionAmount.toString():null,
                                      rules: [
                                        { required: false, message:'请选择佣佣金金额"!' },
                                        {type:'string',pattern:/^([1-9]\d*|)(\.\d{1,2})?$/,message:"佣金金额，支持2位小数"},
                                      ],
                                    })(
                                      <Input
                                        placeholder="请输入数字，支持2位小数"
                                        addonAfter='元'
                                        disabled={currentRadio==='佣金金额'?false:true}
                                         onChange={onInputChange}
                                         />
                                    )}
                                </FormItem>
                              </Radio>
                              <Radio style={radioStyle} value='佣金比例'>佣金比例
                                    <FormItem className="commissionType">
                                        {getFieldDecorator('commissionRate', {
                                          initialValue: !!assignAgentRentObj.commissionRate?(assignAgentRentObj.commissionRate*100).toString():null,
                                          rules: [
                                            { required: false, message:'请选择佣金比例!' },
                                            {type:'string',pattern:/^[0-9]*$/,message:"佣金比例只能是数字"},
                                            {pattern:/^(?:0|[1-9][0-9]?|100)$/,message:"佣金比例范围只能是0-100的正整数"}
                                          ],
                                        })(
                                          <Input
                                            placeholder="请输入佣金比例"
                                            addonAfter="%"
                                            disabled={currentRadio==='佣金比例'?false:true}
                                             />
                                        )}
                                    </FormItem>
                              </Radio>
                            </RadioGroup>
                          </Col>

                        </Row>:null}

          </Form>
      </div>      
      
      {!!userInfoJSON&&userInfoJSON.userType!=='BROKER_USER'&&<Panel title="指派经纪人"/>}
      {!!userInfoJSON&&userInfoJSON.userType!=='BROKER_USER'&&
      <div className="assignAgent_table">
      <div className="showModal">
        <Row>
          <Col span={8} style={{textAlign:"left"}}>
            <Button type="primary" onClick={showModal}>指派经纪人</Button>
          </Col>
        </Row>
      </div>
      <Table
        key="selectedBrokerTable"
        pagination={false}
        columns={columns}
        dataSource={slectedBrokers}
        showHeader={false}/>
   </div>
    }
      <div className="operation_button">
        <Button type="ghost" onClick={toBack}>上一步</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={toSave}>保存</Button>
      </div>
    </div>
  )
}

function mapStateToProps({assignAgentRent}){
  return{assignAgentRent}
}
export default connect(mapStateToProps)(Form.create({})(AssignAgentRent));
