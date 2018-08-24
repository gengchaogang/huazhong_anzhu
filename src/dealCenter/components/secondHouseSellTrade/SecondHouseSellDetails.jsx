import React, { PropTypes } from 'react';
import ReportBroker from '../../../commons/UI/tradeItems/ReportBroker'
import './SecondHouseSellDetails.css'

export default function SecondHouseSellDetails({className,JSONData}){
  const {reportBrokerData}=(!!JSONData?JSON.parse(JSONData):{});
  return(
    <div className={`secondHouseSellDetails ${!!className && className}`}>
      {!!reportBrokerData && <ReportBroker {...reportBrokerData}/>}
    </div>
  )
}
