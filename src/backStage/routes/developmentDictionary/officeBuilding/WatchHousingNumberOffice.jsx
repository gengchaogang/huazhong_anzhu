import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader,Select} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './WatchHousingNumberOffice.css'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function WatchHousingNumberOffice({dispatch,watchHousingNumberOffice,form}) {
  const {household,id,totalNumberOfFloors,roomNumberStartingValue,roomPrefix,
    setHouseNoStatus,dataSurce,orgin,choseRulesStatus,loading,
    isCreate
  }=watchHousingNumberOffice;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const columns=[
    {
      title:'楼层',
      dataIndex:'floorName',
    },
  ]
  if(!!household){
    for(let i=0;i<household;i++){
      columns.push({
        title:`第${i+1}户`,
        dataIndex:`room${i}`,
        render:(text,record)=>{
          return (
            <FormItem>
              {getFieldDecorator(`${record.key}_room${i}`, {
                initialValue:text,
              })(
                <Input addonBefore={roomPrefix} addonBefore={roomPrefix} placeholder='请输入起始房号，如101'/>
              )}
            </FormItem>
          )
        }
      })
    }
  }
  const setHouseNumber=()=>{
    dispatch({
      type:'watchHousingNumberOffice/querySuccess',
      payload:{
        setHouseNoStatus:true,
      }
    })
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const setHouseNumberCancel=()=>{
    resetFields();
    dispatch({
      type:'watchHousingNumberOffice/querySuccess',
      payload:{setHouseNoStatus:false},
    })
  }
  const setHouseNumberOk=()=>{
    form.validateFields((err, values) => {
      const arr=[];
      for(let i=1; i<=parseInt(values.floorNo); i++){
        for(let j=1;j<=parseInt(values.allHushu); j++){
          arr.push({
            floor:i,
            roomNo:(values.firstHouseNo=='1-1'?`${i}-${j}`:`${i}0${j}`),
            roomCode:`${i}-${j}`,
            buildingId:id,
          })
        }
      }
      dispatch({
        type:'watchHousingNumberOffice/addHouseNumber',
        payload:{
          rooms:arr,
          buildingId:id,
        }
      })
    })
  }
  const funOrin=(code,arr)=>{
    let rulsut;
    for(let i=0;i<arr.length;i++){
      if(arr[i].roomCode==code){
        rulsut=arr[i].id;
        return rulsut
      }
    }
  }
  const editClick=()=>{
    form.validateFields((err, values) => {
      const arr=[];
      let temporary;
      let onlyId;
      for(let i=0; i<parseInt(values.floorNo); i++){
        for(let j=0;j<parseInt(values.allHushu); j++){
          temporary=`${i+1}_room${j}`;
          onlyId=`id${i}`;
          arr.push({
            floor:i+1,
            roomCode:`${i+1}-${j+1}`,
            id:funOrin(`${i+1}-${j+1}`,orgin),
            buildingId:id,
            roomNo:values[temporary],
          })
        }
      }
      dispatch({
        type:'watchHousingNumberOffice/querySuccess',
        payload:{loading:true}
      })
      dispatch({
        type:'watchHousingNumberOffice/editRoomsNumber',
        payload:{
          rooms:arr,
          buildingId:id,
        }
      })
    })
  }

  const batchGeneration=()=>{
    dispatch({
      type:'watchHousingNumberOffice/querySuccess',
      payload:{
        choseRulesStatus:true,
      }
    })
  }
  //批量生成确定
  const choseRulesOk=()=>{
    form.validateFields((err, values) => {
      const arr=[];
      let onlyId;
      let temporary;
      for(let i=0; i<parseInt(values.floorNo); i++){
        for(let j=0;j<parseInt(values.allHushu); j++){
          temporary=`${i+1}_room${j}`;
          onlyId=`id${i}`;
          arr.push({
            floor:i+1,
            roomCode:`${i+1}-${j+1}`,
            id:funOrin(`${i+1}-${j+1}`,orgin),
            buildingId:id,
            roomNo:(values.rules=='101'?`${i+1}0${j+1}`:`${i+1}-${j+1}`),
          })
        }
      }
      dispatch({type:'watchHousingNumberOffice/querySuccess',
        payload:{loading:true}
      })
      dispatch({
        type:'watchHousingNumberOffice/editRoomsNumber',
        payload:{
          rooms:arr,
          buildingId:id,
        }
      })
    })
  }
  //批量清除
  const clearGeneration=()=>{
    form.validateFields((err, values) => {
      const arr=[];
      let onlyId;
      let temporary;
      for(let i=0; i<parseInt(values.floorNo); i++){
        for(let j=0;j<parseInt(values.allHushu); j++){
          temporary=`${i+1}_room${j}`;
          onlyId=`id${i}`;
          arr.push({
            floor:i+1,
            roomCode:`${i+1}-${j+1}`,
            id:funOrin(`${i+1}-${j+1}`,orgin),
            buildingId:id,
            roomNo:'',
          })
        }
      }
      dispatch({type:'watchHousingNumberOffice/querySuccess',
        payload:{loading:true}
      })
      dispatch({
        type:'watchHousingNumberOffice/editRoomsNumber',
        payload:{
          rooms:arr,
          buildingId:id,
        }
      })
    })
    form.resetFields();
  }
  const choseRulesCancel=()=>{
    dispatch({
      type:'watchHousingNumberOffice/querySuccess',
      payload:{choseRulesStatus:false}
    })
  }
  return (
    <DxPanel title='房源管理'>
      <Button type={isCreate==true?"ghost":'primary'} disabled={isCreate} onClick={setHouseNumber}>添加楼层房号</Button>
      <Button type='primary' onClick={batchGeneration}>更改房号显示规则</Button>
      <Button type='primary' onClick={clearGeneration}>清除房号</Button>
      <Button onClick={editClick} type='primary'>保存修改</Button>
      <Form>
        <Table columns={columns} dataSource={dataSurce} loading={loading}/>
      </Form>
      <Modal title='添加楼层房号' visible={setHouseNoStatus}
        onOk={setHouseNumberOk} onCancel={setHouseNumberCancel}
      >
        <Form>
          <FormItem
            label='设置房源起始值'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('firstHouseNo', {
            })(
              <Select>
                <Option value='101'>101</Option>
                <Option value='1-1'>1-1</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label='楼层总数'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('floorNo', {
              initialValue:totalNumberOfFloors,
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem
            label='每层户数'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('allHushu', {
              initialValue:household
            })(
              <Input disabled/>
            )}
          </FormItem>
        </Form>
      </Modal>
      {/*批量生成房号*/}
      <Modal title='更改房号显示规则' visible={choseRulesStatus}
        onOk={choseRulesOk} onCancel={choseRulesCancel}
      >
        <Form>
          <FormItem
            label='选择房号生成规则'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('rules', {
              initialValue:'101'
            })(
              <Select>
                <Option value='101'>101</Option>
                <Option value='1-1'>1-1</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
      <div>
        <Button  type='ghost' onClick={goBack}>返回</Button>
      </div>
    </DxPanel>
  );
}

function mapStateToProps({watchHousingNumberOffice}) {
  return {watchHousingNumberOffice}
}

export default connect(mapStateToProps)(Form.create()(WatchHousingNumberOffice));
