import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Breadcrumb}from 'antd'
import 'antd/dist/antd.css'
import './Main.css'
import Header from '../components/MainLayout/Header'
import NavMenu from '../components/MainLayout/NavMenu'
import PromptModal from '../../commons/View/PromptModal'
import ModifyPassword from '../../commons/components/ModifyPassword'
//菜单配置

// const menuKeys=[
//   {
//     title:'首页',
//     icon:'menu_icon_sy',
//     key:'/indexPage',
//   },{
//     title:'交易管理',
//     icon:'menu_icon_jygl',
//     key:'/tradeManagement',
//     child:[
//       {
//         title:'新房交易',
//         key:'/tradeManagement/newHouseTrade'
//       },{
//         title:'二手房出售交易',
//         key:'/tradeManagement/secondHouseSellTrade'
//       },{
//         title:'二手房出租交易',
//         key:'/tradeManagement/secondHouseRentTrade'
//       }
//     ]
//   },{
//     title: '新房电商',
//     icon: 'menu_icon_sfds',
//     key: '/newHouseOnline',
//     child: [
//       {
//         title: '项目管理',
//         key: '/newHouseOnline/projectManagement',
//       }
//     ]
//   },{
//     title: '合同审核',
//     icon: 'menu_icon_htsh',
//     key: '/contractReview',
//     child: [
//       {
//         title: '新房项目审核',
//         key: '/contractReview/newHouseContractReview',
//       },{
//         title: '新房交易合同审核',
//         key: '/contractReview/newhousetransactionContractReview',
//       },{
//         title: '二手房出售合同审核',
//         key: '/contractReview/secondHandHouseSalesAudit',
//       },{
//         title: '二手房出租合同审核',
//         key: '/contractReview/secondHandHouseRentalAudit',
//       }
//     ]
//   },{
//     title: '财务管理',
//     icon:'menu_icon_cwgl',
//     key: '/financialManagement',
//     child: [
//       {
//         title: '电商交易审核',
//         key: '/financialManagement/newHouseElectricityExamination',
//       }, {
//         title: '二手房出售审核',
//         key: '/financialManagement/secondHouseSellExamine',
//       }, {
//         title: '二手房出租审核',
//         key: '/financialManagement/secondHouseLeaseExamine',
//       }, {
//         title: '新房交易收支管理',
//         key: '/financialManagement/newHouseRevenueManagement',
//       }, {
//         title: '二手房交易收支管理',
//         key: '/financialManagement/secondHouseRevenueManagement',
//       }, {
//         title: '服务费收益管理',
//         key: '/financialManagement/ServiceFeeRevenueManagement',
//       }
//     ]
//   },{
//     title: '贷款管理',
//     icon: 'menu_icon_dkgl',
//     key: '/loanManagement',
//     child: [
//       {
//         title: '二手房解押贷款办理',
//         key: '/loanManagement/secondHandHouseSolution',
//       }, {
//         title: '二手房贷款办理',
//         key: '/loanManagement/secondHandHouseMortgageDeal',
//       }, {
//         title: '二手房出租分期办理',
//         key: '/loanManagement/secondHandHouseRentalLoans',
//       }
//     ]
//   },{
//     title: '过户管理',
//     icon: 'menu_icon_ghgl',
//     key: '/transferManagement',
//     child:[
//       {
//         title: '二手房过户办理',
//         key: '/transferManagement/secondHandHouseTransfer',
//       }
//     ]
//   },{
//     title: '数据分析',
//     icon: 'menu_icon_sjfx',
//     key: '/dataAnalysis',
//     child: [
//       {
//         title: '交易统计',
//         key: '/dataAnalysis/tradeStatistics',
//       },{
//         title: '团队统计',
//         key: '/dataAnalysis/teamStatistics',
//       },{
//         title: '交易服务费统计',
//         key: '/dataAnalysis/commissionStatistics',
//       }
//     ]
//   },{
//     title: '企业管理',
//     icon: 'menu_icon_qygl',
//     key: '/businessManagement',
//     child: [
//       {
//         title: '企业信息管理',
//         key: '/businessManagement/businessInformationManagement',
//       }, {
//         title: '组织架构管理',
//         key: '/businessManagement/organizeStructureManagement',
//       }, {
//         title: '角色管理',
//         key: '/businessManagement/roleManagement',
//       }
//     ]
//   },{
//     title: '操作日志',
//     icon: 'menu_icon_czrz',
//     key: '/operationLog',
//   },{
//     title: '合同模版',
//     icon: 'menu_icon_htmb',
//     key: '/contractTemplate',
//   },
//   // {
//   //   title: '使用帮助',
//   //   icon: 'menu_icon_ins',
//   //   key: '/instructions',
//   // },
// ];

const Main = ({ children,routes, params, location, dispatch, main }) => {
  const {
    menuSelectKeys,
    openKeys,
    promptObj,
    userInfo,
    loginPsdModal,
    remindMsg,
    noReadCount,
    menuKeys,
  }=main;
  const headerProps={
    notification:{
      content:remindMsg.title,
      timestamp:remindMsg.timestamp,
    },
    doAccountManagement:()=>dispatch(routerRedux.push('/accountManagement')),
    userInfo,
    msgNumber:noReadCount,
    msgInfo:()=>dispatch(routerRedux.push('/information')),
    logout:()=>{
      dispatch({
        type:'main/logout',
      })
    },
    clickCallBack:(path)=>{
      dispatch(
        routerRedux.push(path)
      );
    },
    indexClick:()=>{
      dispatch(
        routerRedux.push('/indexPage')
      );
    },
  }
  const modifyPasswordProps={
    ...loginPsdModal,
    title:'首次登录需更改登录密码',
    okCallBack:(data)=>dispatch({
      type:'main/doChangeLoginPsw',
      payload:data,
    }),
    onCancelCallBack:()=>dispatch({
      type:'main/closeInitPsdModal',
    }),
  }
  return (
    <div className='ant-layout-aside'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'main/closePrompt'})} onCancel={()=>dispatch({type:'main/closePrompt'})}/>
      <ModifyPassword {...modifyPasswordProps}/>
      <NavMenu menus={menuKeys} onSelectCallBack={(keys)=>dispatch({
          type:'main/menuSelect',
          payload:keys,
        })} selectKeys={menuSelectKeys} openKeys={openKeys} openChange={(keys)=>dispatch({
          type:'main/menuOpen',
          payload:keys,
        })}/>
      <div className='ant-layout-main'>
        <Header {...headerProps}/>
        <div className='ant-layout-container'>
          <div className='ant-layout-content' id='anzhu_web'>
            {(location.pathname!=='/' && location.pathname!=='/indexPage')&&<Breadcrumb routes={routes} params={params} separator=">" />}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  main: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  children: PropTypes.element.isRequired,
}

function mapStateToProps({ main }) {
  return { main }
}

export default connect(mapStateToProps)(Main)
