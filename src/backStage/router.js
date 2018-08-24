import React from 'react'
import { Router, Route, IndexRoute,Redirect } from 'dva/router'
import {
  judgeJurisdiction,
  isNull,
} from '../commons/utils/currencyFunction'
import IndexPage from './routes/IndexPage'
import Main from './routes/Main'
import Login from './routes/Login'
import Test from '../commons/routes/Test'
//资源管理/新房项目/创建页面6个
import NewHousePro from './routes/resourceManagement/newHousePro/NewHouseProIndex'
import CreateNewHouse from './routes/resourceManagement/newHousePro/createPro/CreateNewHouse'
import UploadHousePhotoes from './routes/resourceManagement/newHousePro/createPro/UploadHousePhotoes'
import ImgManagement from './routes/resourceManagement/newHousePro/createPro/ImgManagement'
import CreateProjectTable from './routes/resourceManagement/newHousePro/createPro/CreateProjectTable'
import CreateConcessions from './routes/resourceManagement/newHousePro/createPro/CreateConcessions'
import UploadAptitude from './routes/resourceManagement/newHousePro/createPro/UploadAptitude'
//资源管理/新房项目/详情页面6个
//资源管理/新房项目/交易数据页面



//资源管理/新房项目//交易数据
import DealDataNavBar from './routes/resourceManagement/newHousePro/dealData/dealDataNavBar'
import DealDataTradeInfoDetails from './routes/resourceManagement/newHousePro/dealData/DealDataTradeInfoDetails'
import ProjectDetails from './routes/resourceManagement/newHousePro/ProjectDetails'
import Report from './routes/resourceManagement/newHousePro/dealData/report'
//新房项目二手房在售详情
import SecHandSellingNavBar from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingNavBar'
import SecHandSellingDetails from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingDetails'
import SecHandSellingVideoAndImgs from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingVideoAndImgs'
import SecHandSellingAgentBroker from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingAgentBroker'
import SecHandSellingRecord from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingRecord'
import SecHandSellingDeal from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/SecHandSellingDeal'
//新房项目二手房已售详情
import SecHandSelledNavBar from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledNavBar'
import SecHandSelledDetails from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledDetails'
import SecHandSelledVideoAndImgs from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledVideoAndImgs'
import SecHandSelledAgentBroker from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledAgentBroker'
import SecHandSelledRecord from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledRecord'
import SecHandSelledDeal from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/SecHandSelledDeal'

//新房项目 /二手房出租首页
import SecondHandRentIndex from './routes/resourceManagement/secondhandHouseRent/SecondHandRentIndex'
//新房项目二手房再租详情
import SecHandRentingNavBar from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingNavBar'
import SecHandRentingDetails from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingDetails'
import SecHandRentingVideoAndImgs from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingVideoAndImgs'
import SecHandRentingAgentBroker from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingAgentBroker'
import SecHandRentingRecord from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingRecord'
import SecHandRentingDeal from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/SecHandRentingDeal'
//新房项目二手房已租详情
import SecHandRentedNavBar from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedNavBar'
import SecHandRentedDetails from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedDetails'
import SecHandRentedVideoAndImgs from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedVideoAndImgs'
import SecHandRentedAgentBroker from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedAgentBroker'
import SecHandRentedRecord from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedRecord'
import SecHandRentedDeal from './routes/resourceManagement/secondhandHouseRent/secondhandHouseRented/details/SecHandRentedDeal'

