/**
 * Created by Jason on 2017/1/3.
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Tag } from 'antd';
import HousingDetails from '../../../../commons/components/HousingDetails'
function HouseInfo({location}) {
	//模拟房源信息数据
	const HousingDetailsProps={
		housingDetailData:location.state.housingDetailData
	};


	return (
		<div>
			<HousingDetails {...HousingDetailsProps}/>
		</div>
	);
}

// HouseInfo.propTypes = {
// 	data: PropTypes.array,
// };
function mapStateToProps({  }) {
	return {  };
}
export default connect(mapStateToProps)(HouseInfo);
