import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Breadcrumb } from 'antd'
import 'antd/dist/antd.css'
import './Main.css'
import Header from '../components/MainLayout/Header'
import NavMenu from '../components/MainLayout/NavMenu'
import PromptModal from '../../commons/View/PromptModal'
import fygl from '../assets/navBarImgs_2/fangyuanguanli.png'
import fyglcz from '../assets/navBarImgs_2/fangwuchuzu.png'
import jjrgl from '../assets/navBarImgs_2/jingjirenguanli.png'
import qygl from '../assets/navBarImgs_2/qiyeguanli.png'
import sjtj from '../assets/navBarImgs_2/shujutongji.png'
import sy from '../assets/navBarImgs/sy.png'
import yjsz from '../assets/navBarImgs_2/yongjinshezhi.png'
import zhgl from '../assets/navBarImgs_2/zhanhuguanli.png'
const menuKeys = [  //导师登陆时显示的左侧导航
  {
    title: '首页',
    icon: sy,
    key: '/'
  },
  {
    title: '公司房源',
    icon: fyglcz,
    key: '/allHouse',
    child: [
      {
        title: '出售',
        key: '/allHouse/allHouseResourceSell',
      },
      {
        title: '出租',
        key: '/allHouse/allHouseResourceRent',
      }
    ]
  },
  {
    title: '房源出售管理',
    icon: fygl,
    key: '/houseResourceSaleManagement',
    child: [
      {
        title: '二手房出售',
        key: '/houseResourceSaleManagement/secondHandHouseSell',
      }, {
        title: '商铺出售',
        key: '/houseResourceSaleManagement/shopsSell',
      }, {
        title: '写字楼出售',
        key: '/houseResourceSaleManagement/officeSell',
      },
    ]
  }, {
    title: '房源出租管理',
    icon: fyglcz,
    key: '/houseResourceRentManagement',
    child: [
      {
        title: '二手房出租',
        key: '/houseResourceRentManagement/secondHandHouseRent',
      }, {
        title: '商铺出租',
        key: '/houseResourceRentManagement/shopsRent',
      }, {
        title: '写字楼出租',
        key: '/houseResourceRentManagement/officeRent',
      }
    ]
  }, {
    title: '经纪人管理',
    icon: jjrgl,
    key: '/agentManagement',
    child: [
      {
        title: '组织架构管理',
        key: '/agentManagement/agentGroups',
      }, {
        title: "人员位置分布",
        key: "/agentManagement/peoplePosition"
      }, {
        title: '经纪人审核',
        key: '/agentManagement/applicationAcceptance',
      }, {
        title: '未激活经纪人',
        key: '/agentManagement/inactiveAgent',
      }
    ]
  }, {
    title: '经纪人门店管理',
    icon: jjrgl,
    key: '/agentmd',
    child: [
      {
        title: '门店管理',
        key: '/agentmd/agentMd',
      }
    ]
  }, {
    title: '数据统计',
    icon: sjtj,
    key: '/dataStatistics',
    child: [
      {
        title: '基础统计',
        key: '/dataStatistics/basicStatistics'
      }
    ]
  }, {
    title: '佣金设置',
    icon: yjsz,
    key: '/commissionSetting',
    child: [
      {
        title: '佣金设置',
        key: '/commissionSetting/commissionInstalled',
      }
    ],
  }, {
    title: '账户管理',
    icon: zhgl,
    key: '/accountManagement',
    child: [
      {
        title: '佣金分配机制',
        key: '/accountManagement/commissionRecord',
      }, {
        title: "银行卡管理",
        key: "/accountManagement/bankCardManagement"
      }
    ],
  }, {
    title: '企业管理',
    icon: qygl,
    key: '/businessManagement',
    child: [
      {
        title: '企业信息',
        key: '/businessManagement/businessInfos',
      }
    ],
  },
  {
    title: '客户管理',
    icon: jjrgl,
    key: '/customerManage',
    child: [
      {
        title: '客户列表',
        key: '/customerManage',
      }
    ]
  },
];
const businessKeys = [  //导师登陆时状态为审核失败显示的左侧导航
  {
    title: '首页',
    icon: sy,
    key: '/'
  },
  {
    title: '公司房源',
    icon: fyglcz,
    key: '/allHouse',
    child: [
      {
        title: '出售',
        key: '/allHouse/allHouseResourceSell',
      },
      {
        title: '出租',
        key: '/allHouse/allHouseResourceRent',
      }
    ]
  },
  {
    title: '企业管理',
    icon: qygl,
    key: '/businessManagement',
    child: [
      {
        title: '企业信息',
        key: '/businessManagement/businessInfos',
      }
    ],
  }
];
const menuKeys_borker = [ //经纪人登陆显示的左侧导航
  {
    title: '首页',
    icon: sy,
    key: '/'
  },
  {
    title: '公司房源',
    icon: fyglcz,
    key: '/allHouse',
    child: [
      {
        title: '出售',
        key: '/allHouse/allHouseResourceSell',
      },
      {
        title: '出租',
        key: '/allHouse/allHouseResourceRent',
      }
    ]
  },
  {
    title: '房源出售管理',
    icon: fygl,
    key: '/houseResourceSaleManagement',
    child: [
      {
        title: '二手房出售',
        key: '/houseResourceSaleManagement/secondHandHouseSell',
      }, {
        title: '商铺出售',
        key: '/houseResourceSaleManagement/shopsSell',
      }, {
        title: '写字楼出售',
        key: '/houseResourceSaleManagement/officeSell',
      },
    ]
  }, {
    title: '房源出租管理',
    icon: fygl,
    key: '/houseResourceRentManagement',
    child: [
      {
        title: '二手房出租',
        key: '/houseResourceRentManagement/secondHandHouseRent',
      }, {
        title: '商铺出租',
        key: '/houseResourceRentManagement/shopsRent',
      }, {
        title: '写字楼出租',
        key: '/houseResourceRentManagement/officeRent',
      }
    ]
  }, {
    title: '客户管理',
    icon: jjrgl,
    key: '/customerManage',
    child: [
      {
        title: '客户管理',
        key: '/customerManage/customerManage',
      }
    ]
  },
];