//新房项目商铺在售详情
import StoreSellingNavBar from './routes/resourceManagement/storeSell/storeSelling/StoreSellingNavBar'
import StoreSellingDetails from './routes/resourceManagement/storeSell/storeSelling/StoreSellingDetails'
import StoreSellingVideoAndImgs from './routes/resourceManagement/storeSell/storeSelling/StoreSellingVideoAndImgs'
import StoreSellingAgentBroker from './routes/resourceManagement/storeSell/storeSelling/StoreSellingAgentBroker'
import StoreSellingRecord from './routes/resourceManagement/storeSell/storeSelling/StoreSellingRecord'
import StoreSellingDeal from './routes/resourceManagement/storeSell/storeSelling/StoreSellingDeal'
//新房项目商铺已售详情
import StoreSelledNavBar from './routes/resourceManagement/storeSell/storeSelled/StoreSelledNavBar'
import StoreSelledDetails from './routes/resourceManagement/storeSell/storeSelled/StoreSelledDetails'
import StoreSelledVideoAndImgs from './routes/resourceManagement/storeSell/storeSelled/StoreSelledVideoAndImgs'
import StoreSelledAgentBroker from './routes/resourceManagement/storeSell/storeSelled/StoreSelledAgentBroker'
import StoreSelledRecord from './routes/resourceManagement/storeSell/storeSelled/StoreSelledRecord'
import StoreSelledDeal from './routes/resourceManagement/storeSell/storeSelled/StoreSelledDeal'
//新房项目商铺出租首页
import StoreRent from './routes/resourceManagement/storeRent/StoreRent'
// //新房项目商铺在售详情
import StoreRentingNavBar from './routes/resourceManagement/storeRent/storeRenting/StoreRentingNavBar'
import StoreRentingDetails from './routes/resourceManagement/storeRent/storeRenting/StoreRentingDetails'
import StoreRentingVideoAndImgs from './routes/resourceManagement/storeRent/storeRenting/StoreRentingVideoAndImgs'
import StoreRentingAgentBroker from './routes/resourceManagement/storeRent/storeRenting/StoreRentingAgentBroker'
import StoreRentingRecord from './routes/resourceManagement/storeRent/storeRenting/StoreRentingRecord'
import StoreRentingDeal from './routes/resourceManagement/storeRent/storeRenting/StoreRentingDeal'
// //新房项目商铺已售详情
import StoreRentedNavBar from './routes/resourceManagement/storeRent/storeRented/StoreRentedNavBar'
import StoreRentedDetails from './routes/resourceManagement/storeRent/storeRented/StoreRentedDetails'
import StoreRentedVideoAndImgs from './routes/resourceManagement/storeRent/storeRented/StoreRentedVideoAndImgs'
import StoreRentedAgentBroker from './routes/resourceManagement/storeRent/storeRented/StoreRentedAgentBroker'
import StoreRentedRecord from './routes/resourceManagement/storeRent/storeRented/StoreRentedRecord'
import StoreRentedDeal from './routes/resourceManagement/storeRent/storeRented/StoreRentedDeal'

//新房项目写字楼首页
import OfficeSell from './routes/resourceManagement/officeSell/OfficeSell'
//新房项目写字楼在售详情
import OfficeSellingNavBar from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingNavBar'
import OfficeSellingDetails from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingDetails'
import OfficeSellingVideoAndImgs from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingVideoAndImgs'
import OfficeSellingAgentBroker from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingAgentBroker'
import OfficeSellingRecord from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingRecord'
import OfficeSellingDeal from './routes/resourceManagement/officeSell/officeSelling/OfficeSellingDeal'
// //新房项目写字楼已售详情
import OfficeSelledNavBar from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledNavBar'
import OfficeSelledDetails from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledDetails'
import OfficeSelledVideoAndImgs from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledVideoAndImgs'
import OfficeSelledAgentBroker from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledAgentBroker'
import OfficeSelledRecord from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledRecord'
import OfficeSelledDeal from './routes/resourceManagement/officeSell/officeSelled/OfficeSelledDeal'
//新房项目写字楼出租首页
import OfficeRent from './routes/resourceManagement/officeRent/OfficeRent'
import OfficeRentDetail from './routes/resourceManagement/officeRent/OfficeRentDetail'

//房源管理 房源下架
import HouseResourceOffline from './routes/resourceManagement/houseResourceOffline/HouseResourceOffline'
import HouseResourceOfflineDetail from './routes/resourceManagement/houseResourceOffline/HouseResourceOfflineDetail'
import SecHouseShopOffceDetail from './routes/resourceManagement/houseResourceOffline/SecHouseShopOffceDetail'

import SecondHandSellIndex from './routes/resourceManagement/secondhandHouseSell/SecondHandSellIndex'
// import SellingHousingDetails from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/SellingHousingDetails'
// import VideoAndImg from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/VideoAndImg'
import CheckRecord from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/CheckRecord'
import SellingAgentBrokers from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/SellingAgentBrokers'

import SellingStrikeHands from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelling/SellingStrikeHands';

//资源管理/二手房出售/已售
import SelledHousingDetails from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/SelledHousingDetails'
import SelledAgentBrokers from './routes/resourceManagement/secondhandHouseSell/secondhandHouseSelled/SelledAgentBrokers'

import NavBar from './routes/resourceManagement/newHousePro/createPro/NavBar'
// import TextEditors from './components/adminLTE/TextEditors'

//配置管理
  //城市管理
import CityManagementIndex from './routes/cityManagement/CityManagementIndex'
import DivisionManagement from './routes/cityManagement/DivisionManagement'

//标签管理
  //标签配置
import LabelConfiguration from './routes/labelManagement/LabelConfiguration'

//收益设置
import AllEarningsMatchingIndex from './routes/earningSetting/EachSideEarningsMatchingIndex';
import BrokerageMatching from './routes/earningSetting/BrokerageMatching';
import ServiceMatching from './routes/earningSetting/ServiceMatching';
import NewCreateMatchProject from './routes/earningSetting/NewCreateMatchProject';

