import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import  './Test.css'

function Test() {
  return (
    <div style={{textAlign:'center',fontSize:'24px'}}>
      页面正在建设中...
    </div>
  );
}

Test.propTypes = {
}

export default connect()(Test)
