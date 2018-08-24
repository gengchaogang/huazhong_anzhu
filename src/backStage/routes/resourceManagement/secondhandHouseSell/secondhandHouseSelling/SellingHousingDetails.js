/**
 * Created by Jason on 2016/12/30.
 */
import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import HousingDetails from '../../../../../commons/components/HousingDetails'
import SecondNavBar from './SecondNavBar'
// import './housingDetails.css';
import { Button } from 'antd';
import TitleBar from '../../../../../commons/UI/TitleBar';
import UnloadHouseModal from '../../../../components/resourceManagement/secondhandHouseSell/housingDetails/UnloadHouseModal';
function SellingHousingDetails({ location, dispatch, housingDetails }) {
	const { modalVisible, submitLoading }=housingDetails;

	const BackToIndex=()=>{
		dispatch(routerRedux.push('resourceManagement/secondhandHouseSell'));
	};
	const changeVisible=(bool)=>{
		dispatch({
			type:'housingDetails/changeState',
			payload:{
				modalVisible:bool
			}
		});
	};
	const UnloadHouseModalProps={
		modalVisible,
		submitLoading,

		changeVisible,
		changeSubmitLoading:(bool)=>{
			dispatch({
				type:'housingDetails/changeState',
				payload:{
					submitLoading:bool
				}
			});
		},
	};
	const HousingDetailsProps={
		housingDetailData:{
			fyzt:'在售',
			gpsj:'2016-12-12',
			fybh:'332005469041',
			fybt:'远洋山水 2室1厅 85㎡',
			szxq:'远洋山水',
			szdq:'北京市-海淀区',
			fyhx:'2室1厅',
			jzmj:'85㎡',
			tlmj:'80㎡',
			totalMount:'300万',
			zcdk:'支持',
			zxqk:'精装修',
			fwcx:'南',
			szlc:'高层',
			fynd:'2016',
			fyts:'满五唯一    学区房    近地铁',
		},
	};
	return (
		<div className='housingDetails'>
			<SecondNavBar/>
			<HousingDetails {...HousingDetailsProps}/>
			<div style={{margin:'10px 0'}}>
				<UnloadHouseModal {...UnloadHouseModalProps}/>
				<Button style={{marginLeft:'0px'}} type="primary" onClick={()=>changeVisible(true)}>下架</Button>
				<Button type="primary" onClick={BackToIndex}>返回</Button>
			</div>
		</div>
	);
}

// NewHousePro.propTypes = {
// users: PropTypes.object,
// location: PropTypes.object,
// dispatch: PropTypes.func,
// };
function mapStateToProps({ housingDetails }) {
	return { housingDetails }
}

export default connect(mapStateToProps)(SellingHousingDetails);