//资源管理/商铺出售//在售商铺
import StoreSell from './routes/resourceManagement/storeSell/StoreSell'
import AvailabilityDetails from './routes/resourceManagement/storeSell/saleingShops/AvailabilityDetails'
import VideoImage from './routes/resourceManagement/storeSell/saleingShops/VideoImage'
import AgentBroker from './routes/resourceManagement/storeSell/saleingShops/AgentBroker'
import LookRecord from './routes/resourceManagement/storeSell/saleingShops/LookRecord'
import Deal from './routes/resourceManagement/storeSell/saleingShops/Deal'
//资源管理//小区管理
import CommunityManagement from './routes/resourceManagement/communityManagement/CommunityManagement'
//楼盘字典//小区管理
import ResidentialArea from './routes/developmentDictionary/residentialArea/ResidentialArea'
import CreateCell from './routes/developmentDictionary/residentialArea/CreateCell'
import PhotoManagement from './routes/developmentDictionary/residentialArea/PhotoManagement'
import LoudongManagement from './routes/developmentDictionary/residentialArea/LoudongManagement'
import PositionMap from './routes/developmentDictionary/residentialArea/PositionMap'
import WatchHousingNumber from './routes/developmentDictionary/residentialArea/WatchHousingNumber'
//楼盘字典//商铺
import ShopsManagement from './routes/developmentDictionary/shopsManagement/ShopsManagement'
import ShopsLoudongManagement from './routes/developmentDictionary/shopsManagement/ShopsLoudongManagement'
import ShopsCreateShangPu from './routes/developmentDictionary/shopsManagement/ShopsCreateShangPu'
import ShopsPosition from './routes/developmentDictionary/shopsManagement/ShopsPosition'
import ShopsPhotoManagement from './routes/developmentDictionary/shopsManagement/ShopsPhotoManagement'
import WatchHousingNumberShop from './routes/developmentDictionary/shopsManagement/WatchHousingNumberShop'
//楼盘字典//写字楼
import OfficeBuilding from './routes/developmentDictionary/officeBuilding/OfficeBuilding'
import OfficeLoudongManagement from './routes/developmentDictionary/officeBuilding/OfficeLoudongManagement'
import OfficePhotoManagement from './routes/developmentDictionary/officeBuilding/OfficePhotoManagement'
import OfficceCreateBuilding from './routes/developmentDictionary/officeBuilding/OfficceCreateBuilding'
import OfficePosition from './routes/developmentDictionary/officeBuilding/OfficePosition'
import WatchHousingNumberOffice from './routes/developmentDictionary/officeBuilding/WatchHousingNumberOffice'
//账号管理
import BrokerIdIndex from './routes/idManagement/BrokerIdIndex'
import BrokerIdDetail from './routes/idManagement/BrokerIdDetail'
import AdvisorIdIndex from './routes/idManagement/AdvisorIdIndex'
import AdvisorIdDetail from './routes/idManagement/AdvisorIdDetail'
import DealCenterIdIndex from './routes/idManagement/DealCenterIdIndex'
import DealCenterIdDetail from './routes/idManagement/DealCenterIdDetail'
import NewAccount from './routes/idManagement/NewAccount'
import AgentIdIndex from './routes/idManagement/AgentIdIndex'
import AgentIdIndexNewAccount from './routes/idManagement/AgentIdIndexNewAccount'
import AgentIdDetail from './routes/idManagement/AgentIdDetail'
//客户管理
import customerManagement from './routes/idManagement/customerManagement'
//账户管理
import ZhangHuGuanLiBroker from './routes/accountManagement/ZhangHuGuanLiBroker'
import BrokerDetailed from './routes/accountManagement/BrokerDetailed'
import TutorDetailed from './routes/accountManagement/TutorDetailed'
import ZhangHuGuanLiAgent from './routes/accountManagement/ZhangHuGuanLiAgent'
import AgentSettlement from './routes/accountManagement/AgentSettlement'
import AccountTutor from './routes/accountManagement/AccountTutor'
import AccountAgentDetail from './routes/accountManagement/AccountAgentDetail'
import AccountTutorDetail from './routes/accountManagement/AccountTutorDetail'
import AgentDetailIncome from './routes/accountManagement/AgentDetailIncome'
import ZhangHuDetail from './routes/accountManagement/ZhangHuDetail'

//账户管理交易中心
import AccountDealCenter from './routes/accountManagement/AccountDealCenter'
import DealCenterSettlement from './routes/accountManagement/DealCenterSettlement'
import AccountDealCenterDetail from './routes/accountManagement/AccountDealCenterDetail'
import DealCenterDetailIncome from './routes/accountManagement/DealCenterDetailIncome'
//广告管理

import PutManage from './routes/adManagement/PutManage'
//培训
import TrainContent from './routes/train/TrainContent'
import TrainRichTest from './routes/train/TrainRichTest'
//消息管理
import SystemMessage from './routes/messageManagement/SystemMessage'
import PushMessage from './routes/messageManagement/PushMessage'

