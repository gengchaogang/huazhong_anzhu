import React from 'react'
import { Router, Route, IndexRoute, Redirect } from 'dva/router'
import IndexPage from './routes/IndexPage'
import Main from './routes/Main'

import Test from './routes/Test'
import IndexPageX from './routes/IndexPageX'//重建首页
import AccountSetting from './routes/AccountSetting'//修改密码
//站内信
import RemindMsgManagement from './routes/remindMsgManagement/RemindMsgManagement'
import RemindMsgInfo from './routes/remindMsgManagement/RemindMsgInfo'

//房源管理页面
//公司全部房源
import allHouseResourceSell from './routes/allHouse/allHouseResourceSell'
import allHouseResourceDetail from './routes/allHouse/allHouseResourceDetail'
//二手房出售
import SecondHandHouseSell from './routes/houseResourceManagement/secondHandHouseSell/SecondHandHouseSell'
import CreateSecondHandSellResource from './routes/houseResourceManagement/secondHandHouseSell/CreateSecondHandSellResource'
import HouseResourceInfos from './routes/houseResourceManagement/secondHandHouseSell/HouseResourceInfos'
import HouseImgs from './routes/houseResourceManagement/secondHandHouseSell/HouseImgs'
import OwnerInfos from './routes/houseResourceManagement/secondHandHouseSell/OwnerInfos'
import AssignAgent from './routes/houseResourceManagement/secondHandHouseSell/AssignAgent'


import MyNew from './routes/agentMd/agentMdFile/MyNew'
import addMd from './routes/agentMd/agentMdFile/addMd'

//二手房出售详情

//新房项目二手房已售详情
import SecHandSelledNavBar from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingNavBar'
import SecHandSelledDetails from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingDetails'
import SecHandSelledVideoAndImgs from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingVideoAndImgs'
import SecHandSelledAgentBroker from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingAgentBroker'
import SecHandSelledRecord from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingRecord'
import SecHandSelledDeal from './routes/houseResourceManagement/secondHandHouseSell/details/SecHandSellingDeal'

//二手房出租
import SecondHandHouseRent from './routes/houseResourceManagement/secondHandHouseRent/SecondHandHouseRent'
import CreateSecondHandRentResource from './routes/houseResourceManagement/secondHandHouseRent/CreateSecondHandRentResource'
import HouseResourceInfosRent from './routes/houseResourceManagement/secondHandHouseRent/HouseResourceInfosRent'
import HouseImgsRent from './routes/houseResourceManagement/secondHandHouseRent/HouseImgsRent'
import OwnerInfosRent from './routes/houseResourceManagement/secondHandHouseRent/OwnerInfosRent'
import AssignAgentRent from './routes/houseResourceManagement/secondHandHouseRent/AssignAgentRent'

//二手房出租已租详情
import SecHandRentingNavBar from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingNavBar'
import SecHandRentingDetails from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingDetails'
import SecHandRentingVideoAndImgs from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingVideoAndImgs'
import SecHandRentingAgentBroker from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingAgentBroker'
import SecHandRentingRecord from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingRecord'
import SecHandRentingDeal from './routes/houseResourceManagement/secondHandHouseRent/details/SecHandRentingDeal'

//商铺出售
import ShopsSell from './routes/houseResourceManagement/shopsSell/ShopsSell'
import CreateShopsSellResource from './routes/houseResourceManagement/shopsSell/CreateShopsSellResource'
import ShopsResourceInfos from './routes/houseResourceManagement/shopsSell/ShopsResourceInfos'
import ShopsImgs from './routes/houseResourceManagement/shopsSell/ShopsImgs'
import ShopsOwnerInfos from './routes/houseResourceManagement/shopsSell/ShopsOwnerInfos'
import AssignAgentShopsSell from './routes/houseResourceManagement/shopsSell/AssignAgentShopsSell'

