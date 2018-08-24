import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button,Cascader,Table,Tabs,Modal} from 'antd';
import SearchInput from '../../../../commons/View/SearchInput'
import PublishedTable from '../../../components/developmentDictionary/residentialArea/PublishedTable'
//未发布
import NotPublishTable from '../../../components/developmentDictionary/residentialArea/NotPublishTable'
//已下架
import ClosedTable from '../../../components/developmentDictionary/residentialArea/ClosedTable'
import DxPanel from '../../../../commons/components/DxPanel'
import './ResidentialArea.css'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
const TabPane = Tabs.TabPane;

function ResidentialArea({dispatch,residentialArea }) {
  const {
    publishedDataSource,//已发布的dataSource
    shelfedDataSource,//已下架的dataSource
    unpublishedDataSource,//未发布的dataSource
    status,//tabs的状态
    pageNo,//当前页码
    total,//总页数
    name,//关键字查询
    id,//楼盘唯一编码
    loading,
    optionsCity,
    areaName,
  }=residentialArea;

  const publishedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: '小区名称',
      dataIndex: 'xiaoQuName',
    },
    {
      title: '楼栋',
      dataIndex: 'loudong',
    },
    {
      title: '总户数',
      dataIndex: 'allHuShu',
    },
    {
      title: '在售',
      dataIndex: 'selling',
    },
    {
      title: '在租',
      dataIndex: 'renting',
    },
    {
      title: '发布时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation1',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{loudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{photoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{editClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{xiaJiaClick(record.key)}}>下架</span>
      </div>
    },
  ]
  const shelfedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: '小区名称',
      dataIndex: 'xiaoQuName',
    },
    {
      title: '楼栋',
      dataIndex: 'loudong',
    },
    {
      title: '总户数',
      dataIndex: 'allHuShu',
    },
    {
      title: '在售',
      dataIndex: 'selling',
    },
    {
      title: '在租',
      dataIndex: 'renting',
    },
    {
      title: '下架时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation1',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{shangJiaClick(record.key)}}>上架</span>
        <span className='operationColor' onClick={()=>{loudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{photoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{editClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{xiaoQudelete(record)}}>删除</span>
      </div>
    },
  ]
  const unpublishedColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: '小区名称',
      dataIndex: 'xiaoQuName',
    },
    {
      title: '楼栋',
      dataIndex: 'loudong',
    },
    {
      title: '总户数',
      dataIndex: 'allHuShu',
    },
    {
      title: '在售',
      dataIndex: 'selling',
    },
    {
      title: '在租',
      dataIndex: 'renting',
    },
    {
      title: '创建时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation1',
      render:(text,record)=><div>
        <span className='operationColor' onClick={()=>{fabuClick(record.key)}}>发布</span>
        <span className='operationColor' onClick={()=>{loudongManagement(record)}}>楼栋管理</span>
        <span className='operationColor' onClick={()=>{photoManagement(record)}}>相册管理</span>
        <span className='operationColor' onClick={()=>{editClick(record)}}>编辑</span>
        <span className='operationColor' onClick={()=>{xiaoQudelete(record)}}>删除</span>
      </div>
    },
  ]
  //创建小区
  const createCell=()=>{
    dispatch(routerRedux.push({
			pathname: `/developmentDictionary/residentialArea/createCell`,
		}));
  }
  const editClick=(record)=>{
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
  //相册管理
  const photoManagement=(record)=>{
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
  const loudongManagement=(key)=>{
    // console.log(key.different,'key.differentkey.different');
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
          type:'residentialArea/initialSuccess',
          payload:{
            loading:true,
          }
        })
        dispatch({
          type:'residentialArea/xiaJiaOk',
          payload:{
            id:key,
          }
        })
      }
    });
  }
  //上架
  const shangJiaClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要上架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'residentialArea/initialSuccess',
          payload:{
            loading:true,
          }
        })
        dispatch({
          type:'residentialArea/shangJiaOk',
          payload:{
            id:key,
          }
        })
      }
    });
  }
  //发布
  const fabuClick=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要发布吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'residentialArea/initialSuccess',
          payload:{
            loading:true,
          }
        })
        dispatch({
          type:'residentialArea/fabuOk',
          payload:{
            id:key,
          }
        })
      }
    });
  }
  //删除
  const xiaoQudelete=(record)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type:'residentialArea/initialSuccess',
          payload:{
            loading:true,
          }
        })
          dispatch({
            type:'residentialArea/xiaoQudelete',
            payload:{
              id:record.key,
              name:name,
              areaName:areaName,
            }
          })
      }
    });
  }
  //搜索
  const formSearch=(data)=>{
    let areaName;
    if(!!data.city){
      areaName='/'+data.city.join('/')
    }
    dispatch({
      type:'residentialArea/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'residentialArea/formSearch',
      payload:{
        pageNo:0,
        status:status,
        name:data.keyword,
        areaName:areaName,
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({
        type:'residentialArea/initialSuccess',
        payload:{
          loading:true,
        }
      })
      dispatch({type:'residentialArea/pageNoChange',
        payload:{
          pageNo:page,
          status:status,
          name:name,
          areaName:areaName,
        }
      })
    }
  }
  //当前tabs的key
  const statusOnchange=(key)=>{
    // console.log(name,'name');
    dispatch({
      type:'residentialArea/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'residentialArea/statusOnchange',
      payload:{
        pageNo:0,
        status:key,
        name:name,//关键字查询
        areaName:areaName,
      }
    })
  }
  //重置
  const resetField=()=>{
    dispatch({
      type:'residentialArea/initialSuccess',
      payload:{
        loading:true,
      }
    })
    dispatch({type:'residentialArea/resetField',
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
          placeholder='搜索小区名称'/>
      <Button type='primary' onClick={createCell}>创建小区</Button>
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

function mapStateToProps({residentialArea}) {
  return {residentialArea }
}

export default connect(mapStateToProps)(ResidentialArea);
