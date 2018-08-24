import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Cascader} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
function PromotePrentice({dispatch,form,promotePrentice}) {
  const {translateData,loading,id,editModalStatus,assessmentStandard,assessmentItem}=promotePrentice;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'考核项目',
      dataIndex:'assessmentItem',
    },
    {
      title:'考核标准',
      dataIndex:'standard',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{editClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{changeStatus(record.key)}}>{record.status=='有效'?'置为无效':'置为有效'}</span>
      </div>
    },
  ];
  const changeStatus=(key)=>{
    dispatch({type:'promotePrentice/initailSuccess',
      payload:{
        loading:true,
    }})
    dispatch({
      type:'promotePrentice/changeStatus',
      payload:{
        id:key,
      }
    })
  }
  const editClick=(value)=>{
    dispatch({type:'promotePrentice/initailSuccess',
      payload:{id:value.key,editModalStatus:true,
        assessmentStandard:value.assessmentStandard,
        assessmentItem:value.assessmentItem,
      }
    })
  }
  const editOk=()=>{
    form.validateFields((err, values) => {
      if(err){
        return
      }
      dispatch({type:'promotePrentice/editOk',
        payload:{
          assessmentStandard:values.assessmentStandard,
          id:id,
          assessmentItem:assessmentItem,
        }
      })
    })
    resetFields();
  }
  const onCancel=()=>{
    dispatch({type:'promotePrentice/initailSuccess',
      payload:{
        editModalStatus:false,
        loading:false,
      }
    })
    resetFields();
  }
  return (
    <div>
      <Table columns={columns}
        pagination={false}
        dataSource={translateData}
        loading={loading}
      />
      <Modal visible={editModalStatus} title='编辑'
        onOk={editOk} onCancel={onCancel}
      >
        <Form>
          <FormItem
            label=' '
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('assessmentStandard', {
              initialValue:assessmentStandard,
              rules: [
                { required: true, message: '必填' },
                { type:'string',pattern:/^[0-9]*$/, message: '输入内容非法' },
              ],
            })(
              <Input type='text' placeholder='例如：地上车位，150元/月/位'/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({promotePrentice}) {
  return {promotePrentice}
}

export default connect(mapStateToProps)(Form.create()(PromotePrentice));
