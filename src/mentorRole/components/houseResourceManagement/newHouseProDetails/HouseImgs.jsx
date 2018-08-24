import React,{ PropTypes }from 'react'
import {Row,Col} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'

function HouseImgs(props){
  const {
    pics,
  }=props
  return(
    <div>
      <DxPanel title="委托协议">
        <Row>
          <Col>
            {!!pics&&!!pics.commissionContractPicture&&pics.commissionContractPicture.length!==0?
              pics.commissionContractPicture.map((item,index)=>{
                return(
                  <img width="150px" height='120px' key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="房产证">
        <Row>
          <Col>
            {!!pics&&!!pics.propertyPicture&&pics.propertyPicture.length!==0?
              pics.propertyPicture.map((item,index)=>{
                return(
                  <img width="150px" height='120px' key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="业主身份证">
        <Row>
          <Col>
            {!!pics&&!!pics.idPicture&&pics.idPicture.length!==0?
              pics.idPicture.map((item,index)=>{
                return(
                  <img width="150px" height='120px' key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
    </div>
  )
}

HouseImgs.propTypes = {
  pics: PropTypes.object.isRequired,
};
export default HouseImgs
