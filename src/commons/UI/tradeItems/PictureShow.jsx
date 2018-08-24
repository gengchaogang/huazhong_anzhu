import React from 'react'
import DxPanel from '../../components/DxPanel'
import './PictureShow.css'

function PictureShow({picArr,title}){
  return (
    <DxPanel title={!!title?title:'电商收据/意向合同'}>
      <div>
        {picArr.map((value,index)=>(
          <span key={`picArr_${index}`} style={{backgroundImage:`URL(${value})`}}
            className='pictureShow'>
          </span>
        ))}
      </div>
    </DxPanel>
  );
}

export default PictureShow;
