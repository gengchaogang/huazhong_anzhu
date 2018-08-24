import React from 'react'
import {
  Button,
} from 'antd'

import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import SelectPicture from '../../../../commons/UI/SelectPicture'
import DxPanel from '../../../../commons/components/DxPanel'
function RakeOffPayAgreement({secondDeal,dispatch}){


  return (
    <DxPanel title="请上传意向合同或协议">
      <SelectPicture/>
      <Button type="primary" size="large" onClick={()=>alert('保存成功')}>保存</Button>
      <Button type="ghost" onClick={
        ()=>dispatch(routerRedux.goBack())
      } size="large">返回</Button>
    </DxPanel>
  );
}

function mapStateToProps({secondDeal}){
  return {secondDeal};
}

export default connect(mapStateToProps)(RakeOffPayAgreement);
