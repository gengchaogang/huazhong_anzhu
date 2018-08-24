import React from 'react'
import './IntentionItem.css'
import DxPanel from '../../components/DxPanel'
import touxiang from '../../assets/images/touxiang.png'
import './ReportBroker.css'
//mainBrokerData 格式数组
//haspic 值为bool
//picurl 值为图片的路径
function ReportBroker({mainBrokerData,hasPic,title,picUrl,footer,header,flex}){
  const showType=!!picUrl?picUrl:'';
  // console.log(showType,'showType');
  return (
    <DxPanel title={!!title?title:'报备经纪人'} className={!!flex?'flex_panel':''}>
      <div className='reportBroker_content'>
        {!!(hasPic==true) && <div className='broker_content'>
          {!! header &&<div className='broker_header'>{header}</div>}
          <div className='reportBroker_pic'>
            <div className='colums-broker' style={{backgroundImage:`URL(${showType.length === 0?touxiang:showType})`}}></div>
          </div>
          <div className='broker_body'>
            {mainBrokerData.map((item,index)=>(
              <div key={`customer_${index}`}>
                <span>{`${item.label}：`}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          {!! footer &&<div className='broker_footer'>{footer}</div>}
        </div>}
        {!!(hasPic==false) && <div>
          {!! header &&<div>{header}</div>}
          {mainBrokerData.map((item,index)=>(
            <div key={`customer_${index}`}>
              <span>{`${item.label}：`}</span>
              <span>{item.value}</span>
            </div>
          ))}
          {!! footer &&<div>{footer}</div>}
        </div>}
      </div>
    </DxPanel>
  );
}

export default ReportBroker;
