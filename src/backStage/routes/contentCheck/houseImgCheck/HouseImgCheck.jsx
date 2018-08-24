import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Cascader,Select} from 'antd';
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
const Option = Select.Option;
function HouseImgCheck({dispatch,form,houseImgCheck}) {
  const {
    tableData,
    tableLoading,
    totalElements,
    cascaderOptions,
    cascaderOriginal,
    labelOptions,
    areaPath,
    promptObj,
    pageNo,
    area,
    keyword,
    resourcesType,
  }=houseImgCheck;
  //搜索
  const {getFieldDecorator,resetFields}=form;
  const handleReset=()=>{
    resetFields();
    dispatch({
      type:"houseImgCheck/getInitTableData",
      payload:{
        pageSize:10,
        pageNo:0,
        area:'',
        keyword:'',
        resourcesType:'',
      }
    })
	};
  const handleSubmit=()=> {
		form.validateFields((err, values) => {
      if(!!values.area){
        values.area=values.area.join('/')
      }
      dispatch({
        type:"houseImgCheck/getInitTableData",
        payload:{
          pageSize:10,
          pageNo:0,
          area:values.area,
          keyword:values.keyword,
          resourcesType:values.resourcesType,
        }
      })
		});
	}

  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'图片更新时间',
      dataIndex:'updateDate',
    },
    {
      title:'房源编号',
      dataIndex:'resourcesNumber',
    },
    {
      title:'房源',
      dataIndex:'houseName',
    },
    {
      title:'小区/楼盘',
      dataIndex:'communityName',
    },
    {
      title:'房源类型',
      dataIndex:'resourcesType',
    },
    {
      title:'地区',
      dataIndex:'areaName',
    },
    {
      title:'更新数量(套)',
      dataIndex:'updateNumber',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record,index)=><span className='operationColor'
        onClick={()=>watchClick(record)}>查看
      </span>
    }
  ]

  const watchClick=(record)=>{
    dispatch(routerRedux.push({
			pathname: `/contentCheck/houseImgCheck/houseImgCheckDetail`,
      state:{
        id:record.id
      }
		}));
  }
  const pagination={
    total:totalElements,
    pageSize:10,
    current:pageNo,
    showTotal:(totalElements)=>{return(`共${totalElements}项`)},
    // showQuickJumper:true,
    onChange:(page)=>{
      dispatch({
        type:"houseImgCheck/changeLoading",
        payload:{tableLoading:true}
      })
      dispatch({
        type:"houseImgCheck/getInitTableData",
        payload:{
          pageSize:10,
          pageNo:page-1,
          area:area,
          keyword:keyword,
          resourcesType:resourcesType,
        }
      })
    }
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({
        type:"houseImgCheck/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const handleCallBackCancel=()=>{}
  return (
    <div>
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <DxPanel title="房源图片审核">
        <Form inline style={{margin:'20px 0'}}>
          <FormItem
            label="关键字"
            >
            {getFieldDecorator('keyword', {
            })(
              <Input placeholder='搜索小区/楼盘/房源编号'/>
            )}
          </FormItem>
          <FormItem label="城市">
            {getFieldDecorator('area', {
            })(
                <Cascader
                  onChange={(value,selectedOptions)=>{
                    let areaPath=[];
                    selectedOptions.map(item=>{
                      if(!!item.label){
                        areaPath.push(item.label)
                      }
                    })
                    dispatch({
                      type:"houseImgCheck/saveAreaPath",
                      payload:{
                        areaPath:'/'+areaPath.join('/')
                      }
                    })
                  }}
                  changeOnSelect={true}
                  options={cascaderOptions}
                  expandTrigger="hover"
                  placeholder="河北省 / 保定市" />
            )}
          </FormItem>
          <FormItem label="房源类型">
            {getFieldDecorator('resourcesType', {
            })(
              <Select
                showSearch
                style={{minWidth:'70px'}}
                optionFilterProp='children'
                placeholder='全部'
                >
                <Option value=''>全部</Option>
                {!!labelOptions && labelOptions.map((item,index)=>(
                  <Option key={`item_${index}`} value={item.value}>{item.value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
            <Button type='ghost' onClick={handleReset}>重置</Button>
          </FormItem>
        </Form>
        <Table  columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          pagination={pagination}
          />
      </DxPanel>
    </div>
  );
}

function mapStateToProps({houseImgCheck}) {
  return {houseImgCheck}
}

export default connect(mapStateToProps)(Form.create()(HouseImgCheck));