//商铺出售详情
import StoreSellingAgentBroker from './routes/houseResourceManagement/shopsSell/details/StoreSellingAgentBroker'
import StoreSellingDeal from './routes/houseResourceManagement/shopsSell/details/StoreSellingDeal'
import StoreSellingDetails from './routes/houseResourceManagement/shopsSell/details/StoreSellingDetails'
import StoreSellingRecord from './routes/houseResourceManagement/shopsSell/details/StoreSellingRecord'
import StoreSellingVideoAndImgs from './routes/houseResourceManagement/shopsSell/details/StoreSellingVideoAndImgs'
import StoreSellingNavBar from './routes/houseResourceManagement/shopsSell/details/StoreSellingNavBar'
//商铺出租
import ShopsRent from './routes/houseResourceManagement/shopsRent/ShopsRent'
import CreateShopsRentResource from './routes/houseResourceManagement/shopsRent/CreateShopsRentResource'
import ShopsResourceInfosRent from './routes/houseResourceManagement/shopsRent/ShopsResourceInfosRent'
import ShopsImgsRent from './routes/houseResourceManagement/shopsRent/ShopsImgsRent'
import ShopsOwnerInfosRent from './routes/houseResourceManagement/shopsRent/ShopsOwnerInfosRent'
import AssignAgentShopsRent from './routes/houseResourceManagement/shopsRent/AssignAgentShopsRent'

//商铺出租详情
import StoreRentingAgentBroker from './routes/houseResourceManagement/shopsRent/details/StoreRentingAgentBroker'
import StoreRentingDeal from './routes/houseResourceManagement/shopsRent/details/StoreRentingDeal'
import StoreRentingDetails from './routes/houseResourceManagement/shopsRent/details/StoreRentingDetails'
import StoreRentingRecord from './routes/houseResourceManagement/shopsRent/details/StoreRentingRecord'
import StoreRentingVideoAndImgs from './routes/houseResourceManagement/shopsRent/details/StoreRentingVideoAndImgs'
import StoreRentingNavBar from './routes/houseResourceManagement/shopsRent/details/StoreRentingNavBar'
//写字楼出售
import OfficeSell from './routes/houseResourceManagement/officeSell/OfficeSell'
import CreateOfficeSellResource from './routes/houseResourceManagement/officeSell/CreateOfficeSellResource'
import OfficeResourceInfos from './routes/houseResourceManagement/officeSell/OfficeResourceInfos'
import OfficeImgs from './routes/houseResourceManagement/officeSell/OfficeImgs'
import OfficeOwnerInfos from './routes/houseResourceManagement/officeSell/OfficeOwnerInfos'
import AssignAgentOfficeSell from './routes/houseResourceManagement/officeSell/AssignAgentOfficeSell'
//写字楼出售详情
import OfficeSellingNavBar from './routes/houseResourceManagement/officeSell/details/OfficeSellingNavBar'
import OfficeSellingDetails from './routes/houseResourceManagement/officeSell/details/OfficeSellingDetails'
import OfficeSellingVideoAndImgs from './routes/houseResourceManagement/officeSell/details/OfficeSellingVideoAndImgs'
import OfficeSellingAgentBroker from './routes/houseResourceManagement/officeSell/details/OfficeSellingAgentBroker'
import OfficeSellingRecord from './routes/houseResourceManagement/officeSell/details/OfficeSellingRecord'
import OfficeSellingDeal from './routes/houseResourceManagement/officeSell/details/OfficeSellingDeal'
//写字楼出租详情
import OfficeRentDetail from './routes/houseResourceManagement/officeRent/details/OfficeRentDetail'
//商铺出租
import OfficeRent from './routes/houseResourceManagement/officeRent/OfficeRent'
import CreateOfficeRentResource from './routes/houseResourceManagement/officeRent/CreateOfficeRentResource'
import OfficeResourceInfosRent from './routes/houseResourceManagement/officeRent/OfficeResourceInfosRent'
import OfficeImgsRent from './routes/houseResourceManagement/officeRent/OfficeImgsRent'
import OfficeOwnerInfosRent from './routes/houseResourceManagement/officeRent/OfficeOwnerInfosRent'
import AssignAgentOfficeRent from './routes/houseResourceManagement/officeRent/AssignAgentOfficeRent'

import DirectAssignAgent from './components/houseResourceManagement/DirectAssignAgent'

