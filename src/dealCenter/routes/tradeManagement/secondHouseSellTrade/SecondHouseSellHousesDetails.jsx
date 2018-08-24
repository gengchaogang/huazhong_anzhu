import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import PicList from '../../../../commons/UI/PicList'
import DxValueList from '../../../../commons/UI/DxValueList'

import './SecondHouseSellHousesDetails.css'

const SecondHouseSellHousesDetails=({dispatch,secondHouseSellHousesDetails})=>{
  const{
    houseId,//房源编号
    dataInfo,
    loading,
    promptObj,
  }=secondHouseSellHousesDetails;
  const houseData=!!dataInfo?JSON.parse(dataInfo):null;
  console.log('dataInfo:',dataInfo)
  console.log('houseData:',houseData)
  return (
    <div className='secondHouseSellHousesDetails'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellHousesDetails/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellHousesDetails/closePrompt'})}/>
      <DxPanel title='报成交房源'>
        <div>
          {!!houseData && <div>
            <DxValueList valueList={[{label:'房源编号',value:houseData.houseNumber}]}/>
            <DxValueList valueList={[{label:'房源视频/图片',value:''}]}/>
            <PicList picListData={houseData.housePics}/>
            <DxValueList valueList={dataInfo?houseData.houseBasicInfo:[]}/>
          </div>}
        </div>
      </DxPanel>
      <DxPanel title='委托协议'>
        <div>
          <div style={{display:'none'}}></div>
          {!!houseData && <PicList picListData={houseData.houseAgreements}/>}
        </div>
      </DxPanel>
      <div className='anzhua_button_bottom'>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellHousesDetails.propTypes = {
  secondHouseSellHousesDetails: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellHousesDetails}) {
  return {secondHouseSellHousesDetails}
}

export default connect(mapStateToProps)(SecondHouseSellHousesDetails);
