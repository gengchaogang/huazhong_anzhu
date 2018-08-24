import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button,Cascader,Table,Tabs,Modal} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './OfficeBuilding.css'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
const TabPane = Tabs.TabPane;
function OfficeBuilding({dispatch,officeBuilding }) {
  const {
    publishedDataSource,
		shelfedDataSource,
		unpublishedDataSource,
    keyword,//关键字查询
    pageNo,//当前页数
		total,//总页数
		status,//tabs状态
		id,//商铺的id
    loading,
    areaName,
		optionsCity,
  }=officeBuilding;
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
      title:'写字楼名称',
      dataIndex:'officeName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'totalHouses',
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
        <span className='operationColor' onClick={()=>{officeLoudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{officePhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{officeEidtBuilding(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{officeXiaJia(record.key)}}>下架</span>
      </div>
    },
  ]
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
      title:'写字楼名称',
      dataIndex:'officeName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'totalHouses',
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
        <span className='operationColor' onClick={()=>{officeShangJia(record.key)}}>上架</span>
        <span className='operationColor' onClick={()=>{officeLoudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{officePhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{officeEidtBuilding(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{officeDelete(record.key)}}>删除</span>
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
      title:'写字楼名称',
      dataIndex:'officeName',
    },
    {
      title:'楼栋',
      dataIndex:'loudong',
    },
    {
      title:'总户数',
      dataIndex:'totalHouses',
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
        <span className='operationColor' onClick={()=>{officeFabu(record.key)}}>发布</span>
        <span className='operationColor' onClick={()=>{officeLoudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{officePhotoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{officeEidtBuilding(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{officeDelete(record.key)}}>删除</span>
      </div>
    },
  ]
  //楼栋管理
  const officeLoudongManagement=(key)=>{
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
  //相册管理
  const officePhotoManagement=(record)=>{
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
  //创建写字楼
  const officceCreateBuilding=()=>{
    dispatch(routerRedux.push({
			pathname: `/developmentDictionary/officeBuilding/officceCreateBuilding`,
		}));
  }
  //编辑写字楼
  const officeEidtBuilding=(record)=>{
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
  //删除
  const officeDelete=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'officeBuilding/officeDeleteOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'officeBuilding/initialSuccess',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //下架
  const officeXiaJia=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要下架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'officeBuilding/officeXiaJiaOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'officeBuilding/initialSuccess',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //上架
  const officeShangJia=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要上架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'officeBuilding/officeShangJiaOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'officeBuilding/initialSuccess',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //发布
  const officeFabu=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要发布吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'officeBuilding/officeFabuOk',
          payload:{
            id:key,
          }
        })
        dispatch({
          type:'officeBuilding/initialSuccess',
          payload:{
            loading:true,
          }
        })
      }
    });
  }
  //当前tabs的key
  const statusOnchange=(key)=>{
    dispatch({
      type:'officeBuilding/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'officeBuilding/statusOnchange',
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
      dispatch({type:'officeBuilding/pageNoChange',
        payload:{
          pageNo:page,
          status:status,
          name:keyword,
          areaName:areaName,
        }
      })
      dispatch({
        type:'officeBuilding/initialSuccess',
        payload:{
          loading:true,
        }
      })
    }
  }
  //搜索
  const formSearch=(data)=>{
    let areaName;
    if(!!data.city){
      areaName='/'+data.city.join('/')
    }
    dispatch({
      type:'officeBuilding/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'officeBuilding/formSearch',
      payload:{
        pageNo:0,
        status:status,
        name:data.keyword,
        areaName:areaName,
      }
    })
  }
  //重置
  const resetField=()=>{
    dispatch({
      type:'officeBuilding/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'officeBuilding/resetField',
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
        placeholder='搜索写字楼名称'
        cascaderOptions={optionsCity}
      />
      <Button type='primary' onClick={officceCreateBuilding}>创建写字楼</Button>
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

function mapStateToProps({officeBuilding}) {
  return {officeBuilding}
}

export default connect(mapStateToProps)(OfficeBuilding);
