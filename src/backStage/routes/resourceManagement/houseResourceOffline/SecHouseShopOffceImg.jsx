import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'
import touxiangDefult from '../../../assets/images/touxiangDefult.png'
import './SecHouseShopOffceHousingDetails.css'


export default function SecHouseShopOffceImg({houseBaseInfo}){
  const maps=new Map();
  if(houseBaseInfo && houseBaseInfo.outFiles.length!=0){
    houseBaseInfo.outFiles.map((item,index)=>{
      if(maps.has(item.addUserName)){
        maps.get(item.addUserName).path.push(item)
      }else{
        maps.set(item.addUserName,{
          addUserName:item.addUserName,
          path:[item],
        })
      }
    })
  }
  const tableDatamaps=[...maps.values()];
  return(
    <DxPanel title='经纪人上传'>
      <div>
        {!!houseBaseInfo &&<div>
          {tableDatamaps.length!=0 &&tableDatamaps.map((item,index)=>(
            <div key={`item_${index}`}>
              <div className='line'>
                <div className='flex'>
                  <span className='outFilesLogo' style={{backgroundImage:`URL(${(item.path.length!=0 && item.path[0].addUserLogo)||touxiangDefult})`}}></span>
                  <span>{item.addUserName}</span>
                  <span>上传：{item.path.length} 张</span>
                  <span>上传时间：{item.path!=0 && item.path[0].createDate}</span>
                </div>
              </div>
              {item.path!=0 && item.path.map((img,ind)=>(
                <span key={`img${ind}`} className='outFiles' style={{backgroundImage:`URL(${img.path})`}}></span>
              ))}
            </div>
          ))}
        </div>}
      </div>
    </DxPanel>
  )
}