const Main = ({ children, routes, params, location, dispatch, main }) => {
  const {
    menuSelectKeys,
    openKeys,
    promptObj,
    userInfo,
    userInfoStatus,
    remindMsg,
    noReadCount,
    isBroker,
  } = main;
  const headerProps = {
    notification: {
      content: remindMsg.title,
      timestamp: remindMsg.timestamp,
    },
    userInfo,
    logout: () => {
      dispatch({
        type: 'main/logout',
      })
    },
    msgNumber: noReadCount,
    msgInfo: () => dispatch(routerRedux.push('/remindMsgManagement')),
    setting: () => dispatch(routerRedux.push('/accountSetting')),
    toIndex: () => dispatch(routerRedux.push('/indexPage')),
    clickCallBack: (path) => {
      dispatch(
        routerRedux.push(path)
      );
    }
  }
  return (
    <div>
      <PromptModal {...promptObj} onOk={() => dispatch({ type: 'main/closePrompt' })} onCancel={() => dispatch({ type: 'main/closePrompt' })} />
      {
        userInfoStatus === "审核失败" ?
          <div className='ant-layout-aside'>
            <NavMenu menus={businessKeys}
              onSelectCallBack={
                (keys) => dispatch({
                  type: 'main/menuSelect',
                  payload: keys,
                })}
              selectKeys={menuSelectKeys} openKeys={openKeys} openChange={(keys) => dispatch({
                type: 'main/menuOpen',
                payload: keys,
              })} />
            <div className='ant-layout-main'>
              <Header {...headerProps} />
              {location.pathname != '/' && <Breadcrumb routes={routes} params={params} />}
              <div className='ant-layout-container'>
                <div className='ant-layout-content' id='anzhu_web'>
                  {children}
                </div>
              </div>
            </div>
          </div>
          :
          <div>
            {
              isBroker !== null ?
                <div className='ant-layout-aside'>
                  {
                    !!isBroker ?
                      <NavMenu menus={menuKeys_borker}
                        onSelectCallBack={
                          (keys) => dispatch({
                            type: 'main/menuSelect',
                            payload: keys,
                          })}
                        selectKeys={menuSelectKeys} openKeys={openKeys}
                        openChange={(keys) => dispatch({
                          type: 'main/menuOpen',
                          payload: keys,
                        })} />
                      :
                      <NavMenu menus={menuKeys}
                        onSelectCallBack={
                          (keys) => dispatch({
                            type: 'main/menuSelect',
                            payload: keys,
                          })}
                        selectKeys={menuSelectKeys} openKeys={openKeys}
                        openChange={(keys) => dispatch({
                          type: 'main/menuOpen',
                          payload: keys,
                        })} />
                  }
                  <div className='ant-layout-main'>
                    <Header {...headerProps} />
                    {location.pathname != '/' && <Breadcrumb routes={routes} params={params} />}
                    <div className='ant-layout-container'>
                      <div className='ant-layout-content' id='anzhu_web'>
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
                :
                <div style={{ background: "#ebf0f1" }}></div>
            }
          </div>
      }
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
