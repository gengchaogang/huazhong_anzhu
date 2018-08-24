import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './NewHouseImg.css'


export default function NewHouseMangement({mangementSource}){
  console.log(mangementSource,'mangementSource');

  return(
    <DxPanel title='项目室内图户型图'>
      <div>
        {mangementSource.length!=0 && mangementSource.map((item,index)=>(
          <div className='line' key={`item_${index}`}>
            <div className='flex'>
              {!!item.pictures[0] &&
              <span className='showImg' style={{backgroundImage:`URL(${item.pictures[0].path})`}}></span>}
              <div className='flexCol'>
                <span>{item.name}</span>
                <span>
                  {item.characteristics.length!=0 && item.characteristics.map((data,number)=>(
                      <span key={`index_${number}`}>{data.name}</span>
                  ))}
                </span>
                <div>
                  <span>居室：{item.houseRoom}室{item.livingRoom}厅{item.cookRoom}厨{item.bathRoom}卫</span>
                  <span> 建筑面积：{item.floorAreaStart+'~'+item.floorAreaEnd}</span>
                </div>
                <div>
                  <span>参考均价：{item.referencePrice}</span>
                  <span>参考总价：{item.referenceTotalPriceStart+'~'+item.referenceTotalPriceEnd}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DxPanel>
  )
}
