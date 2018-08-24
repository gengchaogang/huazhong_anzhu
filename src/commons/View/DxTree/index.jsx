import React, { PropTypes } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import './index.css'

export default class DxTree extends React.Component{
  constructor(props){
    super(props);
  }
  onDragEnter=(info)=>{
    if(!!this.props.drag.onDragEnter){
      this.props.drag.onDragEnter(info);
    }
  }
  onDrop=(info)=>{
    if(!!this.props.drag.onDrop){
      this.props.drag.onDrop(info);
    }
  }
  getRandomKey=()=>{return ''+new Date().getTime()+(Math.floor(Math.random()*900000)+100000)}
  creatChildNode=(childNodeArr)=>childNodeArr.map((item)=>{
    if(!("key" in item)){
      // console.log("this.getRandomKey()",this.getRandomKey());
      item.key = `node_+${this.getRandomKey()}`;
    }
    if(item.children && item.children.length){
      return <TreeNode {...item} >{this.creatChildNode(item.children)}</TreeNode>;
    }else {
      return <TreeNode {...item} ></TreeNode>;
    }
    // if(item.children && item.children.length){
    //   return <TreeNode key={`node_+${item.id}`} title={item.title}>{this.creatChildNode(item.children)}</TreeNode>;
    // }else{
    //   return <TreeNode key={`node_+${item.id}`} title={item.title} isLeaf={item.isLeaf}/>
    // }
  })
  render() {
    const{
      treeData,
      drag,
      loadData,
      defaultExpandedKeys,
      defaultExpandAll,
      autoExpandParent,
      treeProps,
    }=this.props;
    return (
      <Tree
        defaultExpandedKeys={defaultExpandedKeys}
        draggable={!!drag?drag.draggable:false}
        defaultExpandAll={!!defaultExpandAll?defaultExpandAll:false}
        autoExpandParent={!!autoExpandParent?autoExpandParent:false}
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        loadData={!!loadData?loadData:null}

        {...treeProps}
      >
        {this.creatChildNode(treeData)}
      </Tree>
    );
  }
}
DxTree.propTypes={
  treeData: PropTypes.arrayOf(
       PropTypes.shape({
           title: PropTypes.string.isRequired,
           id: PropTypes.string.isRequired,
          //  preId: PropTypes.string.isRequired,
           children: PropTypes.array,
       })
   ).isRequired,
   drag:PropTypes.shape({
       draggable: PropTypes.bool.isRequired,
       onDrop:PropTypes.func.isRequired,
       onDragEnter:PropTypes.func,
   }),
   loadData: PropTypes.func,
   defaultExpandedKeys:PropTypes.arrayOf(
     PropTypes.string
   ),
   defaultExpandAll:PropTypes.bool,
   autoExpandParent:PropTypes.bool,
}
