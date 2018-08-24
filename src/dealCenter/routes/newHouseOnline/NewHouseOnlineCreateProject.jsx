import React from 'react'
import {connect} from 'dva'
// import moment from 'moment';
import {Table,Button,Tabs} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
const TabPane = Tabs.TabPane;

function NewHouseOnlineCreateProject({dispatch}){
  return (
    <div>
      newHouseOnlineCreateProject
    </div>
  )
}
function mapStateToProps({newHouseOnlineCreateProject}){
  return {newHouseOnlineCreateProject}
}
export default connect(mapStateToProps)(NewHouseOnlineCreateProject);