//合同协议管理
import DealContract from './routes/contractManagement/DealContract'
import ContractAgreementModulesManage from './routes/contractManagement/ContractAgreementModulesManage'
//师徒管理
import PromoteMaster from './routes/mentoringSetting/PromoteMaster'
import PromotePrentice from './routes/mentoringSetting/PromotePrentice'
//权限管理
import JolesManagement from './routes/accessManagement/JolesManagement'
//内容审核
import HouseImgCheck from './routes/contentCheck/houseImgCheck/HouseImgCheck'
import HouseImgCheckDetail from './routes/contentCheck/houseImgCheck/HouseImgCheckDetail'
import AdvisorRegister from './routes/contentCheck/advisorRegister/AdvisorRegister'
import AdvisorRegisterDetail from './routes/contentCheck/advisorRegister/AdvisorRegisterDetail'
import BrokerUploadCommunity from './routes/contentCheck/brokerUploadCommunity/BrokerUploadCommunity'
import RemoveRelationApplication from './routes/contentCheck/removeRelationApplication/RemoveRelationApplication'
import DealDetailMaster from './routes/contentCheck/removeRelationApplication/DealDetailMaster'
import BrokerNameCertificate from './routes/contentCheck/brokerNameCertificate/BrokerNameCertificate'
import AuthenticationDetail from './routes/contentCheck/brokerNameCertificate/AuthenticationDetail'
import Feedback from './routes/contentCheck/feedback/Feedback'
import ApplicationWithdrawal from './routes/contentCheck/applicationWithdrawal/ApplicationWithdrawal'
//消息服务
import PersonnelManage from './routes/enterpriseFramework/PersonnelManage'
//设置
import ModifyPassword from './routes/setting/ModifyPassword'
import ApkManagement from './routes/apkVersion/ApkManagement'

