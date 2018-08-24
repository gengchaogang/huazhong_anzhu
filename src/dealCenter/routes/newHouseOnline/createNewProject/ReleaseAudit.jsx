import React, { PropTypes } from 'react';
import { Form, Input, Modal,Row,Col,Select,Radio,Button,Steps,Table} from 'antd';
import { Link } from 'dva/router'
import DxPanel from '../../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
const Step = Steps.Step;
import {DxSteps,DxStep} from '../../../../commons/View/DxSteps'
import {isNull} from '../../../../commons/utils/currencyFunction'
import DxPanelMini from '../../../../commons/components/DxPanelMini'
const FormItem = Form.Item;
const Option=Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
// const steps = [
//   {title: '项目发布',},
//   {title: '项目审核',},
//   {title: '项目上线',},
// ];

const stepList = [
  {
    title:'项目发布',
    description:'',
  },{
    title:'项目审核',
    description:'',
  },{
    title:'项目上线',
    description:'',
  }
]
const columns = [{
  title: '项目名称',
  dataIndex: 'name',
}, {
  title: '所在区域',
  dataIndex: 'location',
}, {
  title: '房源单价',
  dataIndex: 'price',
}, {
  title: '在售房源',
  dataIndex: 'houseCount',
}, {
  title: '电商优惠',
  dataIndex: 'discounts',
}, {
  title: '创建人',
  dataIndex: 'createUser',
}, {
  title: '创建时间',
  dataIndex: 'createDateTime',
},
// {
//   title: '下架时间',
//   dataIndex: 'offlineDate',
// },
{
  title: '操作',
	render:(text,record)=><Link className='deal_operation' to={{
    pathname:'/tradeManagement/newHouseTrade/projectDetails',
    state:{
      projectId:record.key,
      projectName:record.name,
    }
  }}>项目详情</Link>
}];
const ReleaseAudit = ({
  employees,
  resultData,
	upLoadReleasePicProps,
  visible,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    },
  }) => {
    console.log('employees',employees);
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      onOk(data);
    });
  }
  function handleCancel(){
    resetFields();
    onCancel();
  }
  const modalOpts = {
    visible,
    onOk: handleOk,
    onCancel:handleCancel,
  };
  const resetFrom=()=>{
    resetFields()
  }
  return (
    <Modal {...modalOpts} title="项目发布审核"  width="950px" footer="" afterClose={
    resetFrom}>
			{/*<Steps>
				{steps.map(item => <Step key={item.title} title={item.title} />)}
			</Steps>*/}
      <div className='projectPublishApplyModal'>
        <DxSteps current={0} status={'process'}>
          {stepList.map((item,index) => <DxStep key={`stepKey_${index}`} {...item}/>)}
        </DxSteps>
      </div>
			<DxPanelMini title="发布项目">
				<Table columns={columns} dataSource={resultData} pagination={false}/>
			</DxPanelMini>
			<DxPanelMini title="发布说明" hasPadding={true}>
				<Form horizontal>
					<FormItem {...formItemLayout} label="发布说明">
						{getFieldDecorator('description', {
							rules: [
								{ required: true, message: '请填写发布说明' },
							],
						})(
							<Input type="text" placeholder="请在此描述项目情况。"/>
						)}
					</FormItem>
					{!!employees && <FormItem {...formItemLayout} label="审核人员">
						{getFieldDecorator('employees', {
							rules: [
								{ required: true, message: '请选择项目发布审核人员' },
							],
						})(
              <Select
                showSearch
                placeholder='请选择或搜索审核对象'
                optionFilterProp='children'
                labelInValue={true}
                filterOption={(input,option)=>filterAuditor(input,option)}
              >
                {employees.map(item=><Option value={`${item.userId}`} key={`auditor_${item.userId}`}>{item.name}</Option>)}
              </Select>
						)}
					</FormItem>}
				</Form>
				<DxUpLoadPic {...upLoadReleasePicProps}/>
			</DxPanelMini>
      <div style={{textAlign:'right'}}>
				<Button type="primary" onClick={handleOk}>提交发布</Button>
        <Button type="ghost" onClick={handleCancel}>取消</Button>
      </div>
    </Modal>
  );
};

ReleaseAudit.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(ReleaseAudit);
