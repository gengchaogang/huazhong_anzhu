import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Modal,Cascader,Row,Col} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './HouseImgCheckDetail.css'
function HouseImgCheckDetail({dispatch,houseImgCheckDetail}) {
  const {
    promptObj,
    initData,
    houseId,
    auditedPicModel,
  }=houseImgCheckDetail;
  const handleBack=()=>{
    dispatch(routerRedux.push({
      pathname:"contentCheck/houseImgCheck"
    }))
  }
  const Adopt=(houseId,userId)=>{
    dispatch({
      type:'houseImgCheckDetail/Adopt',
      payload:{
        houseId:houseId,
        addUserId:userId,
      }
    })
  }
  return (
    <div>
      <DxPanel title='最新上传'>
        <div>
          {!!initData && initData.map((item,index)=>(
            <div key={`index_${index}`}>
              <div>
                <span className='picShowAgent'
                  style={{backgroundImage:`URL(${item.addUserLogo})`}}>
                </span>
                <div className='picShowword'>
                  <span>{item.addUserName}</span>
                  <span>上传{item.picListPath.length}张</span>
                  <span>上传时间：{item.createDate}</span>
                  
                  <Button type='primary' onClick={()=>{Adopt(houseId,item.addUserId)}}>
                    采纳视频图片
                  </Button>
                </div>
              </div>
              <div>
                {item.picListPath.length!=0 && item.picListPath.map((value,keys)=>(
                  <span key={`values_${keys}`} className='picShowAdopt'
                    style={{backgroundImage:`URL(${value})`}}>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DxPanel>
      <DxPanel title='现有图片'>
        <div>
          {!!auditedPicModel.addUserId &&
            <div>
              <span className='picShowAgent'
                style={{backgroundImage:`URL(${auditedPicModel.addUserLogo})`}}>
              </span>
              <div className='picShowword'>
                <span>{auditedPicModel.addUserName}</span>
                <span>上传{auditedPicModel.picListPath.length}张</span>
                <span>上传时间{auditedPicModel.createDate}</span>
                <Button type='ghost' disabled>已采纳</Button>
              </div>
              <div>
                {auditedPicModel.picListPath.length!=0 && auditedPicModel.picListPath.map((value,keys)=>(
                  <span key={`values_${keys}`} className='picShowAdopt'
                    style={{backgroundImage:`URL(${value})`}}>
                  </span>
                ))}
              </div>
            </div>
          }
        </div>

      </DxPanel>
      <Button type='primary' onClick={handleBack}>返回</Button>
    </div>
  );
}

function mapStateToProps({houseImgCheckDetail}) {
  return {houseImgCheckDetail}
}

export default connect(mapStateToProps)(HouseImgCheckDetail);
