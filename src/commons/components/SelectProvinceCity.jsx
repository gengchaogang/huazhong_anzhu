import React, { PropTypes } from 'react'
import { Cascader } from 'antd'
import {
  getAllProvinceAndCityArrFromSession,
} from '../utils/currencyFunction'
import './SelectProvinceCity.css'



const SelectProvinceCity = (props) => {
  return (
    <Cascader options={getAllProvinceAndCityArrFromSession()} {...props}/>
  )
}


export default SelectProvinceCity
