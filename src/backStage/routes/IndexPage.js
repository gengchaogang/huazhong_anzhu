import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import IndexEntrance from '../components/indexPage/IndexEntrance'
import { routerRedux } from 'dva/router'
import houseIcon from '../assets/images/house.svg'

import  './IndexPage.css'

function IndexPage({dispatch,indexPage}) {
  const {entranceData}=indexPage;
  // console.log(entranceData,'entranceDataentranceData>>>>>>>>>>>');
  const indexEntranceProps={
    loading:false,
    // entranceData:[
    //   {
    //     title:'房源图片',
    //     path:'/contentCheck/houseImgCheck',
    //     pic:houseIcon,
    //     // number:32,
    //     bgcolor:'#67C5C2',
    //     className:'test',
    //   },
    //   // {
    //   //   title:'房源举报审核',
    //   //   path:'/12',
    //   //   pic:houseIcon,
    //   //   // number:32,
    //   //   bgcolor:'#FFD167',
    //   //   className:'test',
    //   // },
    //   // {
    //   //   title:'房源线下成交',
    //   //   path:'13',
    //   //   pic:houseIcon,
    //   //   // number:32,
    //   //   bgcolor:'#FE9A66',
    //   //   className:'test',
    //   // },
    //   {
    //     title:'注册审核',
    //     path:'/contentCheck/advisorRegister',
    //     pic:houseIcon,
    //     // number:32,
    //     bgcolor:'#67C5C2',
    //     className:'test',
    //   },{
    //     title:'完善小区',
    //     path:'/contentCheck/brokerUploadCommunity',
    //     pic:houseIcon,
    //     // number:32,
    //     bgcolor:'#3584C8',
    //     className:'test',
    //   },{
    //     title:'意见反馈',
    //     path:'/contentCheck/feedback',
    //     pic:houseIcon,
    //     // number:32,
    //     bgcolor:'#48F5BA',
    //     className:'test',
    //   },{
    //     title:'财务结算',
    //     path:'/financeManagement/platformEarningBalance',
    //     pic:houseIcon,
    //     // number:32,
    //     bgcolor:'#44C297',
    //     className:'test',
    //   }
    // ],
    entranceData:entranceData,
    bageClick:(path)=>{
      dispatch(routerRedux.push({
        pathname: `${path}`,
      }));
    }
  }
  return (
    <div className='indexPage'>
      <div className='bageOutSide'>
      {entranceData.length==0?<div className='text'>当前员工无快捷权限入口</div>:
      <IndexEntrance {...indexEntranceProps}/>}
      </div>
    </div>
  );
}

function mapStateToProps({indexPage}) {
  return {indexPage }
}

export default connect(mapStateToProps)(IndexPage)
