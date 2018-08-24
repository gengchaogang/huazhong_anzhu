import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table, Cascader,Select } from 'antd';
import SearchInput from '../../../../commons/View/SearchInput'

function CommunityManagement({dispatch }) {
  const Option = Select.Option;
  const searchInputProps={
    type:'button',
    placeholder:'请在此输入项目名称或所在区域名称进行搜索',
    searchFuc:(value)=>{console.log('搜索value',value)},
  }
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
  const options = [
    {
      value:'全部',
      label:'全部',
    },
    {
      value: '北京',
      label: '北京',
      children: [
        {
          value: '海淀区',
          label: '海淀区',
        },
        {
          value: '朝阳区',
          label: '朝阳区',
        },
        {
          value: '昌平区',
          label: '昌平区',
        }
      ],
    },
    {
      value: '成都市',
      label: '成都市',
      children: [
        {
          value: '锦江区',
          label: '锦江区',
        },
        {
          value: '武侯区',
          label: '武侯区',
        },
        {
          value: '金牛区',
          label: '金牛区',
        },
      ],
    },
    {
      value: '上海市',
      label: '上海市',
      children: [
        {
          value: '浦东新区',
          label: '浦东新区',
        },{
          value: '宝安区',
          label: '宝安区',
        }
      ],
    },
    {
      value: '广州市',
      label: '广州市',
      children: [
        {
          value: '番禹区',
          label: '番禹区',
        },
        {
          value: '海珠区',
          label: '海珠区',
        }
      ],
    },
  ];
  const communityTable=[
    {
      title: '序号',
      dataIndex: 'number',
      key:'number',
    },
    {
      title: '地区',
      dataIndex: 'region',
      key:'region',
    },
    {
      title: '小区名称',
      dataIndex: 'cellName',
      key:'cellName',
    },
    {
      title: '楼栋',
      dataIndex: 'ban',
      key:'ban',
    },
    {
      title: '总户数',
      dataIndex: 'totalHouseholds',
      key:'totalHouseholds',
    },
    {
      title: '在售',
      dataIndex: 'saleing',
      key:'saleing',
    },
    {
      title: '在租',
      dataIndex: 'renting',
      key:'renting',
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      key:'releaseTime',
    },
    {
      title: '均价',
      dataIndex: 'averagePrice',
      key:'averagePrice',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
    },
  ]
  const communityTableData=[
    {
      key:'1',
      number:'1',
      region:'北京市-海淀区',
      cellName:'远洋山水',
      ban:'4',
      totalHouseholds:'400',
      saleing:'30套',
      renting:'30套',
      releaseTime:'2016-09-07 10:08:53',
      averagePrice:'12000',
      operation:'楼栋管理 相册管理  编辑  下架',
    },
    {
      key:'2',
      number:'2',
      region:'河北省-石家庄-桥东区',
      cellName:'丽景春天',
      ban:'4',
      totalHouseholds:'400',
      saleing:'30套',
      renting:'30套',
      releaseTime:'2016-09-07 10:08:53',
      averagePrice:'3500',
      operation:'楼栋管理 相册管理  编辑  下架',
    },
  ]
  return (
    <div>
      <div>
        <span>关键字：</span>
        <div className='searchInput'>
          <SearchInput {...searchInputProps}/>
        </div>
      </div>
      <div>
        <span> 城 市：</span>
        <Cascader options={options} placeholder="Please select" />
      </div>
      <div>
        <span>状 态：</span>
        <Select defaultValue="在售" style={{ width: 159 }}>
          <Option value="在售">在售</Option>
          <Option value="已售">已售</Option>
          <Option value="下架">下架</Option>
        </Select>
      </div>
      <div>
        <Button>创建小区</Button>
        <Button>批量操作</Button>
      </div>
      <Table dataSource={communityTableData} columns={communityTable}/>
    </div>
  );
}

function mapStateToProps({ communityManagement }) {
  return { communityManagement }
}

export default connect(mapStateToProps)(CommunityManagement);
