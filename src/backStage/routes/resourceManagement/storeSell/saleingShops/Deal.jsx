import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table,Modal,Checkbox,Input } from 'antd';
import SearchInput from '../../../../../commons/View/SearchInput'
import DxPanel from '../../../../../commons/components/DxPanel'
import './LookRecord.css'
import textPic from '../../../../assets/yay.jpg'
import JumpButton from './JumpButton'

function Deal({dispatch }) {
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }

  return (
    <div>
      <JumpButton/>
    </div>
  );
}

function mapStateToProps({ deal }) {
  return { deal }
}

export default connect(mapStateToProps)(Deal);
