import React,{ PropTypes }from 'react'
import {Row,Col,Button,Icon} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import touxiangDefult from '../../../assets/images/touxiangDefult.png'
import './HouseVideoAndImgs.css'
function HouseState(props){
  const {
    initData,
    adoptImgs,
  }=props;
  console.log(initData,adoptImgs);
  const handleClick=()=>{
    adoptImgs()
  }
  const maps=new Map();
  if(initData.length!=0){
    initData.map((item,index)=>{
      if(maps.has(item.userName)){
        maps.get(item.userName).path.push(item)
      }else{
        maps.set(item.userName,{
          userName:item.userName,
          path:[item],
        })
      }
    })
  }
  const tableDatamaps=[...maps.values()];
  console.log(tableDatamaps,'tableDatamaps');
  return(
    <DxPanel title="经纪人上传">
      <div>
        <div>
          {tableDatamaps.length!=0 &&tableDatamaps.map((item,index)=>(
            <div key={`item_${index}`}>
              <div className='line'>
                <div className='flex'>
                  <span className='outFilesLogo' style={{backgroundImage:`URL(${(item.path.length!=0 && item.path[0].agentPic)||touxiangDefult})`}}></span>
                  <span>{item.userName}</span>
                  <span>上传：{item.path.length} 张</span>
                  <span>上传时间：{item.path!=0 && item.path[0].uploadTime}</span>
                </div>
              </div>
              {item.path!=0 && item.path.map((img,ind)=>(
                <span key={`img${ind}`} className='outFiles' style={{backgroundImage:`URL(${img.images})`}}></span>
              ))}
            </div>
          ))}
        </div>
      {/*
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

              </Row>
              <div className="imgs" key={`${index}t`}>
                  {resultImgs}
              </div>
            </div>
          )
        })
      */}
    </div>
    </DxPanel>
  )
}

HouseState.propTypes = {
  initData: PropTypes.array.isRequired,
  adoptImgs:PropTypes.func.isRequired,
};
export default HouseState
