import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table } from 'antd';
function NewHousePro({ location, dispatch }) {
	return (
		<div>
			<DetailsNavBar/>
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

export default connect(mapStateToProps)(NewHousePro);
