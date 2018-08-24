import React, { PropTypes } from 'react'
import BarCharts from '../BarCharts/BarCharts'
import './BarChartsWithTitle.css'

const BarChartsWithTitle = ({data,onlyRefs,type='bar',widths='500px',className,title,chartsColor}) => {
  return (
    <div className={`barChartsWithTitle ${className?className:''}`}>
      <BarCharts {...data} onlyRefs={onlyRefs} type={'bar'} widths={widths} chartsColor={chartsColor}/>
      <span className='barChartsWithTitle_title'>{title}</span>
    </div>
  )
}

export default BarChartsWithTitle
