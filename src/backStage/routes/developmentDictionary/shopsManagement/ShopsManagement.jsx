import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button,Cascader,Table,Tabs,Modal} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './ShopsManagement.css'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
const TabPane = Tabs.TabPane;
function ShopsManagement({dispatch,shopsManagement }) {
  const {
    publishedDataSource,//已发布的dataSource
		shelfedDataSource,//已下架的dataSource
		unpublishedDataSource,//未发布的dataSource
    keyword,//关键字查询
    pageNo,//当前页数
		total,//总页数
		status,//tabs状态
		id,//商铺的id
    loading,
    areaName,
    optionsCity,
  }=shopsManagement;
  //搜索
  const formSearch=(data)=>{
    let areaName;
    if(!!data.city){
      areaName='/'+data.city.join('/')
    }
    dispatch({
      type:'shopsManagement/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'shopsManagement/formSearch',
      payload:{
        pageNo:0,
        status:status,
        name:data.keyword,
        areaName:areaName,
      }
    })
  }
  const publishedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'地区',
      dataIndex:'area',
    },
    {
      title:'商铺名称',
      dataIndex:'shangPuName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'allHuShu',
    },
    {
      title:'在售',
      dataIndex:'selling',
    },
    {
      title:'在租',
      dataIndex:'renting',
    },
    {
      title:'发布时间',
      dataIndex:'updateTime',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{shopsLoudongClick(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{shopsPhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{shopsEidtClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{xiaJiaClick(record.key)}}>下架</span>
      </div>
    },
  ];
  const shelfedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'地区',
      dataIndex:'area',
    },
    {
      title:'商铺名称',
      dataIndex:'shangPuName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'allHuShu',
    },
    {
      title:'在售',
      dataIndex:'selling',
    },
    {
      title:'在租',
      dataIndex:'renting',
    },
    {
      title:'下架时间',
      dataIndex:'updateTime',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{shopsShangJiaClick(record.key)}}>上架</span>
        <span className='operationColor' onClick={()=>{shopsLoudongClick(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{shopsPhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{shopsEidtClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{shopsDeleteClick(record)}}>删除</span>
      </div>
    },
  ]
  const unpublishedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'地区',
      dataIndex:'area',
    },
    {
      title:'商铺名称',
      dataIndex:'shangPuName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'allHuShu',
    },
    {
      title:'在售',
      dataIndex:'selling',
    },
    {
      title:'在租',
      dataIndex:'renting',
    },
    {
      title:'创建时间',
      dataIndex:'updateTime',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{shopsFubuClick(record.key)}}>发布</span>
        <span className='operationColor' onClick={()=>{shopsLoudongClick(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{shopsPhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{shopsEidtClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{shopsDeleteClick(record)}}>删除</span>
      </div>
    },
  ]
  //商铺 楼栋管理
  const shopsLoudongClick=(key)=>{
    if(key.different=='小区'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/loudongManagement`,
        state:{
          communityId:key.key,
          xiaoQuName:key.xiaoQuName,
        }
  		}));
    }else if(key.different=='商铺'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/shopsManagement/shopsLoudongManagement`,
        state:{
          communityId:key.key,
          shangPuName:key.shangPuName,
        }
  		}));
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officeLoudongManagement`,
        state:{
          communityId:key.key,
          officeName:key.officeName,
        }
  		}));
    }
  }
  //下架
  const xiaJiaClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要下架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'shopsManagement/xiaJiaOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'shopsManagement/loading',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //上架
  const shopsShangJiaClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要上架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'shopsManagement/shopsShangJiaOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'shopsManagement/loading',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //删除
  const shopsDeleteClick=(record)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'shopsManagement/shopsDeleteOk',
          payload:{
            id:record.key,
          }
        })
        dispatch({
          type:'shopsManagement/loading',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //发布
  const shopsFubuClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要发布吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'shopsManagement/shopsFubuJiaOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'shopsManagement/loading',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //相册管理
  const shopsPhotoManagement=(record)=>{
    if(record.different=='小区'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/photoManagement`,
        state:{
          id:record.key,
        }
  		}));
    }else if(record.different=='商铺'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/shopsManagement/shopsPhotoManagement`,
        state:{
          id:record.key,
        }
  		}));
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officePhotoManagement`,
        state:{
          id:record.key,
        }
  		}));
    }
  }
  //编辑
  const shopsEidtClick=(record)=>{
    if(record.different=='小区'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/residentialArea/createCell`,
        state:{
          id:record.key
        }
  		}));
    }else if(record.different=='商铺'){
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/shopsManagement/shopsCreateShangPu`,
        state:{
          id:record.key
        }
  		}));
    }else{
      dispatch(routerRedux.push({
  			pathname: `/developmentDictionary/officeBuilding/officceCreateBuilding`,
        state:{
          id:record.key
        }
  		}));
    }
  }

  //创建商铺
  const createShangPu=()=>{
    dispatch(routerRedux.push({
      pathname: `/developmentDictionary/shopsManagement/shopsCreateShangPu`,
    }))
  }
  //当前tabs的key
  const statusOnchange=(key)=>{
    dispatch({
      type:'shopsManagement/loading',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'shopsManagement/statusOnchange',
      payload:{
        pageNo:0,
        status:key,
        name:keyword,
        areaName:areaName,
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({type:'shopsManagement/pageNoChange',
        payload:{
          pageNo:page,
          status:status,
          name:keyword,
          areaName:areaName,
        }
      })
      dispatch({
        type:'shopsManagement/loading',
        payload:{
          loading:true,
        }
      })
    }
  }
  //重置
  const resetField=()=>{
    dispatch({
      type:'shopsManagement/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'shopsManagement/resetField',
      payload:{
        pageNo:0,
        status:status,
        name:'',
        areaName:'',
      }
    })
  }
  return(
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        cascaderOptions={optionsCity}
        placeholder='搜索商铺名称'
      />
      <Button type='primary' onClick={createShangPu}>创建商铺</Button>
      <Tabs defaultActiveKey="已发布" onChange={statusOnchange} type='card'>
        <TabPane tab='已发布' key='已发布'>
          <Table columns={publishedColumns}
            dataSource={publishedDataSource}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
        <TabPane tab='已下架' key='已下架'>
          <Table columns={shelfedColumns}
            dataSource={shelfedDataSource}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
        <TabPane tab='未发布' key='未发布'>
          <Table columns={unpublishedColumns}
            dataSource={unpublishedDataSource}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

function mapStateToProps({shopsManagement}) {
  return {shopsManagement}
}

export default connect(mapStateToProps)(ShopsManagement);
