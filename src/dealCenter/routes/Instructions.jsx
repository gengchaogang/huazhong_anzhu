import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import { Badge,Card,Row,Col} from 'antd'

import DxPanel from '../../commons/components/DxPanel'
import './Instructions.css'
function Instructions({location,dispatch,instructions}) {
  return (
    <div className='anhzu_msg'>
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({instructions}) {
  return {instructions};
}

export default connect(mapStateToProps)(Instructions)
