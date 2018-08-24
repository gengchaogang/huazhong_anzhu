import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import './AuthenticationDetail.css'
const TabPane = Tabs.TabPane;
function AuthenticationDetail({dispatch,authenticationDetail}) {
  // const {}=authenticationDetail;

  return (
    <div>
      <DxPanel title='审核结果'>
        <p>审核结果：不一致</p>
        <p>审核时间：</p>
        <p>审核机构：</p>
      </DxPanel>
      <DxPanel title='基本信息'>
        <p>审核结果：不一致</p>
        <p>审核时间：</p>
        <p>审核机构：</p>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({authenticationDetail}) {
  return {authenticationDetail}
}

export default connect(mapStateToProps)(AuthenticationDetail);
