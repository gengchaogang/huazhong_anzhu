import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Breadcrumb}from 'antd'
import 'antd/dist/antd.css'
import './Main.css'
import Header from '../components/MainLayout/Header'
import NavMenu from '../components/MainLayout/NavMenu'

// const menuKeys=[
//   {
//     title:'首页',
//     icon:'setting',
//     key:'/indexPage'
//   },{
//     title: '内容审核',
//     icon: 'windows-o',
//     key: '/contentCheck',
//     child: [
//       {
//         title: '房源图片审核',
//         key: '/contentCheck/houseImgCheck',
//       },
//       {
//         title: '导师注册',
//         key: '/contentCheck/advisorRegister',
//       },
//       {
//         title: '经纪人上传小区',
//         key: '/contentCheck/brokerUploadCommunity',
//       },
//       {
//         title: '解除关系申请',
//         key: '/contentCheck/removeRelationApplication',
//       },
//       // {
//       //   title: '经纪人实名认证',
//       //   key: '/contentCheck/brokerNameCertificate',
//       // },
//       {
//         title:'意见反馈',
//         key: '/contentCheck/feedback',
//       }, {
//         title:'提现申请',
//         key: '/contentCheck/applicationWithdrawal',
//       }
//     ]
//   },{
//     title: '账号管理',
//     icon: 'setting',
//     key: '/idManagement',
//     child: [
//       {
//         title: '经纪人',
//         key: '/idManagement/brokerIdIndex',
//       }, {
//         title: '导师',
//         key: '/idManagement/advisorIdIndex',
//       }, {
//         title: '交易中心',
//         key: '/idManagement/dealCenterIdIndex',
//       }, {
//         title: '代理商',
//         key: '/idManagement/agentIdIndex',
//       }
//     ]
//   },
//   {
//     title:'账户管理',
//     icon:'setting',
//     key:'/accountManagement',
//     child:[
//       {
//         title:'经纪人',
//         key:'/accountManagement/zhangHuGuanLiBroker'
//       },{
//         title:'导师',
//         key:'/accountManagement/accountTutor'
//       },{
//         title:'交易中心',
//         key:'/accountManagement/accountDealCenter'
//       },{
//         title:'代理商',
//         key:'/accountManagement/zhangHuGuanLiAgent'
//       }
//     ]
//   },
//   {
//     title: '房源管理',
//     icon: 'setting',
//     key: '/resourceManagement',
//     child: [
//        {
//         title: '新房项目',
//         key: '/resourceManagement/newHousePro',
//       }, {
//         title: '二手房出售',
//         key: '/resourceManagement/secondhandHouseSell',
//       }, {
//         title: '二手房出租',
//         key: '/resourceManagement/secondhandHouseRent',
//       }, {
//         title: '商铺出售',
//         key: '/resourceManagement/storeSell',
//       }, {
//         title: '商铺出租',
//         key: '/resourceManagement/storeRent',
//       }, {
//         title: '写字楼出售',
//         key: '/resourceManagement/officeBuildingSell',
//       }, {
//         title: '写字楼出租',
//         key: '/resourceManagement/officeBuildingRent',
//       }, {
//         title: '下架房源',
//         key: '/resourceManagement/soldOutHouse',
//       }
//     ]
//   },{
//     title: '楼盘字典',
//     icon: 'setting',
//     key: '/developmentDictionary',
//     child:[
//       {
//         title: '小区',
//         key: '/developmentDictionary/residentialArea',
//       },{
//         title: '商铺',
//         key: '/developmentDictionary/shopsManagement',
//       },{
//         title: '写字楼',
//         key: '/developmentDictionary/officeBuilding',
//       }
//     ],
//   },{
//     title: '城市管理',
//     icon: 'setting',
//     key: '/cityManagement',
//     child:[
//       {
//         title: '开通城市',
//         key: '/cityManagement/openCity',
//       }
//     ],
//   },{
//     title: '标签管理',
//     icon: 'setting',
//     key: '/labelManagement',
//     child:[
//       {
//         title: '标签配置',
//         key: '/labelManagement/labelConfiguration',
//       }
//     ],
//   },{
//     title: '收益设置',
//     icon: 'setting',
//     key: '/earningSetting',
//     child: [
//       {
//         title: '各方收益配比',
//         key: '/earningSetting/allEarningsMatching',
//       }, {
//         title: '佣金配比方案',
//         key: '/earningSetting/brokerageMatching',
//       }, {
//         title: '交易服务费配比方案',
//         key: '/earningSetting/serviceMatching',
//       }
//     ]
//   },
//   {
//     title: '财务管理',
//     icon: 'setting',
//     key: '/financeManagement',
//     child: [
//       {
//         title: '平台资金',
//         key: '/financeManagement/platformFund',
//       }, {
//         title: '平台收益结算',
//         key: '/financeManagement/platformEarningBalance',
//       }
//     ]
//   },
//   {
//     title: '广告投放',
//     icon: 'setting',
//     key: '/adManagement',
//     child: [
//       {
//         title: '投放管理',
//         key: '/adManagement/putManage',
//       }
//     ]
//   },{
//     title: '培训',
//     icon: 'setting',
//     key: '/train',
//     child: [
//       {
//         title: '培训内容',
//         key: '/train/trainContent',
//       }
//     ]
//   },
//   {
//     title: '消息管理',
//     icon: 'setting',
//     key: '/messageManagement',
//     child: [
//       {
//         title: '系统消息',
//         key: '/messageManagement/systemMessage',
//       },{
//         title: '推送消息',
//         key: '/messageManagement/pushMessage',
//       }
//     ]
//   },
//   {
//     title: '合同协议管理',
//     icon: 'setting',
//     key: '/contractManagement',
//     child: [
//       // {
//       //   title: '交易合同',
//       //   key: '/contractManagement/dealContract',
//       // },{
//       //   title:'经纪人签署',
//       //   key: '/contractManagement/brokerSign',
//       // },{
//       //   title:'导师签署',
//       //   key: '/contractManagement/advisorSign',
//       // },
//       {
//         title:'合同协议模块管理',
//         key: '/contractManagement/contractAgreementModulesManage',
//       }
//     ]
//   },
//   // {
//   //   title:'素材管理',
//   //   icon: 'setting',
//   //   key: '/materialManage',
//   //   child: [
//   //     {
//   //       title: '文章素材',
//   //       key: '/materialManage/articleMaterial',
//   //     }
//   //   ]
//   // },
//   {
//     title: '师徒设置',
//     icon: 'setting',
//     key: '/mentoringSetting',
//     child: [
//       {
//         title: '晋升师傅要求',
//         key: '/mentoringSetting/promoteMaster',
//       },{
//         title:'徒弟出师要求',
//         key: '/mentoringSetting/promotePrentice',
//       }
//     ]
//   },
//   // {
//   //   title: '处罚机制',
//   //   icon: 'setting',
//   //   key: '/punishSetting',
//   //   child: [
//   //     {
//   //       title: '经纪人处罚',
//   //       key: '/punishSetting/brokerPunish',
//   //     },{
//   //       title:'导师处罚',
//   //       key: '/punishSetting/advisorPunish',
//   //     },{
//   //       title:'交易中心处罚',
//   //       key: '/punishSetting/dealCenterPunish',
//   //     }
//   //   ]
//   // },
//   {
//     title: '权限管理',
//     icon: 'setting',
//     key: '/accessManagement',
//     child: [
//      {
//         title: '角色管理',
//         key: '/accessManagement/jolesManagement',
//       }
//     ]
//   },{
//     title: '企业架构',
//     icon: 'setting',
//     key: '/enterpriseFramework',
//     child: [
//       {
//         title: '人员管理',
//         key: '/enterpriseFramework/personnelManage',
//       }
//     ]
//   },{
//     title: '设置',
//     icon: 'setting',
//     key: '/setting',
//     child: [
//       {
//         title: '修改密码',
//         key: '/setting/modifyPassword',
//       }
//     ]
//   },{
//     title: 'Apk版本管理',
//     icon: 'setting',
//     key: '/apkVersion',
//     child: [
//       {
//         title: '版本管理',
//         key: '/apkVersion/apkManagement',
//       }
//     ]
//   }
// ];

const Main = ({ children,routes, params, location, dispatch, main }) => {
  const {
    menuSelectKeys,
    openKeys,
    promptObj,
    userInfo,
    menuKeys,
  }=main;
  console.log(menuKeys,'menuKeys>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  const headerProps={
    notification:{
      content:' ',
      timestamp:' ',
    },
    userInfo,
    logout:()=>{
      dispatch({
        type:'main/logout',
      })
    },
    clickCallBack:(path)=>{
      dispatch(
        routerRedux.push(path)
      );
    }
  }
  return (
    <div className='ant-layout-aside'>
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
            {location.pathname!='/'&&<Breadcrumb routes={routes} params={params} />}
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
