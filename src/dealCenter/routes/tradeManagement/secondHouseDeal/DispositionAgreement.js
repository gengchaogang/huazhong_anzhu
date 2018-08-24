import React from 'react'
import {Button} from 'antd'
import SelectPicture from '../../../../commons/UI/SelectPicture'
import DxPanel from '../../../../commons/components/DxPanel'
function DispositionAgreement(){
  return (
    <DxPanel title="请上传意向合同和协议">
      <SelectPicture
        size={2}
        total={10}
        // async
        callback={()=>alert('save ok!')}
       />
       <div>
         <Button type="primary" size="large">保存</Button>
       </div>
    </DxPanel>
  )
}

export default DispositionAgreement
