import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button ,Checkbox,Upload, Icon, message,Modal  } from 'antd';
import SearchInput from '../../../../commons/View/SearchInput'
import DxPanel from '../../../../commons/components/DxPanel'
import './PositionMap.css'

function PositionMap({dispatch ,positionMap}) {

  const searchInputProps={
    type:'button',
    placeholder:'支持楼盘名称、地址、坐标查询',
    searchFuc:(value)=>{console.log('搜索value',value)},
  }
  return (
    <div>
      <DxPanel title='选择定位'>
        <SearchInput {...searchInputProps}/>
        <Checkbox>坐标查询</Checkbox>
        <div>提示：</div>
        <div>1)使用坐标查询时需要先勾选“坐标查询”,然后输入一个正确的坐标(比如：116.307629,40.058359)，点击查询</div>
        <div>2)使用楼盘名称或详细地址查询时需要取消勾选“坐标查询”</div>
        <div className='bigMapShow'></div>
        <div>坐标：116.315443,39.987648</div>
        <Button type='primary'>确定</Button>
        <Button type='ghost' onClick={()=>{dispatch(routerRedux.goBack())}}>取消</Button>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({positionMap}) {
  return {positionMap }
}

export default connect(mapStateToProps)(PositionMap);
