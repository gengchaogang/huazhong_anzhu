import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Row,
  Cascader,
  Col,
  Select,
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
function SearchBox(props){
  const {
    // submitLoading,
    form,
    onSearch,
    showDealCenter,
    type,
    label,
    saveAreaPath,
    areaAndCode,
    dealCenterData,
    optionsProState,
  }=props;
  const { getFieldDecorator, setFields } =form;
  // //布局控制
  // //创建团购中的保存按钮
  const handleSubmit=()=> {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      // console.log('Received values of form: ', values);
      onSearch(values)
      setTimeout(() => {

      }, 3000);
      // form.resetFields();
    });
  };
  const handleReset=()=>{
    form.resetFields();
    //初始化到初始状态
  }
  const dealCenterChange=(value)=>{
    console.log('value');
  }
  const handleChange=(value)=>{
    console.log('value');
  }
  //交易中心级联选择模拟数据
  return (
    <Form inline style={{margin:'20px 0'}}>
      <Row type="flex" align="middle">
      <FormItem
          label="关键字"
        >
        {getFieldDecorator('keyword', {
        })(
          <Input placeholder="搜索项目名称"/>
        )}
      </FormItem>
      <FormItem
        label="城市"
      >
        {getFieldDecorator('areaCode', {
        })(
          <Cascader
            onChange={(value,selectedOptions)=>{
              let areaPath=[];
              selectedOptions.map(item=>{
                if(!!item.label){
                  areaPath.push(item.label)
                }
              })
              saveAreaPath(areaPath)
            }}
            options={!!areaAndCode?areaAndCode:[]}
            expandTrigger="hover"
            changeOnSelect={true}
            placeholder="河北省 / 保定市" />
        )}
      </FormItem>
      {!!showDealCenter?
        <FormItem
          label="交易中心"
        >
          {getFieldDecorator('tradingCenterCode', {
          })(
              <Select size="large" style={{ width: 200 }} onChange={dealCenterChange}>
                {dealCenterData.map((item,index)=>{
                  return(
                    <Option key={index} value={item.code}>{item.name}</Option>
                  )
                })}
              </Select>
          )}
        </FormItem>:null
      }
      <FormItem
        label={label}
      >
        {getFieldDecorator(type, {
        })(
          <Select size="large" style={{ width: 200 }} onChange={handleChange}>
            {optionsProState.map((item,index)=>{
              return(
                <Option key={index} value={item.value}>{item.value}</Option>
              )
            })}
          </Select>
        )}
      </FormItem>
      <Button style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="default" icon="search">搜索</Button>
      <Button  onClick={handleReset} type='default'>重置</Button>
      </Row>
    </Form>
  );
};
SearchBox.propTypes = {
  onSearch:PropTypes.func.isRequired,
  showDealCenter:PropTypes.bool.isRequired,
  label:PropTypes.string.isRequired,
  type:PropTypes.string.isRequired,
  areaAndCode:PropTypes.array.isRequired,
  saveAreaPath: PropTypes.func.isRequired,
  // submitLoading: PropTypes.bool,
  // modalVisible: PropTypes.bool,
  // changeVisible: PropTypes.func,
  // changeSubmitLoading: PropTypes.func,
};
SearchBox = Form.create({})(SearchBox);
export default SearchBox;
