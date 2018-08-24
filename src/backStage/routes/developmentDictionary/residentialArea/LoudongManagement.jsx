import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button ,Checkbox,Table,Modal,Form,Input,Select,Row,Col,message} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './LoudongManagement.css'
const addSeletDanWei = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
// const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

function LoudongManagement({dispatch,loudongManagement,form}) {
  const {dataSource,addLongDongStatus,
    editStatus,
    jianzhuType,
    pageNo,
    total,
    communityId,
    id,
    buildingTypes,
    constructionTime,
    household,
    households,
    ladder,
    name,
    xiaoQuName,
    roomNumberStartingValue,
    totalNumberOfFloors,
    }=loudongManagement;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    getFieldValue,
  }=form;
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'楼栋名称',
      dataIndex:'name',
    },
    {
      title:'总层数',
      dataIndex:'totalNumberOfFloors',
    },
    {
      title:'户数',
      dataIndex:'household',
    },
    {
      title:'梯户',
      dataIndex:'ladder',
    },
    {
      title:'房源起始值',
      dataIndex:'roomNumberStartingValue',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>watchHouseNumber(record)}>查看房号</span>
        <span className='operationColor' onClick={()=>editClick(record)}>编辑</span>
        <span className='operationColor' onClick={()=>{deleteClick(record.key)}}>删除</span>
      </div>
    },
  ]
  //删除楼栋相关的函数
  const deleteClick=(key)=>{
    console.log(communityId,'key');
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'loudongManagement/deleteOk',
          payload:{
            id:key,
          }
        })
      }
    });
  }
  //查看房号
  const watchHouseNumber=(record)=>{
    if(!!record.household && !!record.totalNumberOfFloors){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/watchHousingNumber`,
        state:{
          id:record.key,
          totalNumberOfFloors:record.totalNumberOfFloors,
          household:parseInt(record.household),
          roomNumberStartingValue:record.roomNumberStartingValue,
        }
  		}));
    }else{
      message.error('请先完善楼栋信息')
    }
  }
  //编辑楼栋相关的函数
  const editClick=(key)=>{
    dispatch({type:'loudongManagement/editClick',
      payload:{
        id:key.key,
      }
    })
    dispatch({
      type:'loudongManagement/findLabel',
      payload:{
        groups:[
          {typeName:'楼栋建筑类型',
          areaPath:null,}
        ],
      }
    })
  }
  //新建楼栋相关的函数
  const addLongDong=()=>{
    dispatch({type:'loudongManagement/addLongDong'})
    dispatch({
      type:'loudongManagement/findLabel',
      payload:{
        groups:[
          {typeName:'楼栋建筑类型',
          areaPath:null,}
        ],
      }
    })
  }
  const addLongDongOnOk=()=>{
    form.validateFields((err, values) => {
			if (err) {
				return;
			}else{
        if(editStatus==false){
          dispatch({type:'loudongManagement/addLongDongOnOk',
            payload:{
              buildingTypes:values.buildingTypes,
              communityId:communityId,
              constructionTime:values.constructionTime,
              household:values.household,
              households:values.households,
              ladder:values.ladder,
              name:values.name,
              roomNumberStartingValue:values.roomNumberStartingValue,
              totalNumberOfFloors:values.totalNumberOfFloors,
              pageNo:0,
            }
          })
        }else{
          dispatch({type:'loudongManagement/editLoudongOnOk',
            payload:{
              id:id,
              communityId:communityId,
              buildingTypes:values.buildingTypes,
              constructionTime:values.constructionTime,
              household:values.household,
              households:values.households,
              ladder:values.ladder,
              name:values.name,
              roomNumberStartingValue:values.roomNumberStartingValue,
              totalNumberOfFloors:values.totalNumberOfFloors,
              pageNo:0,
            }
          })
        }
      resetFields();
      }
		});
  }
  const addLongDongOnCancel=()=>{
    dispatch({type:'loudongManagement/addLongDongOnCancel'})
    resetFields();
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'loudongManagement/pageNoChange',
        payload:{
          pageNo:page,
          communityId:communityId,
        }
      })
    }
  }
  return (
    <div>
      <DxPanel title='楼栋管理'>
        <div>{xiaoQuName}</div>
        <Button type='primary' onClick={addLongDong}>+添加楼栋</Button>
        <Table columns={columns} dataSource={dataSource}
          pagination={pagination}
        />
        {/*以下为添加编辑的模态框*/}
        <Modal title={editStatus==true?'修改楼栋':'创建楼栋'} visible={addLongDongStatus}
          onOk={addLongDongOnOk} onCancel={addLongDongOnCancel}
        >
          <Form>
            <FormItem
              label='楼栋名称'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                initialValue:name,
                rules: [
                  { required: true, message: '请填写楼栋名称，最长20个字；' }
                ],
              })(
                <Input type='text' placeholder='请填写楼栋名称，最长20个字；'/>
              )}
            </FormItem>
            <FormItem
              label='总层数'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('totalNumberOfFloors', {
                initialValue:totalNumberOfFloors,
                rules: [
                  { required: true, message: '请填写总楼层数，限整数' },
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请填写总楼层数，限整数'/>
              )}
            </FormItem>
            <Row>
              <Col sm={14} md={14}>
                  <FormItem
                    label='梯户比例'
                    hasFeedback
                    {...addSeletDanWei}
                  >
                    {getFieldDecorator('ladder', {
                      initialValue:ladder,
                      rules: [
                        { required: true, message: '请输入' },
                        { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                      ],
                    })(
                      <Input type='text' placeholder='请输入' addonAfter='梯'/>
                    )}
                  </FormItem>
              </Col>
              <Col sm={10} md={10}>
              <FormItem
                hasFeedback
                {...addSeletDanWei}
              >
                {getFieldDecorator('household', {
                  initialValue:household,
                  rules: [
                    { required: true, message: '请输入' },
                    { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入' addonAfter='户'/>
                )}
              </FormItem>
              </Col>
            </Row>
            <FormItem
              label='房号起始值'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('roomNumberStartingValue', {
                initialValue:roomNumberStartingValue,
                rules: [
                  { required: true, message: '请填写房间号码起始值' },
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请填写房间号码起始值'/>
              )}
            </FormItem>
            <FormItem
              label='总户数'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('households', {
                initialValue:getFieldValue('totalNumberOfFloors')*getFieldValue('household')+'',
                rules: [
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' disabled placeholder='请填写该楼栋总户数，限整数'/>
              )}
            </FormItem>
            <FormItem
              label='建筑类型'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('buildingTypes', {
                initialValue:buildingTypes,
              })(
                <Select placeholder='-请选择-'>
                  {!!jianzhuType && jianzhuType.map((item,index)=>(
                    <Option key={`item_${index}`} value={item}>{item}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              label='建筑年代'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('constructionTime', {
                initialValue:constructionTime,
                rules: [
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请填写建筑年代，限整数' addonAfter='年'/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <div>
          <Button type='ghost' onClick={goBack}>返回</Button>
        </div>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({loudongManagement}) {
  return {loudongManagement }
}

export default connect(mapStateToProps)(Form.create({
  mapPropsToFields:(props)=>{
    return {
      name:props.name,
      buildingTypes:props.buildingTypes,
      constructionTime:props.constructionTime,
      household:props.household,
      households:props.households,
      ladder:props.ladder,
      roomNumberStartingValue:props.roomNumberStartingValue,
      totalNumberOfFloors:props.totalNumberOfFloors,
    }
  }
})(LoudongManagement));
