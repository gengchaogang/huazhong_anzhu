import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Menu, Icon,Input,Tree,Row,Col,Form} from 'antd'
import PromptModal from '../../commons/View/PromptModal'
import DxPanel from '../../commons/components/DxPanel'
import DxLoadingShadow from '../../commons/UI/DxLoadingShadow'
import GaodeMap from '../../commons/components/GaodeMap'
import houseIcon from '../assets/images/house.svg'
const AMap=window.AMap;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

import  './IndexPage.css'

function IndexPage({indexPage,dispatch}) {
  const {
    teamData,
    searchValue,
    expandedKeys,
    autoExpandParent,
    promptObj,
    generateTeamData,
    treeMarkers,
  }=indexPage;


  const onExpand = (expandedKeys) => {
    dispatch({
      type:"indexPage/setStatePramas",
      payload:{
        expandedKeys,
        autoExpandParent: false,
      }
    })
  }

  const loop = (data,searchValue) => data&&data.map((item) => {
    const index = item.title.search(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title} oldTitle = {item.title}>
          {loop(item.children,searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={title} oldTitle = {item.title}/>;
  });

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"indexPage/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }

  const selectedTreeNode=(selectedIds, e)=>{

    // dispatch({
    //   type:"indexPage/setStatePramas",
    //   payload:{
    //     treeMarkers:[{position:['106.23','29.44'],content:"123456"}]
    //   }
    // })

  }

  const checkedTreeNode=(checkedKeys,e)=>{

  }
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const searchTeam = (e) => {
    const value = e.target.value;
    const expandedKeys = generateTeamData.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, teamData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type:"indexPage/setStatePramas",
      payload:{
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      }
    });

  }

  const onCancelCallBack=()=>{}
  const mapClick=()=>{}
  return (
    <div className='indexPage'>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <div className='bageOutSide'>

      <DxPanel title="经纪人位置分布">
        <Row>
          <Col span={8}>
            <Search  placeholder="搜索" onChange={searchTeam} />
            <Tree
              checkable = {true}
              onSelect = {selectedTreeNode}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck = {checkedTreeNode}
            >
              {loop(teamData,searchValue)}
            </Tree>
          </Col>
          <Col span={16}>
            {
              window.AMap?
              <GaodeMap isClick={false} mapClick={mapClick} width={700} height={600}
              initMarkers={[]} treeMarkers={treeMarkers}/>:
                <p style={{margin:"100px"}}>地图加载失败</p>
              }
          </Col>
        </Row>
      </DxPanel>
      </div>
    </div>
  );
}
IndexPage.propTypes = {
}
function mapStateToProps({indexPage}){return{indexPage}}
export default connect(mapStateToProps)(Form.create({})(IndexPage));
