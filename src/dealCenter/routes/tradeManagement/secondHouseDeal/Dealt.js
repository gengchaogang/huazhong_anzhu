import React from 'react'
import {
  Table,
  Timeline
} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import ApplyDeal from '../../../components/Modals/ApplyDeal'
import TextWithIconLeft from '../../../../commons/UI/TextWithIconLeft'
import img from '../../../../commons/assets/yay.jpg'

function Dealt({secondDeal,dispatch}){
  const {showDealProgress,currentRow}=secondDeal;
  const toggleShowDealProgress=(show,record)=>{

    console.log({record});
    dispatch({
      type:'secondDeal/setState',
      payload:{
        showDealProgress:show,
        currentRow:record
      }
    })
  };
  const dataSource=[
    {
      key:'1',
      ssjjr:'黄月',
      ssxq:'远洋山水',
      wylx:'写字楼',
      fyxx:'A区/1号楼/1单元/2003室',
      kh:'林峰',
      cjfs:'合作成交',
      bcjsj:'2016-201-24 19:00',
      ywbl:'张三',
      ywzt:'佣金已分配',
      ywblsj:'2016-10-24 19:00',
      cz:'sdf',
    },
    {
      key:'2',
      ssjjr:'黄月',
      ssxq:'爱空间的',
      wylx:'商铺',
      fyxx:'A区/1号楼/1单元/2003室',
      kh:'林峰',
      cjfs:'合作成交',
      bcjsj:'2016-201-24 19:00',
      ywbl:'张三',
      ywzt:'等待分配佣金',
      ywblsj:'2016-10-24 19:00',
      cz:'sdf'
    },
    {
      key:'3',
      ssjjr:'黄月',
      ssxq:'山水鸳鸯',
      wylx:'普通住宅',
      fyxx:'A区/1号楼/1单元/2003室',
      kh:'林峰',
      cjfs:'合作成交',
      bcjsj:'2016-201-24 19:00',
      ywbl:'张三',
      ywzt:'等待分配佣金',
      ywblsj:'2016-10-25 19:00',
      cz:'sdf'
    }
  ];
  let current=1;
  let total=dataSource.length*100;
  let pageSize=10;

  const columns=[
    {
      key:'index',
      title:'序号',
      render:(text,record,index)=>{
        if(current<1){
          return index+1;
        }
        else{
          return (pageSize*(current-1)+index+1);
        }
      }
    },
    {
      title:'所属经纪人',
      dataIndex:'ssjjr',
      key:'ssjjr',
    },
    {
      title:'所属小区',
      dataIndex:'ssxq',
      key:'ssxq',
    },
    {
      title:'物业类型',
      dataIndex:'wylx',
      key:'wylx',
      filters: [
        { text: '普通住宅', value: 'ptzz' },
        { text: '商铺', value: 'sp' },
        { text: '写字楼', value: 'xzl' },
      ],
      onFilter:(value,record)=>{

      },
      sorter:(record1,record2)=>{


      }
    },
    {
      title:'房源信息',
      dataIndex:'fyxx',
      key:'fyxx',
      render:(text,record,index)=>{
        return (
          <a onClick={()=>{
            dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HouseResourceInfo'))
          }}>{text}</a>
        );
      }
    },
    {
      title:'客户',
      dataIndex:'kh',
      key:'kh'
    },
    {
      title:'成交方式',
      dataIndex:'cjfs',
      key:'cjfs',
      filters: [
        { text: '合作成交', value: 'hzcj' },
        { text: '自有客户', value: 'zykh' },
      ],
      sorter:true
    },
    {
      title:'报成交时间',
      dataIndex:'bcjsj',
      key:'bcjsj',
      sorter:true
    },
    {
      title:'业务办理',
      dataIndex:'ywbl',
      key:'ywbl'
    },
    {
      title:"业务状态",
      render:(text,record,index)=>{
        return (
          <div>
            <p>已成交</p>
            <a onClick={()=>{
              dispatch({
                type:'secondDeal/setState',
                payload:{
                  ApplyDealVisible:true,
                  ApplyDeal_status:text
                }
              })
            }}>{text}</a>
          </div>
        )
      },
      dataIndex:'ywzt',
      key:'ywzt',
      filters: [
        { text: '等待佣金分配', value: 'ddyjfp' },
        { text: '佣金已分配', value: 'yjyfp' },
      ],
      sorter:true,
      onCellClick:(record,e)=>toggleShowDealProgress(true,record)
    },
    {
      title:'业务办理时间',
      dataIndex:'ywblsj',
      key:'ywblsj',
      sorter:true
    },
    {
      title:'操作',
      key:'cz',
      render:(text,record,index)=>{
        return (
          <a onClick={()=>dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HandSellDetails'))}>详情</a>
        )
      }
    }
  ];
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.key}
        rowClassName={()=>"anzhu_tbody_tr"}
        pagination={{
          current,
          total,
          pageSize
        }}

      />
      <a onClick={()=>{
        dispatch({
          type:'secondDeal/asyncSetState',
          payload:{
            columns:'id'
          }
        })
      }}>test</a>
      <ApplyDeal/>
    </div>
  )
}

function mapStateToProps({secondDeal}){
  return {secondDeal}
}

export default connect(mapStateToProps)(Dealt);
