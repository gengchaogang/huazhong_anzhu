import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button} from 'antd';
import './JumpButton.css'
function JumpButton({dispatch }) {
  const routeButton=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/resourceManagement/storeSell/${path}`,
      }));
    }
  }

  return (
    <div className='routeButton'>
      <Button onClick={()=>routeButton('availabilityDetails')}>房源详情</Button>
      <Button onClick={()=>routeButton('videoImage')}>视频图片</Button>
      <Button onClick={()=>routeButton('agentBroker')}>代理经纪人</Button>
      <Button onClick={()=>routeButton('lookRecord')}>带看记录</Button>
      <Button onClick={()=>routeButton('deal')}>成交</Button>
    </div>
  );
}

function mapStateToProps({ jumpButton }) {
  return { jumpButton }
}

export default connect(mapStateToProps)(JumpButton);
