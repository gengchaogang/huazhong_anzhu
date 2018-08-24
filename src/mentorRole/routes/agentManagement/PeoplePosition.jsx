import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Menu, Icon,Input,Tree,Row,Col,Form} from 'antd'
import PromptModal from '../../../commons/View/PromptModal'
import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import GaodeMap from '../../../commons/components/GaodeMap'
import houseIcon from '../../assets/images/house.svg'
const AMap=window.AMap;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import  './peoplePosition.css'

function PeoplePosition({peoplePosition,dispatch}) {
  const {
    Amap,
    infoWindow,
    teamData,
    searchValue,
    expandedKeys,
    autoExpandParent,
    promptObj,
    generateTeamData,
    treeMarkers,
    initMarkers,
    transactionCount,
    houseCount,
    customerCount,
  }=peoplePosition;

  const onExpand = (expandedKeys) => {
    dispatch({
      type:"peoplePosition/setStatePramas",
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
        <TreeNode
          key={item.key}
          id={item.id}
          isBroker={item.isBroker}
          title={title}
          oldTitle = {item.title}
          longitude={item.longitude}
          latitude={item.latitude}
          name={item.name}
          phoneNumber={item.phoneNumber}
          teamName={item.teamName}
          logo={item.logo}>
          {loop(item.children,searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.key}
      title={title}
      id={item.id}
      name={item.name}
      phoneNumber={item.phoneNumber}
      isBroker={item.isBroker}
      teamName={item.teamName}
      oldTitle = {item.title}
      longitude={item.longitude}
      latitude={item.latitude}
      logo={item.logo}
      />;
  });

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"peoplePosition/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const selectedTreeNode=(selectedIds, e)=>{
    const treeMarkers=[];
    const getMarker=e.selectedNodes;
    if(getMarker.length){
      getMarker.map((item,index)=>{
        if(item.props.longitude!==undefined&&item.props.latitude!==undefined){
          dispatch({
            type:"peoplePosition/getBrokerInfos",
            payload:{
              id:item.props.id,
              item:item,
              pointClick:false
            }
          })
          Amap.panTo([item.props.longitude,item.props.latitude]);
          infoWindow.open(Amap,[item.props.longitude,item.props.latitude]);
        }else{return}
      })
    }
  }

  const checkedTreeNode=(checkedKeys,e)=>{}
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
      type:"peoplePosition/setStatePramas",
      payload:{
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      }
    });

  }
  const onCancelCallBack=()=>{}
  const mapClick=()=>{}
  const markerClick=(e,map)=>{
    const pointClick=true;
    dispatch({
      type:"peoplePosition/getBrokerInfos",
      payload:{
        id:e.target.G.id,
        map:map,
        pointClick:pointClick,
        name:e.target.G.name,
        phoneNumber:e.target.G.phoneNumber,
        teamName:e.target.G.teamName,
        logo:e.target.G.logo,
      }
    })
      infoWindow.open(map,[e.lnglat.lng,e.lnglat.lat]);
  }
  const getMap=(Amap)=>{
    dispatch({
      type:'peoplePosition/saveMap',
      payload:{
        Amap:Amap
      }
    })
  }
  return (
    <div className='peoplePosition'>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <div className='bageOutSide'>
      <DxPanel title="经纪人位置分布">
        <Row>
          <div className="tree">
            <Search  placeholder="搜索" size="large" onChange={searchTeam} />
            <Tree
                checkable = {false}
                onSelect = {selectedTreeNode}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck = {checkedTreeNode}
            >
              {loop(teamData,searchValue)}
            </Tree>
          </div>
          <Col span={14} style={{marginLeft:"10px"}}>
            {
              window.AMap?
              <GaodeMap isClick={false} mapClick={mapClick} width={600} height={500}
              initMarkers={[]} treeMarkers={!!treeMarkers?treeMarkers:[]} markerClick={markerClick} getMap={getMap} isDefaultImg={true}/>:
                <p style={{margin:"100px"}}>地图加载失败</p>
              }
          </Col>
        </Row>
      </DxPanel>
      </div>
    </div>
  );
}

function mapStateToProps({peoplePosition}){return{peoplePosition}}
export default connect(mapStateToProps)(Form.create({})(PeoplePosition));
