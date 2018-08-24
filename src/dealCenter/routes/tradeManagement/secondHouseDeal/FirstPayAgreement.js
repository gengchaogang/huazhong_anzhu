import React from 'react'
import {Button} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'

import SelectPicture from '../../../../commons/UI/SelectPicture'
import DxPanel from '../../../../commons/components/DxPanel'
function FirstPayAgreement({secondDeal,dispatch}){
  const goBack=()=>{dispatch(routerRedux.goBack())}
  return (
    <DxPanel title="请上传首付款协议/合同">
      <SelectPicture
        size={2}
        total={10}
      />
      <Button type="primary" onClick={()=>alert('保存成功')} size="large">保存</Button>
      <Button type="ghost" onClick={goBack} size="large">返回</Button>

    </DxPanel>
  );
}

function mapStateToProps({secondDeal}){
  return {secondDeal};
}

export default connect(mapStateToProps)(FirstPayAgreement)