//平台结算
import PlatformFund from './routes/financeManagement/platformFund/PlatformFund'
import PlatformFundDetail from './routes/financeManagement/platformFund/PlatformFundDetail'
import ExpenditureDetail from './routes/financeManagement/platformFund/ExpenditureDetail'
import PlatformEarningBalance from './routes/financeManagement/platformEarningBalance/PlatformEarningBalance'
import PlatformEarningBalanceDetail from './routes/financeManagement/platformEarningBalance/PlatformEarningBalanceDetail'
import PlatformSettlement from './routes/financeManagement/platformEarningBalance/PlatformSettlement'
export default function({ history }) {
  return (
    <Router history={history}>
      <Route path='/login' component={Login}/>
      <Redirect from='/' to='/indexPage'/>
      <Route path="/" component={Main} name='' breadcrumbName='首页' onEnter={checkLogin}>
        <IndexRoute component={IndexPage}/>
        <Route path='indexPage' component={IndexPage}/>
        <Route path='resourceManagement'>
        	<Route path='newHousePro'>
            <IndexRoute component={NewHousePro} onEnter={judgeRouter} qxCode='BACKSTAGE_NEWHOUSE_PROJECT'/>
            <Route path='projectDetails' component={ProjectDetails}/>
						<Route path="create">
							<Route path="steps" component={NavBar}/>
							<Route path='createNewHouse' component={CreateNewHouse}/>
							<Route path='uploadHousePhotoes' component={UploadHousePhotoes}/>
							<Route path='imgManagement'component={ImgManagement}/>
							<Route path='createPro' component={CreateProjectTable}/>
							<Route path='createConcessions' component={CreateConcessions} />
							<Route path='uploadAptitude' component={UploadAptitude} />
						</Route>
						<Route path="detail">
						</Route>
						<Route path="dealData">
                <IndexRoute component={DealDataNavBar} />
                <Route path='report' component={Report}/>
                <Route path='dealDataTradeInfoDetails' component={DealDataTradeInfoDetails}/>
						</Route>
          </Route>
          <Route path='secondhandHouseSell'>
            {/*<IndexRoute component={Test}>*/}
            <IndexRoute component={SecondHandSellIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_SECONDHAND_SELL'/>
            <Redirect from='secHandSellingNavBar' to='secHandSellingNavBar/secHandSellingDetails'/>
						<Route path='secHandSellingNavBar' component={SecHandSellingNavBar}>
							<Route path='secHandSellingDetails' component={SecHandSellingDetails}/>
							<Route path='secHandSellingVideoAndImgs' component={SecHandSellingVideoAndImgs}/>
							<Route path='secHandSellingAgentBroker' component={SecHandSellingAgentBroker}/>
							<Route path='secHandSellingRecord' component={SecHandSellingRecord}/>
							<Route path='secHandSellingDeal' component={SecHandSellingDeal}/>
						</Route>
            <Redirect from='secHandSelledNavBar' to='secHandSelledNavBar/secHandSelledDetails'/>
						<Route path='secHandSelledNavBar' component={SecHandSelledNavBar}>
							<Route path='secHandSelledDetails' component={SecHandSelledDetails}/>
							<Route path='secHandSelledVideoAndImgs' component={SecHandSelledVideoAndImgs}/>
							<Route path='secHandSelledAgentBroker' component={SecHandSelledAgentBroker}/>
							<Route path='secHandSelledRecord' component={SecHandSelledRecord}/>
							<Route path='secHandSelledDeal' component={SecHandSelledDeal}/>
						</Route>
						<Route path="Selled">
							<Route path='housingDetails' component={SelledHousingDetails}/>
							<Route path='videoAndImg' />
							<Route path='checkRecord' />
							<Route path='agentBrokers' component={SelledAgentBrokers}/>
							<Route path=''/>
						</Route>
          </Route>
					<Route path='secondhandHouseRent'>
            <IndexRoute component={SecondHandRentIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_SECONDHAND_RENT'/>
              <Redirect from='secHandRentingNavBar' to='secHandRentingNavBar/secHandRentingDetails'/>
              <Route path='secHandRentingNavBar' component={SecHandRentingNavBar}>
                <Route path='secHandRentingDetails' component={SecHandRentingDetails}/>
                <Route path='secHandRentingVideoAndImgs' component={SecHandRentingVideoAndImgs}/>
                <Route path='secHandRentingAgentBroker' component={SecHandRentingAgentBroker}/>
                <Route path='secHandRentingRecord' component={SecHandRentingRecord}/>
                <Route path='secHandRentingDeal' component={SecHandRentingDeal}/>
              </Route>
              <Redirect from='secHandRentedNavBar' to='secHandRentedNavBar/secHandRentedDetails'/>
              <Route path='secHandRentedNavBar' component={SecHandRentedNavBar}>
                <Route path='secHandRentedDetails' component={SecHandRentedDetails}/>
                <Route path='secHandRentedVideoAndImgs' component={SecHandRentedVideoAndImgs}/>
                <Route path='secHandRentedAgentBroker' component={SecHandRentedAgentBroker}/>
                <Route path='secHandRentedRecord' component={SecHandRentedRecord}/>
                <Route path='secHandRentedDeal' component={SecHandRentedDeal}/>
              </Route>
					</Route>
					<Route path='storeRent'>
            <IndexRoute component={StoreRent} onEnter={judgeRouter} qxCode='BACKSTAGE_SHOP_RENT'/>
            <Redirect from='storeRentingNavBar' to='storeRentingNavBar/storeRentingDetails'/>
            <Route path='storeRentingNavBar' component={StoreRentingNavBar}>
              <Route path='storeRentingDetails' component={StoreRentingDetails}/>
              <Route path='storeRentingVideoAndImgs' component={StoreRentingVideoAndImgs}/>
              <Route path='storeRentingAgentBroker' component={StoreRentingAgentBroker}/>
              <Route path='storeRentingRecord' component={StoreRentingRecord}/>
              <Route path='storeRentingDeal' component={StoreRentingDeal}/>
            </Route>
            <Redirect from='storeRentedNavBar' to='storeRentedNavBar/storeRentedDetails'/>
            <Route path='storeRentedNavBar' component={StoreRentedNavBar}>
              <Route path='storeRentedDetails' component={StoreRentedDetails}/>
              <Route path='storeRentedVideoAndImgs' component={StoreRentedVideoAndImgs}/>
              <Route path='storeRentedAgentBroker' component={StoreRentedAgentBroker}/>
              <Route path='storeRentedRecord' component={StoreRentedRecord}/>
              <Route path='storeRentedDeal' component={StoreRentedDeal}/>
            </Route>
					</Route>
					<Route path='officeBuildingSell'>
            <IndexRoute component={OfficeSell} onEnter={judgeRouter} qxCode='BACKSTAGE_OFFICE_SELL'/>
              <Redirect from='officeSellingNavBar' to='officeSellingNavBar/officeSellingDetails'/>
  						<Route path='officeSellingNavBar' component={OfficeSellingNavBar}>
  							<Route path='officeSellingDetails' component={OfficeSellingDetails}/>
  							<Route path='officeSellingVideoAndImgs' component={OfficeSellingVideoAndImgs}/>
  							<Route path='officeSellingAgentBroker' component={OfficeSellingAgentBroker}/>
  							<Route path='officeSellingRecord' component={OfficeSellingRecord}/>
  							<Route path='officeSellingDeal' component={OfficeSellingDeal}/>
  						</Route>
              <Redirect from='officeSelledNavBar' to='officeSelledNavBar/officeSelledDetails'/>
  						<Route path='officeSelledNavBar' component={OfficeSelledNavBar}>
  							<Route path='officeSelledDetails' component={OfficeSelledDetails}/>
  							<Route path='officeSelledVideoAndImgs' component={OfficeSelledVideoAndImgs}/>
  							<Route path='officeSelledAgentBroker' component={OfficeSelledAgentBroker}/>
  							<Route path='officeSelledRecord' component={OfficeSelledRecord}/>
  							<Route path='officeSelledDeal' component={OfficeSelledDeal}/>
  						</Route>
					</Route>
					<Route path='officeBuildingRent'>
            <IndexRoute component={OfficeRent} onEnter={judgeRouter} qxCode='BACKSTAGE_OFFICE_RENT'/>
            <Route path='officeRentDetail' component={OfficeRentDetail}></Route>
					</Route>
          {/*下架房源*/}
					<Route path='soldOutHouse'>
            <IndexRoute component={HouseResourceOffline} onEnter={judgeRouter} qxCode='BACKSTAGE_HOUSING_SHELVES'/>
            <Route path='houseResourceOfflineDetail' component={HouseResourceOfflineDetail}/>
            <Route path='secHouseShopOffceDetail' component={SecHouseShopOffceDetail}/>
					</Route>
          <Route path='storeSell'>
            <IndexRoute component={StoreSell} onEnter={judgeRouter} qxCode='BACKSTAGE_SHOP_SELL'/>
              <Redirect from='storeSellingNavBar' to='storeSellingNavBar/storeSellingDetails'/>
  						<Route path='storeSellingNavBar' component={StoreSellingNavBar}>
  							<Route path='storeSellingDetails' component={StoreSellingDetails}/>
  							<Route path='storeSellingVideoAndImgs' component={StoreSellingVideoAndImgs}/>
  							<Route path='storeSellingAgentBroker' component={StoreSellingAgentBroker}/>
  							<Route path='storeSellingRecord' component={StoreSellingRecord}/>
  							<Route path='storeSellingDeal' component={StoreSellingDeal}/>
  						</Route>
              <Redirect from='storeSelledNavBar' to='storeSelledNavBar/storeSelledDetails'/>
  						<Route path='storeSelledNavBar' component={StoreSelledNavBar}>
  							<Route path='storeSelledDetails' component={StoreSelledDetails}/>
  							<Route path='storeSelledVideoAndImgs' component={StoreSelledVideoAndImgs}/>
  							<Route path='storeSelledAgentBroker' component={StoreSelledAgentBroker}/>
  							<Route path='storeSelledRecord' component={StoreSelledRecord}/>
  							<Route path='storeSelledDeal' component={StoreSelledDeal}/>
  						</Route>
          </Route>
          <Route path='communityManagement'>
            <IndexRoute component={CommunityManagement}/>
          </Route>
        </Route>
        <Route path='developmentDictionary'>
          <Route path='residentialArea'>
            <IndexRoute component={ResidentialArea} onEnter={judgeRouter} qxCode='BACKSTAGE_COMMUNITY'/>
            <Route path='createCell' component={CreateCell}/>
            <Route path='PhotoManagement' component={PhotoManagement}/>
            <Route path='loudongManagement' component={LoudongManagement}/>
            <Route path='positionMap' component={PositionMap}/>
            <Route path='watchHousingNumber' component={WatchHousingNumber}/>
          </Route>
          <Route path='shopsManagement'>
            <IndexRoute component={ShopsManagement} onEnter={judgeRouter} qxCode='BACKSTAGE_SHOP'/>
            <Route path='shopsLoudongManagement' component={ShopsLoudongManagement}/>
            <Route path='ShopsCreateShangPu' component={ShopsCreateShangPu}/>
            <Route path='shopsPosition' component={ShopsPosition}/>
            <Route path='shopsPhotoManagement' component={ShopsPhotoManagement}/>
            <Route path='watchHousingNumberShop' component={WatchHousingNumberShop}/>
          </Route>
          <Route path='officeBuilding'>
            <IndexRoute component={OfficeBuilding} onEnter={judgeRouter} qxCode='BACKSTAGE_OFFICEBUILDING'/>
            <Route path='OfficeLoudongManagement' component={OfficeLoudongManagement}/>
            <Route path='officePhotoManagement' component={OfficePhotoManagement}/>
            <Route path='officceCreateBuilding' component={OfficceCreateBuilding}/>
            <Route path='officePosition' component={OfficePosition}/>
            <Route path='watchHousingNumberOffice' component={WatchHousingNumberOffice}/>
          </Route>
        </Route>
        <Route path='/cityManagement'>
					<Route path='openCity'>
          	<IndexRoute  component={CityManagementIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_OPEN_CITY'/>
						<Route path='divisionManagement' component={DivisionManagement}/>
					</Route>
        </Route>
        <Route path='/labelManagement'>
          <Route path='labelConfiguration' component={LabelConfiguration} onEnter={judgeRouter} qxCode='BACKSTAGE_LABEL_CONFIGURATION'/>
        </Route>
        <Route path='/earningSetting'>
					<Route path='allEarningsMatching'>
          	<IndexRoute component={AllEarningsMatchingIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_PARTIES_EARNINGS_RATIO'/>
						<Route path='newCreateMatchProject' component={NewCreateMatchProject}/>
					</Route>
					<Route path='brokerageMatching'>
          	<IndexRoute component={BrokerageMatching} onEnter={judgeRouter} qxCode='BACKSTAGE_COMMISSION_RATIO_PLAN'/>
					</Route>
					<Route path='serviceMatching'>
          	<IndexRoute component={ServiceMatching} onEnter={judgeRouter} qxCode='BACKSTAGE_TRADING_SERVICEFEE_RATIO_PLAN'/>
					</Route>
        </Route>
				<Route path='/idManagement'>
					<Route path='brokerIdIndex'>
						<IndexRoute component={BrokerIdIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_BROKER'/>
						<Route path='brokerIdDetail' component={BrokerIdDetail}/>
					</Route>
					<Route path='advisorIdIndex'>
						<IndexRoute component={AdvisorIdIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_TUTOR'/>
						<Route path='advisorIdDetail' component={AdvisorIdDetail}/>
					</Route>
					<Route path='dealCenterIdIndex'>
						<IndexRoute component={DealCenterIdIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_TRADINGCENTER'/>
            <Route path='dealCenterIdDetail' component={DealCenterIdDetail}/>
            <Route path='newAccount' component={NewAccount}/>
					</Route>
					<Route path='agentIdIndex'>
						<IndexRoute component={AgentIdIndex} onEnter={judgeRouter} qxCode='BACKSTAGE_OPERATOR'/>
						<Route path='agentIdDetail' component={AgentIdDetail}/>
						<Route path='agentIdIndexNewAccount' component={AgentIdIndexNewAccount}/>
					</Route>
          <Route path='customerManagement'>
            <IndexRoute component={customerManagement} onEnter={judgeRouter} qxCode='BACKSTAGE_CUSTOMER'/>
          </Route>
				</Route>
        <Route path='/accountManagement'>
          <Route path='zhangHuGuanLiBroker'>
						<IndexRoute component={ZhangHuGuanLiBroker} onEnter={judgeRouter} qxCode='BACKSTAGE_BROKER_LEDGER'/>
            <Route path='zhangHuDetail' component={ZhangHuDetail}/>
            <Route path='brokerDetailed' component={BrokerDetailed}/>
					</Route>
          <Route path='accountTutor'>
            <IndexRoute component={AccountTutor} onEnter={judgeRouter} qxCode='BACKSTAGE_TUTOR_LEDGER'/>
            <Route path='accountTutorDetail' component={AccountTutorDetail}/>
            <Route path='tutorDetailed' component={TutorDetailed}/>
          </Route>
          <Route path='zhangHuGuanLiAgent'>
						<IndexRoute component={ZhangHuGuanLiAgent} onEnter={judgeRouter} qxCode='BACKSTAGE_OPERATOR_LEDGER'/>
            <Route path='accountAgentDetail' component={AccountAgentDetail}/>
            <Route path='agentDetailIncome' component={AgentDetailIncome}/>
            <Route path='agentSettlement' component={AgentSettlement}/>
					</Route>
          <Route path='accountDealCenter'>
            <IndexRoute component={AccountDealCenter} onEnter={judgeRouter} qxCode='BACKSTAGE_TRADINGCENTER_LEDGER'/>
            <Route path='accountDealCenterDetail' component={AccountDealCenterDetail}/>
            <Route path='dealCenterSettlement' component={DealCenterSettlement}/>
            <Route path='dealCenterDetailIncome' component={DealCenterDetailIncome}/>
          </Route>          
        </Route>
        <Route path='/adManagement/putManage'>
					<IndexRoute component={PutManage} onEnter={judgeRouter} qxCode='BACKSTAGE_PUT_MANAGEMENT'/>
        </Route>
        <Route path='/train/TrainContent'>
					<IndexRoute component={TrainContent} onEnter={judgeRouter} qxCode='BACKSTAGE_TRAIN'/>
          <Route path='trainRichTest' component={TrainRichTest}/>
					{/*<IndexRoute component={Test}/>*/}
        </Route>
        <Route path='/messageManagement'>
          <Route path='systemMessage'>
            <IndexRoute component={SystemMessage} onEnter={judgeRouter} qxCode='BACKSTAGE_SYSTEM_MESSAGE'/>
            {/*<IndexRoute component={Test}/>*/}
          </Route>
          <Route path='pushMessage'>
            <IndexRoute component={PushMessage} onEnter={judgeRouter} qxCode='BACKSTAGE_PUSH_MESSAGE'/>
          </Route>
        </Route>
        <Route path='contractManagement'>
          <Route path='dealContract'>
            {/*<IndexRoute component={DealContract}/>*/}
            <IndexRoute component={Test}/>
          </Route>
          <Route path='brokerSign' component={Test}/>
          <Route path='advisorSign' component={Test}/>
          <Route path='contractAgreementModulesManage'>
            <IndexRoute component={ContractAgreementModulesManage} onEnter={judgeRouter} qxCode='BACKSTAGE_CONTRACTAGREEMENT_MODULE_MANAGEMENT'/>
          </Route>
        </Route>
        <Route path='mentoringSetting'>
          <Route path='materialManage' component={Test}/>
          <Route path='promotePrentice' component={PromotePrentice} onEnter={judgeRouter} qxCode='BACKSTAGE_PUPIL_FINISH_REQUIREMENTS'/>
        </Route>
        <Route path='materialManage'>
          <Route path='articleMaterial' component={Test}/>
        </Route>
        <Route path='mentoringSetting'>
          <Route path='promoteMaster'component={PromoteMaster} onEnter={judgeRouter} qxCode='BACKSTAGE_PROMOTIONMASTER_REQUIREMENTS'/>
          <Route path='articleMaterial'component={Test}/>
        </Route>
        <Route path='accessManagement'>
          <Route path='jolesManagement'>
            <IndexRoute component={JolesManagement} onEnter={judgeRouter} qxCode='BACKSTAGE_ROLE_MANAGEMENT'/>
          </Route>
        </Route>
        <Route path='contentCheck'>
          <Route path='houseImgCheck'>
          <IndexRoute component={HouseImgCheck} onEnter={judgeRouter} qxCode='BACKSTAGE_HOUSINGPICTURE_AUDIT'/>
          <Route path='houseImgCheckDetail' component={HouseImgCheckDetail}/>
        </Route>
          <Route path='advisorRegister'>
            <IndexRoute component={AdvisorRegister} onEnter={judgeRouter} qxCode='BACKSTAGE_MENTOR_REGISTERED'/>
            <Route path='advisorRegisterDetail' component={AdvisorRegisterDetail}/>
          </Route>
          <Route path='brokerUploadCommunity'>
            <IndexRoute component={BrokerUploadCommunity} onEnter={judgeRouter} qxCode='BACKSTAGE_BROKER_UPLOADCOMMUNITY'/>
          </Route>
          <Route path='removeRelationApplication'>
            {/*<IndexRoute component={Test}/>*/}
            <IndexRoute component={RemoveRelationApplication} onEnter={judgeRouter} qxCode='BACKSTAGE_REMOVERELATIONSHIP_APPLY'/>
          <Route path='dealDetailMaster' component={DealDetailMaster}/>
          </Route>
          <Route path='brokerNameCertificate'>
            <IndexRoute component={BrokerNameCertificate}/>
            <Route path='authenticationDetail' component={AuthenticationDetail}/>
          </Route>
          <Route path='feedback'>
            <IndexRoute component={Feedback} onEnter={judgeRouter} qxCode='BACKSTAGE_OPINION_FEEDBACK'/>
          </Route>
          <Route path='applicationWithdrawal'>
            <IndexRoute component={ApplicationWithdrawal} onEnter={judgeRouter} qxCode='BACKSTAGE_WITHDRAWAL_TOAPPLY'/>
          </Route>
        </Route>
        <Route path='financeManagement'>
          <Route path='platformFund'>
            <IndexRoute component={PlatformFund} onEnter={judgeRouter} qxCode='BACKSTAGE_PLATFORM_MONEY'/>
            <Route path='platformFundDetail' component={PlatformFundDetail}/>
            <Route path='expenditureDetail' component={ExpenditureDetail}/>
          </Route>
          <Route path='platformEarningBalance'>
            <IndexRoute component={PlatformEarningBalance}/>
            <Route path='platformEarningBalanceDetail' component={PlatformEarningBalanceDetail}/>
            <Route path='platformSettlement' component={PlatformSettlement}/>
          </Route>
        </Route>
        <Route path='punishSetting'>
          {/*<IndexRoute component={Feedback}/>*/}
          <Route path='advisorPunish' component={Test}/>
          <Route path='brokerPunish' component={Test}/>
          <Route path='dealCenterPunish' component={Test}/>
          <IndexRoute component={Test}/>
        </Route>
        <Route path='enterpriseFramework'>
          <Route path='personnelManage'>
            <IndexRoute component={PersonnelManage} onEnter={judgeRouter} qxCode='BACKSTAGE_ENTERPRISE_ARCHITECTURE'/>
          </Route>
        </Route>
        <Route path='setting'>
          <Route path='modifyPassword' component={ModifyPassword} onEnter={judgeRouter} qxCode='BACKSTAGE_EDIT_PASSWORD'/>
        </Route>
        <Route path='apkVersion'>
          <Route path='apkManagement' component={ApkManagement} onEnter={judgeRouter} qxCode='BACKSTAGE_VERSIONS'/>
        </Route>
      </Route>
      <Route path='/login' component={Login}/>
    </Router>
  )
}

function checkLogin(nextState, replace){
  if(!sessionStorage.getItem('anzhu_login')){
    //未登录
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
//路由权限判断
function judgeRouter(nextState,replace){
  console.log('jinru');
  setTimeout(judgeRouterJurisdiction(nextState,replace),300);
}
function judgeRouterJurisdiction(nextState,replace){
  // console.log('nextState',nextState);
  const code = nextState.routes[nextState.routes.length-1].qxCode
  // console.log('code',code);
  if(!!code && judgeJurisdiction(code)){
    //具有权限
    console.log('具有权限');
  }else{
    //不具有权限推向首页
    console.log('不具有权限推向首页');
    replace({
      pathname: '/indexPage',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