//经纪人管理
import AgentGroups from './routes/agentManagement/agentGroups/AgentGroups'
import DetaileInfors from './routes/agentManagement/agentGroups/DetaileInfors'
import ApplicationAcceptance from './routes/agentManagement/ApplicationAcceptance'
import InactiveAgent from './routes/agentManagement/InactiveAgent'
import PeoplePosition from './routes/agentManagement/PeoplePosition'
//企业管理
import BusinessInfos from './routes/businessManagement/BusinessInfos'
//账户管理
import CommissionRecord from './routes/accountManagement/CommissionRecord'
import CommissionRecordDetails from './routes/accountManagement/CommissionRecordDetails'
import PwdManagement from './routes/accountManagement/PwdManagement'
import BankCardManagement from './routes/accountManagement/BankCardManagement'
//佣金设置
import CommissionInstalled from './routes/commissionSetting/CommissionInstalled'
import CommissionAdjustRecord from './routes/commissionSetting/CommissionAdjustRecord'
//数据统计
import BasicStatistics from './routes/dataStatistics/BasicStatistics'
import BusinessStatistics from './routes/dataStatistics/BusinessStatistics'
import DealStatistics from './routes/dataStatistics/DealStatistics'
import standardHome from './routes/dataStatistics/standardHome'
import standardManage from './routes/dataStatistics/standardManage'
import standardCreate from './routes/dataStatistics/standardCreate'
import dailyCount from './routes/dataStatistics/dailyCount'
import dailyCountOne from './routes/dataStatistics/dailyCountOne'
//客户管理
import customerManage from './routes/customerManage/customerManage'
import managePage from './routes/customerManage/managePage'
import editPage from './routes/customerManage/editPage'
//登陆页面
import LogIn from './routes/logIn/LogIn'
import MentorRegister from './routes/logIn/MentorRegister'
import WritePhone from './routes/logIn/WritePhone'
import PerfectInformation from './routes/logIn/PerfectInformation'
import Complete from './routes/logIn/Complete'
// Retrieve password
import Retrievepwd from './routes/logIn/Retrievepwd'
import GetCodeByPhone from './routes/logIn/GetCodeByPhone'
import ReSetPassWrod from './routes/logIn/ReSetPassWrod'
export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/login" components={LogIn} />
      <Redirect from='/mentorRegister' to='mentorRegister/writePhone' />
      <Route path="/mentorRegister" component={MentorRegister} >
        <Route path="writePhone" component={WritePhone} />
        <Route path="perfectInformation" component={PerfectInformation} />
        <Route path="complete" component={Complete} />
      </Route>
      <Redirect from='/retrievePwd' to='retrievePwd/getCodeByPhone' />
      <Route path="/retrievePwd" component={Retrievepwd} >
        <Route path="getCodeByPhone" component={GetCodeByPhone} />
        <Route path="reSetPassWrod" component={ReSetPassWrod} />
      </Route>
      <Redirect from='/' to='/indexPage' />
      <Route path="/" name='' breadcrumbName='首页' component={Main} onEnter={checkLogin}>
        <Route path='indexPage' component={IndexPageX} />
        {/*<IndexRoute component={IndexPage}/>*/}
        <IndexRoute component={IndexPageX} />
        <Route path='remindMsgManagement' name='remindMsgManagement' breadcrumbName='消息管理'>
          <IndexRoute component={RemindMsgManagement} />
          <Route path="remindMsgInfo" component={RemindMsgInfo} name='remindMsgInfo' breadcrumbName='消息详情' />
        </Route>
        <Route path='accountSetting' component={AccountSetting} name='accountSetting' breadcrumbName='账号设置' />
        <Route path='allHouse' name="allHouse" breadcrumbName="公司房源">
          <IndexRoute component={allHouseResourceSell} />
          <Route path='allHouseResourceSell' component={allHouseResourceSell} name="allHouseResourceSell" breadcrumbName="出售">
            <IndexRoute component={allHouseResourceSell} />
          </Route>
          <Route path='allHouseResourceRent' component={allHouseResourceSell} name="allHouseResourceRent" breadcrumbName="出租">
            <IndexRoute component={allHouseResourceSell} />
          </Route>
          <Route path='allHouseResourceDetail' component={allHouseResourceDetail} name='allHouseResourceDetail' breadcrumbName='房源详情'>
            <IndexRoute component={allHouseResourceDetail} />
          </Route>
        </Route>
        <Route
          path='houseResourceSaleManagement'
          name="houseResourceSaleManagement"
          breadcrumbName="房源出售管理">
          <IndexRoute component={SecondHandHouseSell} />
          <Route path='directAssignAgent' component={DirectAssignAgent} name="directAssignAgent" breadcrumbName="指派经纪人" />
          <Route path="secondHandHouseSell" name="secondHandHouseSell" breadcrumbName="二手房出售">
            <IndexRoute component={SecondHandHouseSell} />
            <Redirect from='createSecondHandSellResource' to='createSecondHandSellResource/houseResourceInfos' />
            <Route path="createSecondHandSellResource" component={CreateSecondHandSellResource} name='createSecondHandSellResource' breadcrumbName='创建房源'>
              <Route path="houseResourceInfos" component={HouseResourceInfos} name="houseResourceInfos" breadcrumbName="添加房源信息" />
              <Route path="houseImgs" component={HouseImgs} name="houseImgs" breadcrumbName="上传房源图片" />
              <Route path='ownerInfos' component={OwnerInfos} name="ownerInfos" breadcrumbName="添加业主信息" />
              <Route path='assignAgent' component={AssignAgent} name="assignAgent" breadcrumbName="添加合作促销" />
            </Route>
            <Redirect from='secHandSellingNavBar' to='secHandSellingNavBar/secHandSellingDetails' />
            <Route path='secHandSellingNavBar' component={SecHandSelledNavBar}>
              <Route path='secHandSellingDetails' component={SecHandSelledDetails} />
              <Route path='secHandSellingVideoAndImgs' component={SecHandSelledVideoAndImgs} />
              <Route path='secHandSellingAgentBroker' component={SecHandSelledAgentBroker} />
              <Route path='secHandSellingRecord' component={SecHandSelledRecord} />
              <Route path='secHandSellingDeal' component={SecHandSelledDeal} />
            </Route>
          </Route>
          <Route path="shopsSell" name="shopsSell" breadcrumbName="商铺出售">
            <IndexRoute component={ShopsSell} />
            <Redirect from='createShopsSellResource' to='createShopsSellResource/shopsResourceInfos' />
            <Route path="createShopsSellResource" component={CreateShopsSellResource} name='createShopsSellResource' breadcrumbName='创建房源'>
              <Route path="shopsResourceInfos" component={ShopsResourceInfos} name="shopsResourceInfos" breadcrumbName="添加房源信息" />
              <Route path="shopsImgs" component={ShopsImgs} name="shopsImgs" breadcrumbName="上传房源图片" />
              <Route path='shopsOwnerInfos' component={ShopsOwnerInfos} name="shopsOwnerInfos" breadcrumbName="添加业主信息" />
              <Route path='assignAgentShopsSell' component={AssignAgentShopsSell} name="assignAgentShopsSell" breadcrumbName="添加合作促销" />
            </Route>

            <Redirect from='storeSellingNavBar' to='storeSellingNavBar/storeSellingDetails' />
            <Route path='storeSellingNavBar' component={StoreSellingNavBar}>
              <Route path='storeSellingDetails' component={StoreSellingDetails} />
              <Route path='storeSellingVideoAndImgs' component={StoreSellingVideoAndImgs} />
              <Route path='storeSellingAgentBroker' component={StoreSellingAgentBroker} />
              <Route path='storeSellingRecord' component={StoreSellingRecord} />
              <Route path='storeSellingDeal' component={StoreSellingDeal} />
            </Route>
          </Route>
          <Route path="officeSell" name="officeSell" breadcrumbName="写字楼出售">
            <IndexRoute component={OfficeSell} />
            <Redirect from='createOfficeSellResource' to='createOfficeSellResource/officeResourceInfos' />
            <Route path="createOfficeSellResource" component={CreateOfficeSellResource} name='createOfficeSellResource' breadcrumbName='创建房源'>
              <Route path="officeResourceInfos" component={OfficeResourceInfos} name="officeResourceInfos" breadcrumbName="添加房源信息" />
              <Route path="officeImgs" component={OfficeImgs} name="officeImgs" breadcrumbName="上传房源图片" />
              <Route path='officeOwnerInfos' component={OfficeOwnerInfos} name="officeOwnerInfos" breadcrumbName="添加业主信息" />
              <Route path='assignAgentOfficeSell' component={AssignAgentOfficeSell} name="assignAgentOfficeSell" breadcrumbName="添加合作促销" />
            </Route>
            <Redirect from='officeSellingNavBar' to='officeSellingNavBar/officeSellingDetails' />
            <Route path='officeSellingNavBar' component={OfficeSellingNavBar}>
              <Route path='officeSellingDetails' component={OfficeSellingDetails} />
              <Route path='officeSellingVideoAndImgs' component={OfficeSellingVideoAndImgs} />
              <Route path='officeSellingAgentBroker' component={OfficeSellingAgentBroker} />
              <Route path='officeSellingRecord' component={OfficeSellingRecord} />
              <Route path='officeSellingDeal' component={OfficeSellingDeal} />
            </Route>
          </Route>
        </Route>
        <Route path='houseResourceRentManagement' name="houseResourceRentManagement" breadcrumbName="房源出租管理">
          <IndexRoute component={SecondHandHouseRent} />
          <Route path='directAssignAgent' component={DirectAssignAgent} name="directAssignAgent" breadcrumbName="指派经纪人" />
          <Route path="secondHandHouseRent" name="secondHandHouseRent" breadcrumbName="二手房出租">
            <IndexRoute component={SecondHandHouseRent} />
            <Redirect from='createSecondHandRentResource' to='createSecondHandRentResource/houseResourceInfosRent' />
            <Route path="createSecondHandRentResource" component={CreateSecondHandRentResource} name='createSecondHandRentResource' breadcrumbName='创建房源'>
              <Route path="houseResourceInfosRent" component={HouseResourceInfosRent} name="houseResourceInfosRent" breadcrumbName="添加房源信息" />
              <Route path="houseImgsRent" component={HouseImgsRent} name="houseImgsRent" breadcrumbName="上传房源图片" />
              <Route path='ownerInfosRent' component={OwnerInfosRent} name="ownerInfosRent" breadcrumbName="添加业主信息" />
              <Route path='assignAgentRent' component={AssignAgentRent} name="assignAgentRent" breadcrumbName="添加合作促销" />
            </Route>
            <Redirect from='secHandRentingNavBar' to='secHandRentingNavBar/secHandRentingDetails' />
            <Route path='secHandRentingNavBar' component={SecHandRentingNavBar}>
              <Route path='secHandRentingDetails' component={SecHandRentingDetails} />
              <Route path='secHandRentingVideoAndImgs' component={SecHandRentingVideoAndImgs} />
              <Route path='secHandRentingAgentBroker' component={SecHandRentingAgentBroker} />
              <Route path='secHandRentingRecord' component={SecHandRentingRecord} />
              <Route path='secHandRentingDeal' component={SecHandRentingDeal} />
            </Route>
          </Route>
          <Route path="shopsRent" name="shopsRent" breadcrumbName="商铺出租">
            <IndexRoute component={ShopsRent} />
            <Redirect from='createShopsRentResource' to='createShopsRentResource/shopsResourceInfosRent' />
            <Route path="createShopsRentResource" component={CreateShopsRentResource} name='createShopsRentResource' breadcrumbName='创建房源'>
              <Route path="shopsResourceInfosRent" component={ShopsResourceInfosRent} name="shopsResourceInfosRent" breadcrumbName="添加房源信息" />
              <Route path="shopsImgsRent" component={ShopsImgsRent} name="shopsImgsRent" breadcrumbName="上传房源图片" />
              <Route path='shopsOwnerInfosRent' component={ShopsOwnerInfosRent} name="shopsOwnerInfosRent" breadcrumbName="添加业主信息" />
              <Route path='assignAgentShopsRent' component={AssignAgentShopsRent} name="assignAgentShopsRent" breadcrumbName="添加合作促销" />
            </Route>
            <Redirect from='storeRentingNavBar' to='storeRentingNavBar/storeRentingDetails' />
            <Route path='storeRentingNavBar' component={StoreRentingNavBar}>
              <Route path='storeRentingDetails' component={StoreRentingDetails} />
              <Route path='storeRentingVideoAndImgs' component={StoreRentingVideoAndImgs} />
              <Route path='storeRentingAgentBroker' component={StoreRentingAgentBroker} />
              <Route path='storeRentingRecord' component={StoreRentingRecord} />
              <Route path='storeRentingDeal' component={StoreRentingDeal} />
            </Route>
          </Route>
          <Route path="officeRent" name="officeRent" breadcrumbName="写字楼出租">
            <IndexRoute component={OfficeRent} />
            <Redirect from='createOfficeRentResource' to='createOfficeRentResource/officeResourceInfosRent' />
            <Route path='officeRentDetail' component={OfficeRentDetail}></Route>
            <Route path="createOfficeRentResource" component={CreateOfficeRentResource} name='createOfficeRentResource' breadcrumbName='创建房源'>
              <Route path="officeResourceInfosRent" component={OfficeResourceInfosRent} name="officeResourceInfosRent" breadcrumbName="添加房源信息" />
              <Route path="officeImgsRent" component={OfficeImgsRent} name="officeImgsRent" breadcrumbName="上传房源图片" />
              <Route path='officeOwnerInfosRent' component={OfficeOwnerInfosRent} name="officeOwnerInfosRent" breadcrumbName="添加业主信息" />
              <Route path='assignAgentOfficeRent' component={AssignAgentOfficeRent} name="assignAgentOfficeRent" breadcrumbName="添加合作促销" />
            </Route>
          </Route>
        </Route>
        <Route path='agentManagement' name="agentManagement" breadcrumbName="经纪人管理" >
          <IndexRoute component={AgentGroups} />
          <Route path='agentGroups' name="agentGroups" breadcrumbName="组织架构管理" component={AgentGroups} />
          <Route path='peoplePosition' name="peoplePosition" breadcrumbName="人员位置分布" component={PeoplePosition} />
          <Route path='detaileInfors' component={DetaileInfors} name="detaileInfors" breadcrumbName="经纪人详情" />
          <Route path='applicationAcceptance' name="applicationAcceptance" breadcrumbName="经纪人审核" component={ApplicationAcceptance} />
          <Route path='inactiveAgent' component={InactiveAgent} name="inactiveAgent" breadcrumbName="未激活经纪人" />
        </Route>
        <Route path='businessManagement' name="businessManagement" breadcrumbName="企业管理">
          <Route path='businessInfos' component={BusinessInfos} name="businessInfos" breadcrumbName="企业信息" />
        </Route>
        <Route path='accountManagement' name="accountManagement" breadcrumbName="账户管理">
          <Route
            path='commissionRecord'
            name="commissionRecord"
            breadcrumbName="佣金分配机制">
            <IndexRoute component={CommissionRecord} />
            <Route
              path='commissionRecordDetails'
              name="commissionRecordDetails"
              component={CommissionRecordDetails}
              breadcrumbName="佣金分配详情" />
            <Route
              path='pwdManagement'
              name="pwdManagement"
              breadcrumbName="密码管理"
              component={PwdManagement}
            />
          </Route>
          <Route path='bankCardManagement' component={BankCardManagement} name="bankCardManagement"
            breadcrumbName="银行卡管理" />
          {/*银行卡管理页面*/}
        </Route>
        <Route path='commissionSetting' name="commissionSetting" breadcrumbName="佣金设置">
          <Route path='commissionInstalled' name="commissionInstalled"
            breadcrumbName="佣金设置">
            <IndexRoute component={CommissionInstalled} />
            <Route
              path='commissionAdjustRecord'
              component={CommissionAdjustRecord}
              name="commissionAdjustRecord"
              breadcrumbName="佣金调整记录" />
          </Route>
        </Route>
        {/*数据统计页面*/}
        <Route path='dataStatistics' name="dataStatistics" breadcrumbName="数据统计">
          <Route path='basicStatistics' name="basicStatistics" breadcrumbName="基础统计">
            <IndexRoute component={BasicStatistics} />
            <Route path='businessStatistics' name="businessStatistics"
              breadcrumbName="业务数据" component={BusinessStatistics} />
            <Route path='dealStatistics' name="dealStatistics"
              breadcrumbName="成交数据" component={DealStatistics} />
          </Route>
          <Route path='standardHome' name="standardHome" breadcrumbName="考核达标线设置">
            <IndexRoute component={standardHome} />
            <Route path='standardManage' name="standardManage"
              breadcrumbName="达标线管理">
              <IndexRoute component={standardManage} />
              <Route path='standardCreate' name="standardCreate"
                breadcrumbName="编辑方案" component={standardCreate} />
            </Route>
          </Route>
          <Route path='dailyCount' name="dailyCount" breadcrumbName="全员日报统计">
            <IndexRoute component={dailyCount} />
            <Route path='dailyCountOne' name='dailyCountOne' breadcrumbName='门店数据统计' component={dailyCountOne}></Route>
          </Route>
        </Route>
        <Route path='agentmd' name="agentmd" breadcrumbName="经纪门店管理">
          <Route path='agentMd' name="agentMd" breadcrumbName="经纪门店">
            <IndexRoute component={MyNew} />
            <Route path="addMd" component={addMd} name='addMd' breadcrumbName='创建管理' />

          </Route>
        </Route>
        {/* 客户管理相关路由 */}
        <Route path='customerManage' name="customerManage" breadcrumbName="客户列表">
          <IndexRoute component={customerManage} />
          <Route path='managePage' name='managePage' breadcrumbName="客户管理" component={managePage}>
            <IndexRoute componet={managePage}></IndexRoute>
          </Route>
          <Route path='editPage' name='editPage' breadcrumbName="编辑客户" component={editPage}>
            <IndexRoute componet={editPage}></IndexRoute>
          </Route>
        </Route>
      </Route>
    </Router>
  )
}

function checkLogin(nextState, replace) {
  if (!sessionStorage.getItem('anzhu_login')) {
    //未登录
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
