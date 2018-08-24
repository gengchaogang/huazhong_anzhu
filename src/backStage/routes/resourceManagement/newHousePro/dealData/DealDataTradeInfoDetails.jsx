import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import {Button} from 'antd';

import DxLoadingShadow from '../../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../../commons/View/PromptModal'
import NewHouseTradeDetails from '../../../../components/resourceManagement/newHousePro/newHouseProIndex/NewHouseTradeDetails'
import NHTradeInfo from '../../../../../commons/components/NHTradeInfo'

import './dealDataTradeInfoDetails.css'
function DealDataTradeInfoDetails({dealDataTradeInfoDetails,dispatch}){
  const {
    groupKey,
    loading,
    trackJSON,
    promptObj,
  }=dealDataTradeInfoDetails;
  // console.log(trackJSON,'trackJSONtrackJSON>>>>>>>>>>>>>');
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  return(
    <div className='newHouseTradeInfoDetails'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'newHouseTradeInfoDetails/onlyClosePrompt'})} onCancel={()=>dispatch({type:'newHouseTradeInfoDetails/onlyClosePrompt'})}/>
      {/*!!trackJSON && <NewHouseTradeDetails trackJSON={trackJSON}/>*/}
      {!!trackJSON && <NHTradeInfo trackJSON={trackJSON}/>}
      <div style={{textAlign:'right'}}>
        <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}
DealDataTradeInfoDetails.propTypes={

}
function mapStateToProps({dealDataTradeInfoDetails}) {
  return {dealDataTradeInfoDetails}
}
export default connect(mapStateToProps)(DealDataTradeInfoDetails)
