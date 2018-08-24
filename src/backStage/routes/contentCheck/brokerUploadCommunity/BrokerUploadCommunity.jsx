import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader,Select} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './BrokerUploadCommunity.css'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const _judgeName=(data)=>{
  switch (data) {
    case '小区':
      return '小区名称';
    case '商铺':
      return '商铺名称';
    default:
      return '写字楼名称';
  }
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function BrokerUploadCommunity({dispatch,brokerUploadCommunity,form}) {
  const {loading,translateData,type,officeData,selectData,delId,name,
    shopsData,pageNo,total,mergeStatus,parkingSpaces,areaName,
  }=brokerUploadCommunity;
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
      title:'地区',
      dataIndex:'areaName',
    },
    {
      title:_judgeName(type),
      dataIndex:'name',
    },
    {
      title:'楼栋',
      dataIndex:'numberOfBuilding',
    },
    {
      title:'总户数',
      dataIndex:'totalHouseholds',
    },
    {
      title:'在售',
      dataIndex:'onsell',
    },
    {
      title:'在租',
      dataIndex:'inRent',
    },
    {
      title:'上传时间',
      dataIndex:'updateTime',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=>{
        if(record.status=='未发布'){
          return (
            <div>
              <span className='operationColor' onClick={()=>{perfectInformation(record.key)}}>完善信息</span>
              <span className='operationColor' onClick={()=>{photoManagement(record.key)}}>相册管理</span>
              <span className='operationColor' onClick={()=>{loudongManagement(record)}}>楼栋管理</span>
              {/*<span className='operationColor' onClick={()=>{mergeOperation(record)}}>合并</span>*/}
              <span className='operationColor' onClick={()=>{communitiesRrelease(record.key)}}>发布</span>
              <span className='operationColor' onClick={()=>{deleteClick(record.key)}}>删除</span>
            </div>
          )
        }else{
          return(
            <div>
              <span className='operationColor' onClick={()=>{perfectInformation(record.key)}}>完善信息</span>
              <span className='operationColor' onClick={()=>{photoManagement(record.key)}}>相册管理</span>
              <span className='operationColor' onClick={()=>{loudongManagement(record)}}>楼栋管理</span>
               {/*<span className='operationColor' onClick={()=>{mergeOperation(record)}}>合并</span>*/}
              <span className='operationColor' onClick={()=>{deleteClick(record.key)}}>删除</span>
            </div>
          )
        }
      }
    }
  ]
  //发布
  const communitiesRrelease=(key)=>{
    dispatch({
      type:'brokerUploadCommunity/communitiesRrelease',
      payload:{
        id:key,
        // type:type,
      }
    })
  }
  //删除
  const deleteClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk() {
        // dispatch({
        //   type:'brokerUploadCommunity/initailSuccess',
        //   payload:{loading:true}
        // })
        if(type=='小区'){
          dispatch({
            type:'brokerUploadCommunity/deleteCommunity',
            payload:{
              id:key,
            }
          })
        }else if(type=='商铺'){
          dispatch({
            type:'brokerUploadCommunity/deleteShop',
            payload:{
              id:key,
            }
          })
        }else{
          dispatch({
            type:'brokerUploadCommunity/deleteBuilding',
            payload:{
              id:key,
            }
          })
        }
      },
      onCancel() {},
    });
  }
  //标签页切换
  const callback=(key)=>{
    dispatch({type:'brokerUploadCommunity/initailSuccess',
      payload:{loading:true}
    })
    dispatch({type:'brokerUploadCommunity/renderingTable',
      payload:{
        type:key,
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'brokerUploadCommunity/renderingTable',
        payload:{
          pageNo:page,
          type:type,
        }
      })
    }
  }
  //相册管理
  const photoManagement=(key)=>{
    if (type=='小区') {
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/photoManagement`,
        state:{
          id:key,
        }
  		}));
    }else if(type=='商铺'){
      dispatch(routerRedux.push({
        pathname: `/developmentDictionary/shopsManagement/shopsPhotoManagement`,
        state:{
          id:key,
        }
      }))
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officePhotoManagement`,
        state:{
          id:key,
        }
  		}));
    }
  }
  //楼栋管理
  const loudongManagement=(key)=>{
    if (type=='小区') {
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/loudongManagement`,
        state:{
          communityId:key.key,
          xiaoQuName:key.name,
        }
  		}));
    }else if(type=='商铺'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/shopsManagement/shopsLoudongManagement`,
        state:{
          communityId:key.key,
          shangPuName:key.name,
        }
  		}));
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officeLoudongManagement`,
        state:{
          communityId:key.key,
          officeName:key.name,
        }
  		}));
    }
  }
  //完善信息
  const perfectInformation=(key)=>{
    if (type=='小区') {
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/createCell`,
        state:{
          id:key
        }
  		}));
    }else if(type=='商铺'){
      dispatch(routerRedux.push({
        pathname: `/developmentDictionary/shopsManagement/shopsCreateShangPu`,
        state:{
          id:key,
        }
      }))
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officceCreateBuilding`,
        state:{
          id:key,
        }
  		}));
    }
  }
  const mergeOperation=(key)=>{
    if(type=='小区'){
      dispatch({type:'brokerUploadCommunity/choseMerge',
        payload:{
        areaName:'/'+key.areaName.replace(/-/g,'/'),
        delId:key.key,
        name:key.name,
      }})
    }else if(type=='商铺'){
      dispatch({type:'brokerUploadCommunity/choseMergeShop',
        payload:{
        areaName:'/'+key.areaName.replace(/-/g,'/'),
        delId:key.key,
        name:key.name,
      }})
    }else{
      dispatch({type:'brokerUploadCommunity/choseMergeOffice',
        payload:{
        areaName:'/'+key.areaName.replace(/-/g,'/'),
        delId:key.key,
        name:key.name,
      }})
    }

  }
  const mergeOk=()=>{
    form.validateFields((err, values) => {
      dispatch({
        type:'brokerUploadCommunity/initailSuccess',
        payload:{loading:true}
      })
      if(type=='小区'){
        dispatch({
          type:'brokerUploadCommunity/mergeOk',
          payload:{
            areaName:areaName,
            delId:delId,
            id:parseInt(values.residentialName),
          }
        })
      }else if(type=='商铺'){
        dispatch({
          type:'brokerUploadCommunity/combineShop',
          payload:{
            areaName:areaName,
            delId:delId,
            id:parseInt(values.residentialName),
          }
        })
      }else {
        dispatch({
          type:'brokerUploadCommunity/combineOfficeBuilding',
          payload:{
            areaName:areaName,
            delId:delId,
            id:parseInt(values.residentialName),
          }
        })
      }
    })
    resetFields();
  }
  const mergeCancel=()=>{
    dispatch({
      type:'brokerUploadCommunity/initailSuccess',
      payload:{
        mergeStatus:false,
        loading:false,
        areaName:'',
      }
    })
    resetFields();
  }
  return (
    <div>
      <Tabs defaultActiveKey='小区' onChange={callback} type='card'>
        <TabPane tab="小区" key="小区">
          <Table columns={columns}
            dataSource={translateData}
            loading={loading}
            pagination={pagination}
          />
        </TabPane>
        <TabPane tab="商铺" key="商铺">
          <Table columns={columns} dataSource={shopsData}
            loading={loading}
            pagination={pagination}
          />
        </TabPane>
        <TabPane tab="写字楼" key="写字楼">
          <Table columns={columns} dataSource={officeData}
            loading={loading}
            pagination={pagination}
          />
        </TabPane>
      </Tabs>
      <Modal title='合并' visible={mergeStatus}
        onOk={mergeOk} onCancel={mergeCancel}
      >
        {!!areaName && <p className='belongArea'>所在区域：{areaName.replace('/','').replace(/\//g,'-')}</p>}
        <Form>
          <FormItem
            label='小区名称'
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('residentialName', {
              })(
              <Select>
                {!!selectData && selectData.map((item,index)=>(
                  <Option value={item.id.toString()} key={`item_${index}`}>{item.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
        {!!name && <div><span className='namebelong'>{name}</span><span> 将被删除</span></div>}
      </Modal>
    </div>
  );
}

function mapStateToProps({brokerUploadCommunity}) {
  return {brokerUploadCommunity}
}

export default connect(mapStateToProps)(Form.create()(BrokerUploadCommunity));
