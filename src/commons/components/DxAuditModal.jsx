import React, { Component, PropTypes } from 'react'
import {Input,Row,Col,Tabs,Form,Button,Modal,Select} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import lodash from 'lodash';
import DxUpLoadPic from '../View/DxUpLoadPic'
import {
  getUserHasOptPwd,
} from '../utils/currencyFunction'
// import {
//   isNull,
// } from '../utils/currencyFunction'
import './DxAuditModal.css'
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const initState={
  applyPics:[],
  uploadLoading:false,
}
/********************************* 审核模态框 *********************************/
/*
*props={
  doAudit,
  todo,
  title,
  visible,
  closeModal,
  okText,
  cancelText,
}

*/
class DxAuditModal extends React.Component {
  constructor(props){
    super(props);
    this.state=lodash.cloneDeep(initState);
  }
  //执行审核回调
  auditCallBack=()=>{
    const {
      doAudit,
      todo,
      form:{
        getFieldsValue,
        validateFields,
      }
    }=this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      doAudit({
        ...data,
        images:this.state.applyPics.map(item=>item.id),
        todo,
      })
    });
  }
  //更新上传数组
  updatePicList=(arr)=>{
    this.setState({
      ...this.state,
      applyPics:arr,
    })
  }
  //更新上传loading
  changeUploadLoad=(bool)=>{
    this.setState({
      ...this.state,
      uploadLoading:bool,
    })
  }
  afterModalClose=()=>{
    console.log('afterModalClose');
    const {
      afterClose,
      form:{
        resetFields,
      }
    }=this.props;
    resetFields();
    this.setState({
      ...lodash.cloneDeep(initState),
    })
    afterClose();
  }
  filterAuditor=(input, option)=>{
    return option.props.children.indexOf(input) >= 0;
  }
  render(){
    const{
      title=(this.props.todo==='pass'?'审核通过':'审核驳回'),
      visible,
      closeModal,
      confirmLoading,
      auditorList,
      todo,
      className='',
      nextAuditRole='财务审核',
      width=900,
      okText='确认',
      cancelText='取消',
      form:{
        getFieldDecorator,
        resetFields,
      },
    }=this.props;
    const {
      applyPics,
      uploadLoading,
    }=this.state;
    return(
      <Modal className={`dxAuditModal ${className}`} visible={visible} width={width} title={title} afterClose={this.afterModalClose} okText={okText} onOk={this.auditCallBack} cancelText={cancelText} onCancel={closeModal} confirmLoading={(confirmLoading || uploadLoading)}>
        <Form>
          <Tabs type='card' activeKey={'show'}>
            <TabPane tab={`${todo==='pass'?'审核说明':'驳回说明'}`} key='show'>
              <FormItem
                >
                {getFieldDecorator('reason', {
                  validateTrigger: 'onBlur',
                  initialValue:'',
                  rules: [
                    {required: true, message: '审核说明未填写'},
                    {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
                    {max:50, message: '最多可输入50个中文字符'},
                  ],
                })(
                  <Input type='text' placeholder='请在此输入审核说明'/>
                )}
              </FormItem>
              <DxUpLoadPic {...upLoadProps} changeList={this.updatePicList}
              showPicList={applyPics} loadCallBack={this.changeUploadLoad}/>
            </TabPane>
          </Tabs>
          <div className='dxAuditModal_content'>
            {!!getUserHasOptPwd() && <FormItem
              label='审核密码'
              labelCol={{xs: 8,sm:6,md:4,lg:3}}
              wrapperCol={{xs: 14,sm:12,md:10,lg:8}}
              extra='注：忘记审核密码，请联系管理员重置密码'
            >
             {getFieldDecorator('optPassword', {
               validateTrigger: 'onBlur',
               initialValue:'',
               rules: [
                 { required: true,message:'审核密码未输入'},
                 { max:12, message: '密码过长' },
               ],
             })(
               <Input type='passWord' placeholder='请输入审核密码'/>
             )}
            </FormItem>}
            {!!auditorList && <FormItem
              label='审核人员'
              labelCol={{xs: 8,sm:6,md:4,lg:3}}
              wrapperCol={{xs: 14,sm:12,md:10,lg:8}}
            >
             {getFieldDecorator('auditor', {
               validateTrigger: 'onBlur',
               rules: [
                 { required: true, message: `${nextAuditRole}人员未选择` },
               ],
             })(
               <Select
                 style={{width:'100%'}}
                 showSearch
                 labelInValue
                 placeholder={`请选择或搜索${nextAuditRole}人员`}
                 optionFilterProp='children'
                 filterOption={this.filterAuditor}
               >
                 {auditorList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
               </Select>
             )}
            </FormItem>}
          </div>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(DxAuditModal);
