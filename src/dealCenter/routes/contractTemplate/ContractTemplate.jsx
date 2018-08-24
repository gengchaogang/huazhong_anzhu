import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import { DatePicker,Table,Select,Modal,Button} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import ContractList from '../../../commons/UI/ContractList'
import PromptModal from '../../../commons/View/PromptModal'
import textPic from '../../assets/yay.jpg'


function ContractTemplate({dispatch,contractTemplate:{
  promptObj,
  nhList,
  shSellList,
  shRentList,
  shLoanList,
}}){
  return (
    <div className='contractTemplate'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'contractTemplate/closePrompt'})} onCancel={()=>dispatch({type:'contractTemplate/closePrompt'})}/>
      <DxPanel title='新房交易合同模板'>
        <ContractList contractList={nhList}/>
      </DxPanel>
      <DxPanel title='二手房出售交易模板'>
        <ContractList contractList={shSellList}/>
      </DxPanel>
      <DxPanel title='二手房出租交易模板'>
        <ContractList contractList={shRentList}/>
      </DxPanel>
      <DxPanel title='二手房金融贷款协议'>
        <ContractList contractList={shLoanList}/>
      </DxPanel>
    </div>
  )
}

function mapStateToProps({contractTemplate}){
  return {contractTemplate}
}

export default connect(mapStateToProps)(ContractTemplate);
