import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { Table,Button,Modal,Cascader,Select,Input,Form} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
function SearchKeyBox({dispatch,form,options,cascaderOptions,onChange,resetField,findingsAudit,isMaster,statusSelet,placeholder,areaSelet}){
  const {getFieldDecorator}=form;
  const handleReset=()=>{
		form.resetFields();
    resetField();
	};
  const handleSubmit=()=> {
		form.validateFields((err, values) => {
      onChange(values)
			// console.log('Received values of form: ', values);
			if (err) {
				return;
			}
		});
	}
  return (
    <div>
      <Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder={placeholder}/>
					)}
				</FormItem>
        {statusSelet==true? <FormItem label="状态">
					{getFieldDecorator('nameCertificate', {
						initialValue:"全部",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							{options.map((item,index)=>(
                <Option key={item} value={item}>{item}</Option>
              ))}
						</Select>
					)}
				</FormItem>:''}
        {areaSelet==true?<FormItem label="城市">
          {getFieldDecorator('city', {
					})(
						<Cascader placeholder='河北省 / 保定市' options={cascaderOptions}
              changeOnSelect={true}
            />
					)}
        </FormItem>:''}
        {isMaster==true?<FormItem label="关系">
          {getFieldDecorator('relationship', {
            initialValue:'师徒',
					})(
            <Select
							showSearch
							style={{minWidth:'70px'}}
              placeholder='师徒'
						>
              <Option value='师徒'>师徒</Option>
              <Option value='导师'>导师</Option>
						</Select>
					)}
        </FormItem>:''}
        {findingsAudit==true?<FormItem label="审核结果">
          {getFieldDecorator('relationship', {
					})(
            <Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
              placeholder='全部'
						>
              <Option value=''>全部</Option>
              <Option value='一致'>一致</Option>
              <Option value='不一致'>不一致</Option>
              <Option value='审核中'>审核中</Option>
						</Select>
					)}
        </FormItem>:''}
				<FormItem>
					<Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
					<Button type='ghost' onClick={handleReset}>重置</Button>
				</FormItem>
			</Form>
    </div>
  );
};
SearchKeyBox.propTypes = {

};
SearchKeyBox = Form.create({})(SearchKeyBox);
export default SearchKeyBox;
