import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button ,Checkbox,Table,Modal,Form,Input,Select,Row,Col,message} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './ShopsLoudongManagement.css'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
const Option = Select.Option;
const FormItem = Form.Item;
const addSeletDanWei = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function ShopsLoudongManagement({dispatch,shopsLoudongManagement,form}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {
    id,
    jianzhuType,
    dataSource,
    createLoudong,
    editStatus,
    pageNo,
    total,
    buildingTypes,
    communityId,
    constructionTime,
    eachLayerOfRoomNumber,
    roomPrefix,
    name,
    roomNumberStartingValue,
    totalNumberOfFloors,
    loading,
    shangPuName,
  }=shopsLoudongManagement;
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
      title:'总楼层',
      dataIndex:'totalNumberOfFloors',
    },
    {
      title:'每层房间数',
      dataIndex:'eachLayerOfRoomNumber',
    },
    {
      title:'房间前缀',
      dataIndex:'roomPrefix',
    },
    {
      title:'房号起始值',
      dataIndex:'roomNumberStartingValue',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{watchHouseNumber(record)}}>查看房号</span>
        <span className='operationColor' onClick={()=>{editClick(record.key)}}>编辑</span>
        <span className='operationColor' onClick={()=>{deleteClick(record.key)}}>删除</span>
      </div>
    }
  ];
  //查看房号
  const watchHouseNumber=(record)=>{
    console.log(record,'record');
    if(!!record.eachLayerOfRoomNumber && !!record.totalNumberOfFloors){
      dispatch(routerRedux.push({
        pathname: `/developmentDictionary/shopsManagement/watchHousingNumberShop`,
        state:{
          id:record.key,
          totalNumberOfFloors:record.totalNumberOfFloors,
          roomPrefix:record.roomPrefix,
          household:parseInt(record.eachLayerOfRoomNumber),
          roomNumberStartingValue:record.roomNumberStartingValue,
        }
      }));
    }else{
      message.error('请先完善楼栋信息')
    }
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  //删除
  const deleteClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'shopsLoudongManagement/deleteOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'shopsLoudongManagement/initialSuccess',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //添加编辑楼栋相关的函数
  const addShopsLoudong=()=>{
    dispatch({
      type:'shopsLoudongManagement/addShopsLoudong'
    })
    dispatch({
      type:'shopsLoudongManagement/findLabel',
      payload:{
        groups:[
          {typeName:'楼栋建筑类型',
          areaPath:null,}
        ],
      }
    })
  }
  const handleOk=()=>{
    form.validateFields((err, values) => {
			if (err) {
				return;
			}else{
        if(editStatus==false){
          dispatch({type:'shopsLoudongManagement/handleOk',
            payload:{
              buildingTypes:values.buildingTypes,
              communityId:communityId,
              constructionTime:values.constructionTime,
              eachLayerOfRoomNumber:values.eachLayerOfRoomNumber,
              roomPrefix:values.roomPrefix,
              name:values.name,
              roomNumberStartingValue:values.roomNumberStartingValue,
              totalNumberOfFloors:values.totalNumberOfFloors,
              pageNo:0,
            }
          })
          dispatch({
            type:'shopsLoudongManagement/initialSuccess',
            payload:{
              loading:true,
            }
          })
        }else{
          dispatch({type:'shopsLoudongManagement/edithandleOk',
            payload:{
              id:id,
              buildingTypes:values.buildingTypes,
              communityId:communityId,
              constructionTime:values.constructionTime,
              eachLayerOfRoomNumber:values.eachLayerOfRoomNumber,
              roomPrefix:values.roomPrefix,
              name:values.name,
              roomNumberStartingValue:values.roomNumberStartingValue,
              totalNumberOfFloors:values.totalNumberOfFloors,
              pageNo:0,
            }
          })
          dispatch({
            type:'shopsLoudongManagement/initialSuccess',
            payload:{
              loading:true,
            }
          })
        }
      resetFields();
      }
		});
  }
  const handleCancel=()=>{
    dispatch({
      type:'shopsLoudongManagement/handleCancel'
    })
  }
  const editClick=(key)=>{
    dispatch({
      type:'shopsLoudongManagement/editClick',
      payload:{
        id:key,
      }
    })
    dispatch({
      type:'shopsLoudongManagement/findLabel',
      payload:{
        groups:[
          {typeName:'楼栋建筑类型',
          areaPath:null,}
        ],
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'shopsLoudongManagement/pageNoChange',
        payload:{
          pageNo:page,
          communityId:communityId,
        }
      })
      dispatch({
        type:'shopsLoudongManagement/initialSuccess',
        payload:{
          loading:true,
        }
      })
    }
  }
  return(
    <div>
      <DxPanel title='楼栋管理'>
        <p>{shangPuName}</p>{/*后端给数据*/}
        <Button type='primary' onClick={addShopsLoudong}>+添加楼栋</Button>
        <Table columns={columns} dataSource={dataSource}
          pagination={pagination}
          loading={loading}
        />
        {/*以下为添加编辑的模态框*/}
        <Modal title={editStatus==true?'修改楼栋':'添加楼栋'} visible={createLoudong}
          onOk={handleOk} onCancel={handleCancel}
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
                <Input type='text' placeholder='请填写总楼层数，限整数' addonAfter='层'/>
              )}
            </FormItem>
            <FormItem
              label='每层房间数'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('eachLayerOfRoomNumber', {
                initialValue:eachLayerOfRoomNumber,
                rules: [
                  { required: true, message: '请输入' },
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请输入'/>
              )}
            </FormItem>

            <FormItem
              label='房间前缀'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('roomPrefix', {
                initialValue:roomPrefix,
                rules: [
                  { required: true, message: '请填写房间前缀' },
                ],
              })(
                <Input type='text' placeholder='请填写房间前缀'/>
              )}
            </FormItem>
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
              label='建筑类型'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('buildingTypes', {
                initialValue:buildingTypes,
              })(
                <Select placeholder='-请选择-'>{/*需要请求*/}
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
        <div className='gobacks'>
          <Button type='ghost' onClick={goBack}>返回</Button>
        </div>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({shopsLoudongManagement}) {
  return {shopsLoudongManagement}
}

export default connect(mapStateToProps)(Form.create({
  mapPropsToFields:(props)=>{
    return {
      name:props.name,
      buildingTypes:props.buildingTypes,
      constructionTime:props.constructionTime,
      roomNumberStartingValue:props.roomNumberStartingValue,
      totalNumberOfFloors:props.totalNumberOfFloors,
      eachLayerOfRoomNumber:props.eachLayerOfRoomNumber,
      roomPrefix:props.roomPrefix,
    }
  }
})(ShopsLoudongManagement));
