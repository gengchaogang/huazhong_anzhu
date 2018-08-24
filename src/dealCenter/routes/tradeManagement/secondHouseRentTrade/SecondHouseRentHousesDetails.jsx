import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import DxValueList from '../../../../commons/UI/DxValueList'
import PicList from '../../../../commons/UI/PicList'

import './SecondHouseRentHousesDetails.css'

const SecondHouseRentHousesDetails=({dispatch,secondHouseRentHousesDetails})=>{
  const{
    houseId,//房源编号
    dataInfo,
    loading,
    promptObj,
  }=secondHouseRentHousesDetails;
  const houseData=!!dataInfo?JSON.parse(dataInfo):null;
  
  return (
    <div className='secondHouseRentHousesDetails'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentHousesDetails/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentHousesDetails/closePrompt'})}/>
      <DxPanel title='房源视频/图片'>
        <div>
          {!!houseData && <div>
            <DxValueList valueList={[{label:'房源编号',value:houseData.houseNumber}]}/>
            <DxValueList valueList={[{label:'房源视频/图片',value:''}]}/>
            <PicList picListData={houseData.housePics}/>
            <DxValueList valueList={dataInfo?houseData.houseBasicInfo:[]}/>
          </div>}
        </div>
      </DxPanel>
      {
//        houseData&&houseData.saleWay=='出租'&&houseData.resourcesType=='住宅'?
//        <DxPanel title='房源配置'>
//          <div className="imgContainer">
//          {
//            //!!houseData && <PicList picListData={configurationArr}/>
//          }
//            {
//              configurationArr.map((item,index)=>{
//                console.log('item>>>>>>>>>>>>>',item)
//                return (
//                  <div key={index} className="imgItem">
//                    <img className="imgPic" src={item.src}/>
//                    <p className="imgTitle">{item.title}</p>
//                  </div>
//                )
//              })
//            }
//          </div>
//        </DxPanel>:null
      }
      <DxPanel title='房东信息'>
        <div>
          {!!houseData && <DxValueList valueList={dataInfo?houseData.ownerInfoFromData:[]}/>}
        </div>
      </DxPanel>
      <DxPanel title='房东信息'>
        <div>
          {!!houseData && <PicList picListData={houseData.houseAgreements}/>}
        </div>
      </DxPanel>
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentHousesDetails.propTypes = {
  secondHouseRentHousesDetails: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentHousesDetails}) {
  return {secondHouseRentHousesDetails}
}

export default connect(mapStateToProps)(SecondHouseRentHousesDetails);
