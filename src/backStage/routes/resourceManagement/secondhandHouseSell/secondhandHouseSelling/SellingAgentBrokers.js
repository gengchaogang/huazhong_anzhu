/**
 * Created by Jason on 2016/12/30.
 */
import React, { PropTypes } from 'react';
// import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AgentBrokers from '../../../../components/resourceManagement/secondhandHouseSell/AgentBrokers';
import SecondNavBar from './SecondNavBar'
function SellingAgentBrokers({ location, dispatch,  }) {
	//模拟数据
	const data = [];
	for (let i = 0; i < 4; i++) {
		data.push({
			key: i,
			xh: i,
			jjr: '阿森哥',
			lxfs:'13548996357',
			totalMount:'500万',
			hzsx:'10000元',
			hxmd:'船舶大院公房社区 田字格户型 明厨明卫 中间楼层采光好！此房是南北向田字格户型三居室，两南一北，主卧室带阳台朝南，次卧朝南，小卧室朝北，厨房卫生间朝北，明厨明卫，中间楼层小区中间位置，安静不临街！',
		});
	}
	data.unshift({
		key: 'fuck',
		xh: 'fuck',
		jjr: '你大爷',
		lxfs:'88888888888',
		totalMount:'500万',
		hzsx:'10000元',
		hxmd:'船舶大院公房社区 田字格户型 明厨明卫 中间楼层采光好！此房是南北向田字格户型三居室，两南一北，主卧室带阳台朝南，次卧朝南，小卧室朝北，厨房卫生间朝北，明厨明卫，中间楼层小区中间位置，安静不临街！',
		publisher:true,
		chengjiao:true,

	});
	const AgentBrokersProps={
		data,
	};
	return (
		<div>
			<SecondNavBar/>
			<AgentBrokers {...AgentBrokersProps}/>
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

export default connect(mapStateToProps)(SellingAgentBrokers);
