import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Cascader,Select,Upload,message} from 'antd';
const FromItem=Form.Item;
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import './ContractAgreementModulesManage.css'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
const Option=Select.Option;
function ContractAgreementModulesManage({dispatch,form,contractAgreementModulesManage}) {
  const {uploadContractStatus,dataSource,loading,labelArr,dxLoading,warningStatus,
    total,pageNo,keyword,city,cityArr,key,agreementName,editStatus,id,areaPath,
    agreementType,most
  }=contractAgreementModulesManage;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  //搜索
  const formSearch=(data)=>{
    let citys='';
    if(data.city){
      citys='/'+data.city.join('/');
    }
    dispatch({type:'contractAgreementModulesManage/searchContract',
      payload:{
        agreementName:data.keyword,
        areaPath:citys,
        pageNo:0,
      }
    })
  }
  //重置
  const resetField=()=>{
    dispatch({type:'contractAgreementModulesManage/resetField',
      payload:{
        agreementName:'',
        areaPath:'',
        pageNo:0,
      }
    })
  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'协议类型',
      dataIndex:'agreementType',
    },
    {
      title:'协议文件',
      dataIndex:'agreementName',
    },
    {
      title:'适用城市',
      dataIndex:'areaPath',
    },
    {
      title:'更新时间',
      dataIndex:'updateDate',
    },
    {
      title:'操作人员',
      dataIndex:'userName',
    },
    {
      title:'操作',
      dataIndex:'operations',
      render:(text,record)=><div>
        <span className='operationsColor' onClick={()=>{editClickContract(record.key)}}>编辑</span>
        <a href={record.url} className='operationsColor' download >下载</a>
        <span className='operationsColor' onClick={()=>{deleteContract(record.key)}}>删除</span>
      </div>
    },
  ]
  //编辑
  const editClickContract=(id)=>{
    dispatch({type:'contractAgreementModulesManage/initailSuccess',
      payload:{
        id:id,
        editStatus:true,
        key:'',
      }
    })
  }

  const editOk=()=>{
    if(id && most.length!=0){
      console.log(most,'mostmost');
      dispatch({
        type:'contractAgreementModulesManage/editOk',
        payload:{
          id:id,
          agreementName:most[most.length-1].agreementName,
          key:most[most.length-1].key,
        }
      })
    }else{
      message.error('请选择文件')
    }
  }
  const editCancel=()=>{
    dispatch({
      type:'contractAgreementModulesManage/initailSuccess',
      payload:{
        id:'',
        editStatus:false,
        key:'',
      }
    })
  }
  //删除
  const deleteContract=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除？',
      onOk() {
        dispatch({type:'contractAgreementModulesManage/initailSuccess',
          payload:{loading:true}
        })
        dispatch({
          type:'contractAgreementModulesManage/deleteContract',
          payload:{
            id:key,
          }
        })
      },
      onCancel() {},
    });
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'contractAgreementModulesManage/paginationChange',
        payload:{
          pageNo:page-1,
          areaPath:city,
          agreementName:keyword,
        }
      })
      dispatch({
        type:'contractAgreementModulesManage/initailSuccess',
        payload:{
          loading:true,
        }
      })
    }
  }
  //上传
  const uploadContract=()=>{
    dispatch({
      type:'contractAgreementModulesManage/initailSuccess',
      payload:{uploadContractStatus:true}
    })
    dispatch({
      type:'contractAgreementModulesManage/uploadContract',
      payload:{
        groups:[
          {areaPath:null,typeName:'协议类型'}
        ]
      }
    })
  }
  const uploadProps={
    showUploadList:false,
    name:"file",
    method:"post",
    action:"/miss-anzhu-aliyun-file/putfile",
    data:{originalFileName:true},
    beforeUpload:(file)=>{
      // console.log(file);
      if(file.size==0 || file.size>1024000000){
        message.error('上传失败,文件不能为空或大于10M')
        return false
      }
    },
    onChange:(info,fileList)=>{
      dispatch({type:'contractAgreementModulesManage/initailSuccess',
        payload:{dxLoading:true}
      })
      if(!!info&&info.file.status==='done'){
        if(!!info.file.response&&info.file.response.status==='success'){
          if(!!info.file.response.data.key){
            //
            // info.fileList.map((item,index)=>(
            //   mosts.push({
            //     key:item.response.data.key,
            //     agreementName:item.name.replace(/\.\w+$/,''),
            //   })
            // ))
            most.push({
              key:info.file.response.data.key,
              agreementName:info.file.name.replace(/\.\w+$/,''),
            })
            dispatch({
              type:'contractAgreementModulesManage/initailSuccess',
              payload:{
                most:most,
                dxLoading:false,
              }
            })
            message.success('上传成功')
          }else{
            message.error('上传失败')
          }
        }
      }
    }
  }
  const uploadCancel=()=>{
    dispatch({
      type:'contractAgreementModulesManage/initailSuccess',
      payload:{
        agreementName:'',
        key:'',
        agreementType:'',
        areaPath:'',
        uploadContractStatus:false,
        most:[],
      }
    })
    resetFields();
  }
  const uploadSure=()=>{
    form.validateFields((err, values) => {
      if(err){
        return
      }
      if(most.length!=0){
        dispatch({type:'contractAgreementModulesManage/uploadSure',
          payload:{
            most:most,
            agreementType:values.agreementType,
            areaPath:'/'+values.areaPath.join('/'),
          }
        })
      }else{
        message.error('请选择文件')
      }
      resetFields();
    })
  }
  const warningCancel=()=>{
    dispatch({type:'contractAgreementModulesManage/findAll'})
  }
  const warningOk=()=>{
    dispatch({type:'contractAgreementModulesManage/uploadSure',
      payload:{
        agreementName:agreementName.replace(/\.\w+$/,''),
        agreementType:agreementType,
        areaPath:areaPath,
        key:key,
      }
    })
  }
  return (
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        cascaderOptions={cityArr}
        placeholder='搜索协议文件名称'/>
      <Button type='primary' onClick={uploadContract}>上传合同</Button>
      <Table columns={columns} dataSource={dataSource}
        pagination={pagination} loading={loading}
      />
      <DxLoadingShadow visible={dxLoading}/>
      <Modal title='上传协议'
        visible={uploadContractStatus} onOk={uploadSure}
        onCancel={uploadCancel}
      >
        <Form>
          <FormItem
            label='协议类型'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('agreementType', {
                rules: [
                  { required: true, message: '必选' },
                ],
              })(
              <Select>
                {!!labelArr && labelArr.map((item,index)=>(
                  <Option value={item.value} key={`key_${index}`}>{item.value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            label='适用城市'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('areaPath', {
                rules: [
                  { required: true, message: '必选' },
                ],
              })(
              <Cascader options={cityArr} placeholder='--'
                changeOnSelect={true}
              />
            )}
          </FormItem>
          <Upload {...uploadProps}>
            <Button type='primary'>
              选择文件
            </Button>
            <div className='textalgin'>
              {most.length!=0 &&most.map((item,index)=>(
                <div key={`item_${index}`}>{item.agreementName}</div>
              ))}
            </div>
          </Upload>
        </Form>
        <div className='textalgin'>
          <span>{agreementName}</span>
        </div>
      </Modal>
      <Modal title='编辑' visible={editStatus}
        onOk={editOk} onCancel={editCancel}
      >
        <Upload {...uploadProps}>
          <Button type='primary'>
            选择文件
          </Button>
          <div className='textalgin'>
            {most.length!=0 &&
              <div>{most[most.length-1].agreementName}</div>
            }
          </div>
        </Upload>
      </Modal>
      <Modal title='提示'
        onOk={warningOk} onCancel={warningCancel} visible={warningStatus}
      >
        <p>选择城市中已有‘{agreementName}‘模版，继续操作将替换现有模版，请确认</p>
      </Modal>
    </div>
  );
}

function mapStateToProps({contractAgreementModulesManage}) {
  return {contractAgreementModulesManage}
}

export default connect(mapStateToProps)(Form.create()(ContractAgreementModulesManage));
