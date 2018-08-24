import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Row,Col,Cascader,message,Select} from 'antd';
const FromItem=Form.Item;
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import show from '../../assets/images/show.png'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import './PutManage.css'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
const _getNameArrByCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.lable);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}
const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}
function PutManage({dispatch,form,putManage}) {
  const{
    oneData,
    isEdit,
    tableData,
    tableLoading,
    promptObj,
    visible,
    areaAndCode,
    showPicList,
    areaPath,
    imgSrc,
    total,
    pageNo,
    areaOrgin,
  }=putManage;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const upLoadPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    hideName:true,
    changeList:(data)=>{
      dispatch({
        type:"putManage/changePicList",
        payload:data
      })
    },//更新list回调
  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
      // width:"10%"
    },
    {
      title:'标题',
      dataIndex:'headline',
    },
    {
      title:'类型',
      dataIndex:'apkType',
      render:(text,record,index)=>{
        let apkText="经纪人";
        if(text==="customer"){
          apkText="客户";
        }
        return (
          <span>{apkText}</span>
        )
      }
    },
    {
      title:'链接',
      dataIndex:'address',
      // width:"40%"
    },
    {
      title:'地区',
      dataIndex:'areaPath',
    },
    {
      title:"状态",
      dataIndex:'status',
    },
    {
      title:"操作",
      render:(text,record,index)=>{
        if(record.status==="待上线"){
          return(waitOnLine(record,index))
        }else if(record.status==="已上线"){
          return(areadyOnLine(record,index))
        }else{
          return(areadyOffLine(record,index))
        }
      }
    }
  ]
  const waitOnLine=(record,index)=>{
    if(index===0){
      return(
        <div>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>onLine(record)}>上线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else if(index===tableData.length-1){
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>onLine(record)}>上线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else{
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>onLine(record)}>上线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }
  }
  const areadyOnLine=(record,index)=>{
    if(index===0){
      return(
        <div>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>offLine(record)}>下线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else if(index===tableData.length-1){
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>offLine(record)}>下线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else{
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>offLine(record)}>下线</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }
  }
  const areadyOffLine=(record,index)=>{
    if(index===0){
      return(
        <div>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else if(index===tableData.length-1){
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }else{
      return(
        <div>
          <span className="operation" onClick={()=>moveUp(record)}>上移</span>
          <span className="operation" onClick={()=>moveDown(record)}>下移</span>
          <span className="operation" onClick={()=>handleEdit(record)}>编辑</span>
          <span className="operation" onClick={()=>handleDelete(record)}>删除</span>
        </div>
      )
    }
  }
  const onLine=(record)=>{
    dispatch({
      type:"putManage/onLine",
      payload:{
        id:record.key
      }
    })
  }
  const offLine=(record)=>{
    dispatch({
      type:"putManage/offLine",
      payload:{
        id:record.key
      }
    })
  }
  const moveUp=(record)=>{
    dispatch({
      type:"putManage/moveUp",
      payload:{
        id:record.key,
        sortIdx:record.sortIdx
      }
    })
  }
  const moveDown=(record)=>{
    dispatch({
      type:"putManage/moveDown",
      payload:{
        id:record.key,
        sortIdx:record.sortIdx
      }
    })
  }
  const handleEdit=(record)=>{
    dispatch({
      type:"putManage/changeIsEdit",
      payload:{
        isEdit:true,
      }
    })
    dispatch({
      type:"putManage/getOneData",
      payload:{
        id:record.key
      }
    })
  }
  const handleDelete=(record)=>{
    dispatch({
      type:"putManage/deleteOne",
      payload:{
        id:record.key
      }
    })
  }
  const onOkCallBack=()=>{
    if(promptObj.todo=='closeModalAndFetch'){
      dispatch({
        type:"putManage/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"putManage/changeVisible",
        payload:{
          visible:false,
          isEdit:false,
        }
      })
      dispatch({
        type:"putManage/getInitTableData"
      })
    }
    if(promptObj.todo==="closeModal"){
      dispatch({
        type:"putManage/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
  const showAddModal=()=>{
    dispatch({
      type:"putManage/changeVisible",
      payload:{
        showPicList:[],
        isEdit:false,
        visible:true
      }
    })
  }
  const handleCancel=()=>{
    resetFields();
    dispatch({
      type:"putManage/changeVisible",
      payload:{
        visible:false
      }
    })
  }
  const handleSubmit=(e)=>{
    // validateFields((errors) => {
    //   if (errors) {
    //     return;
    //   }
    //   const data = { ...getFieldsValue()};
    //   //返回父级填写的订单信息
    //   this.props.creatOrder({...data,payId,});
    //   this.setState({
    //     payVisible:true,
    //   });
    //   this.timer = setInterval(() => this.tick(),1000);
    //   // resetFields();
    // });

    // e.preventDefault();
    validateFields((err, values) => {
      console.log('err',err);
      if(err){
        return
      }
      if (!err) {
        if(isEdit){
          let dataValues={};
          if(!values.code){
            return message.error('城市必填')
          }else{
            dataValues.code=values.code.join('/')
            dataValues.areaPath=_getNamePathsByCode(areaOrgin,values.code[values.code.length-1])
          }
          if(showPicList.length==0){
            return message.error('图片必须存在')
          }
          showPicList.map(item=>{
            if(imgSrc===item.src){
              dataValues.url=item.src
            }else{
              dataValues.key=item.id
            }
          })
          dataValues.id=oneData.id;
          dataValues.address=values.address;
          dataValues.headline=values.headline;
          dataValues.source=values.source;
          dataValues.apkType=values.apkType;
          dispatch({
            type:"putManage/editAdvertisement",
            payload:dataValues
          })
        }else{
          values.code=values.code.join('/')
          showPicList.map(item=>{
            values.key=item.id
          })
          values.areaPath=areaPath
          dispatch({
            type:"putManage/addAdvertisement",
            payload:values
          })
        }
      }
    });
    // form.resetFields();
  }
  //分页
  const pagination={
    total:total,
		showTotal:total => `共 ${total} 项`,
		pageSize:10,
    current:pageNo,
		onChange:(page)=>{
      // dispatch({type:'putManage/loading',
      //   payload:{tableLoading:true}
      // })
      dispatch({
        type:'putManage/getInitTableData',
        payload:{
          pageNo:page-1,
          pageSize:10,
        }
      })
    },
  }
  const resetForm =()=>{
    form.resetFields();
  }
  return (
    <div className="putManagement">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Modal
        width={600}
        visible={visible}
        footer=''
        onCancel={handleCancel}
        afterClose={resetForm}
        >
        <DxPanel title="添加广告">
          <Form>
            <Row>
              {/*<Col span={9}>
                <img src={show}/>
              </Col>*/}
              <Col span={24}>
                  <FormItem {...formItemLayout} label="标题" hasFeedback>
                   {getFieldDecorator('headline', {
                     initialValue:!!isEdit?oneData.headline:null,
                      rules: [{ required: true, message: '请输入标题!' },],
                      })(
                        <Input placeholder="请输入标题"/>
                     )}
                   </FormItem>
                  
                   <FormItem {...formItemLayout} label="类型" hasFeedback>
                   {getFieldDecorator('apkType', {
                     initialValue:!!isEdit?oneData.apkType:null,
                      rules: [{ required: true, message: '请选择类型!' },],
                      })(
                        <Select placeholder='类型'>
                          <Option value='broker'>经纪人</Option>
                          <Option value='customer'>客户</Option>
                        </Select>
                     )}
                   </FormItem>

                  <FormItem {...formItemLayout} label="来源" hasFeedback>
                   {getFieldDecorator('source', {
                     initialValue:!!isEdit?oneData.source:null,
                      rules: [{ required: false, message: '' },],
                      })(
                        <Input placeholder="请输入来源（选填）"/>
                     )}
                   </FormItem>
                   <FormItem {...formItemLayout} label="城市">
                    {getFieldDecorator('code', {
                     initialValue:!!isEdit?oneData.code:[],
                       rules: [{ required: true, message: '请选择城市!' },],
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
                               type:"putManage/saveAreaCode",
                               payload:{
                                 areaPath:'/'+areaPath.join('/')
                               }
                             })
                           }}
                           options={areaAndCode}
                           expandTrigger="hover"
                           style={{width:"100%"}}
                           placeholder="请选择" />
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="封面图片">
                      <span>（大图片建议尺寸：900像素*500像素，必传）</span>
                      <DxUpLoadPic {...upLoadPicProps}/>
                  </FormItem>
                  <FormItem {...formItemLayout} label="地址连接（选填）" hasFeedback>
                      {getFieldDecorator('address', {
                        initialValue:!!isEdit?oneData.address:null,
                         rules: [{ required: false, message: '' },],
                         })(
                           <Input placeholder="请输入地址链接"/>
                        )}
                  </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="putManageButtons">
                  <Button onClick={handleSubmit} type="primary">确定</Button>
                  <Button onClick={handleCancel} type="ghost">取消</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </DxPanel>
      </Modal>
      <DxPanel title='广告管理'>
        {!!tableLoading?null:<Button type='primary' onClick={showAddModal}>+添加内容</Button>}
        <Table columns={columns} dataSource={tableData} loading={tableLoading} pagination={pagination}/>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({putManage}) {
  return {putManage }
}

export default connect(mapStateToProps)(Form.create()(PutManage));
