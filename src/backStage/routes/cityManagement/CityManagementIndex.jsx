import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Input,Select,Form} from 'antd';
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../commons/View/SearchInput'
import SearchBox from '../../components/cityManagement/SearchBox'
import OpenedTable from '../../components/cityManagement/OpenedTable'
import UnOpenTable from '../../components/cityManagement/UnOpenTable'
import ClosedTable from '../../components/cityManagement/ClosedTable'
import DxPanel from '../../../commons/components/DxPanel'
import AddTargetCity from '../../components/cityManagement/AddTargetCity';
import CloseCityModal from '../../components/cityManagement/CloseCityModal';
import './divisionManagement.css'


import './CityManagementIndex.css'

function CityManagementIndex({location, dispatch, cityManagement}) {
  const {activeKey, tableOpen,tableAdded,tableClose,close,open,prepare}=cityManagement;
  const tabsCallBack=(key)=>{
    console.log(key,'key');
    dispatch({
      type:'cityManagement/setState',
      payload:{
        activeKey:key,
      }
    });
    //发起异步请求
    dispatch({
      type:'cityManagement/query',
      payload:{
        state:key,
      }
    })
  };
  const openModal=()=>{
    dispatch({
      type:'cityManagement/getOutCity',
      payload:{
				addCityModalState:{
					visible:true,
				},
      }
    })
  };
  const testClick=(argu)=>{
    switch (argu){
      case '添加城市':
        dispatch({
          type:'cityManagement/addCity',
          payload:{
            code:'510100',//成都市编码
            name:'成都市',
            province:'四川省',
            py:'c',
          }
        });
        break;
      case '添加区划':
        dispatch({
					type:'cityManagement/addZone',
					payload:{
					  cityId:5,
						countyZoneCode:'330205',
						countyZoneName:'江北区',
						countyZonePy:'jbq',
            name:'观音桥',
            py:'gyq'
					}
        });
        break;
      case '查询开通城市':
        dispatch({
          type:'cityManagement/query',
          payload:{
            state:'开通',//开通/added/close
          }
        });
        break;
      case '查询准备中城市':
        dispatch({
          type:'cityManagement/query',
          payload:{
            state:'准备中',//开通/added/close
          }
        });
        break;
      case '查询关闭城市':
        dispatch({
          type:'cityManagement/query',
          payload:{
            state:'关闭',//开通/added/close
          }
        });
        break;
      case '关闭城市':
        dispatch({
          type:'cityManagement/closeCity',
          payload:{
            code:'510100',
            reason:'我是关闭原因...'
          }
        });
        break;
      case '开通城市':
        dispatch({
          type:'cityManagement/openCity',
          payload:{
            code:'510100',
          }
        });
        break;
      default:
        break;
    }
  };
  const submit=(keyword)=>{
    console.log(activeKey,'activeKey');
    dispatch({
      type:'cityManagement/query',
      payload:{
        state:activeKey,
        keyword:keyword,
      }
    })
  };
  const reset=()=>{
    dispatch({
      type:'cityManagement/query',
      payload:{
        state:activeKey,
      }
    })
  };
  return (
      <DxPanel title='城市管理'>
        <div className='cityManagement'>
          {/*<div className='cityManagement-searchBox'>
            <SearchInput type='button' placeholder='请输入城市名称，支持首字母搜索' searchFuc={searchCityCallBack}/>
          </div>*/}
          <SearchBox submit={submit} reset={reset}/>
          <div className='cityManagement-mainBox'>
            <Button className='anzhu_button' onClick={openModal}>添加目标城市</Button>
            <Tabs
              defaultActiveKey="开通"
              onChange={tabsCallBack}
              type='card'
            >
              <TabPane tab={'已开通('+open+')'} key='开通'>
                <OpenedTable/>
              </TabPane>
              <TabPane tab={'准备中('+prepare+')'} key='准备中'>
                <UnOpenTable/>
              </TabPane>
              <TabPane tab={'已关闭('+close+')'} key='关闭'>
                <ClosedTable/>
              </TabPane>
            </Tabs>
          </div>
        </div>
        {/*以下为添加目标城市模态框*/}
        <AddTargetCity/>
        {/*以下为关闭城市模态框*/}
        <CloseCityModal/>
      </DxPanel>
  );
}

CityManagementIndex.propTypes = {

}

function mapStateToProps({ cityManagement }) {
  return { cityManagement }
}

export default connect(mapStateToProps)(CityManagementIndex)
