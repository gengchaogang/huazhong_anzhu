import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

import {Button} from 'antd';

import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../commons/View/PromptModal'
import NHTradeInfo from '../../../../commons/components/NHTradeInfo'
// import NewHouseTradeDetails from '../../../components/NewHouseTrade/NewHouseTradeDetails'

import './NewHouseTradeInfoDetails.css'
function NewHouseTradeInfoDetails({newHouseTradeInfoDetails,dispatch}){
  const {
    groupKey,
    loading,
    trackJSON,
    promptObj,
    projectInfo,
  }=newHouseTradeInfoDetails;
  const trackData=!!trackJSON?JSON.parse(trackJSON):{};
  return(
    <div className='newHouseTradeInfoDetails'>
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'newHouseTradeInfoDetails/onlyClosePrompt'})} onCancel={()=>dispatch({type:'newHouseTradeInfoDetails/onlyClosePrompt'})}/>
      {/*!!trackJSON && <NewHouseTradeDetails trackJSON={trackJSON} projectInfo={projectInfo}/>*/}
      {!!trackJSON && <NHTradeInfo trackJSON={trackJSON} projectInfo={projectInfo}/>}
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}
NewHouseTradeInfoDetails.propTypes={

}
function mapStateToProps({newHouseTradeInfoDetails}) {
  return {newHouseTradeInfoDetails}
}
export default connect(mapStateToProps)(NewHouseTradeInfoDetails)
