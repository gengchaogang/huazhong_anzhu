import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import SecondNavBar from '../secondhandHouseSelling/SecondNavBar'
import HousingDetails from '../../../../../commons/components/HousingDetails'
import { Button } from 'antd';
function SelledHousedDetails({ location, dispatch }) {

	const BackToIndex=()=>{
		dispatch(routerRedux.push('resourceManagement/secondhandHouseSell'));
	};
	const HousingDetailsProps={
		housingDetailData:{
			fyzt:'已售',
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
				<Button style={{borderColor:'#43B38D', backgroundColor:'#43B38D'}} type="primary" onClick={BackToIndex}>返回</Button>
			</div>
		</div>
	);
}

// NewHousePro.propTypes = {
// users: PropTypes.object,
// location: PropTypes.object,
// dispatch: PropTypes.func,
// };
function mapStateToProps({  }) {
	return {  }
}

export default connect(mapStateToProps)(SelledHousedDetails);
