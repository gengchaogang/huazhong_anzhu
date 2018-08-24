/**
 * Created by Jason on 2017/1/4.
 */

import React, { PropTypes } from 'react'
import {Modal} from 'antd';
function EarnestRefund({}){
	return(
		<Modal
			visible={true}
			maskClosable={false}
			title="二手房--意向金退款申请"
			{/*onCancel={()=>{changeVisible(false)}}*/}
			footer={[
				<Button key="back" type="ghost" size="large" onClick={()=>{changeVisible(false)}}>关闭</Button>,
			]}
		>
		</Modal>
	)
}
// EarnestRefund.propTypes={
// 	brokerName:PropTypes.string.isRequired,
// 	brokerNumber:PropTypes.number.isRequired,
// }
export default EarnestRefund;
