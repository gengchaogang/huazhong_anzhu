import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Cascader} from 'antd';
const FromItem=Form.Item;
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import './DealContract.css'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
function DealContract({dispatch,form,dealContract}) {

  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  //搜索
  const formSearch=(data)=>{
    console.log(data,'data');
  }
  //重置
  const resetField=()=>{

  }
  return (
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        placeholder='搜索小区名称'/>
    </div>
  );
}

function mapStateToProps({dealContract}) {
  return {dealContract}
}

export default connect(mapStateToProps)(Form.create()(DealContract));
