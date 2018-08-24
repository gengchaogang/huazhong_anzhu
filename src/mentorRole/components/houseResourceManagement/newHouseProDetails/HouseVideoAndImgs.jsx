import React,{ PropTypes }from 'react'
import {Row,Col,Button,Icon} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import touxiangDefult from '../../../assets/images/morentouinfg.png'
function HouseState(props){
  const {
    initData,
    adoptImgs,
  }=props;
  const handleClick=()=>{
    adoptImgs()
  }
  return(
    <DxPanel title="经纪人上传">
      {
        initData.map((item,index)=>{
          const imgs=item.images;
          const resultImgs=imgs.map((item,index)=>{
            return(
              <img width="150px" height='120px' src={item} key={`${index}`}/>
            )
          })
          return(
            <div className="upload" key={`${index}a`}>
              <Row className="title" key={`${index}b`}>
                <Col span={2} key={`${index}c`}>
                  <img width="50px" height='50px' style={{borderRadius:'50px'}} src={item.agentPic||touxiangDefult} key={`${index}d`}/>
                </Col>
                <Col span={2} key={`${index}e`}>{item.userName}</Col>
                <Col span={2} key={`${index}f`}>上传{item.picNumber}张</Col>
                <Col span={4} key={`${index}g`}>上传时间：{item.uploadTime}</Col>
                {/*<Col key={`${index}h`}>
                  {item.isAdopt?<Button type="primary"><Icon type="check" />已采纳</Button>:<Button type="primary" onClick={handleClick}>采纳视频图片</Button>}
                </Col>*/}
              </Row>
              <div className="imgs" key={`${index}t`}>
                  {resultImgs}
              </div>
            </div>
          )
        })
      }
    </DxPanel>
  )
}

HouseState.propTypes = {
  initData: PropTypes.array.isRequired,
  adoptImgs:PropTypes.func.isRequired,
};
export default HouseState
