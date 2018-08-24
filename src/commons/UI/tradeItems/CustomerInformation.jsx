import React from 'react'
import './CustomerInformation.css'
import DxPanel from '../../components/DxPanel'
function CustomerInformation({mainInformationData,title}){
  return (
    <DxPanel  title={!!title?title:'客户信息'}>
      {mainInformationData.map((item,index)=>(
        <div key={`customer_${index}`}>
          <span>{`${item.label}：`}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </DxPanel>
  );
}
export default CustomerInformation;
