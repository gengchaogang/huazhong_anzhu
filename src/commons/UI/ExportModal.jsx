import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router'
import {Modal,Button,DatePicker} from 'antd';
const { RangePicker } = DatePicker;
import './ExportModal.css';
import {
  isNull,
} from '../utils/currencyFunction'
export default class ExportModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      downloadPath:null,
      fileName:'',
      message:'只能导出一年内的交易数据',
      btnLoading:false,
    }
  }
  afterClose=()=>{
    this.setState({
      downloadPath:null,
      fileName:'',
      message:'只能导出一年内的交易数据',
      btnLoading:false,
    })
    if(!!this.props.afterClose){
      this.props.afterClose()
    }
  }
  onRangeChange=(dates,dateStrings)=>{
    this.renderDownLoadPath(dateStrings)
  }
  renderDownLoadPath=(dateStrings)=>{
    const{type,todo,path,fileName}=this.props;
    // if(todo === 'exportGroupBuy'){
      this.setState({
        ...this.state,
        downloadPath:`${path}&begin=${dateStrings[0]}&end=${dateStrings[1]}&excelName=${fileName}${dateStrings[0].replace('-','')}-${dateStrings[1].replace('-','')}`,
        fileName:`${fileName}${dateStrings[0].replace('-','')}-${dateStrings[1].replace('-','')}`,
      })
    // }
  }
  onExport=()=>{
    this.setState({
      ...this.setState,
      message:'只能导出一年内的交易数据',
      btnLoading:true,
    })
    const {
      downloadPath,
      fileName,
      btnLoading,
    } = this.state;
    fetch(downloadPath, {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        credentials:'include',
      }).then(
        (response)=>{
          if (response.status !== 200) return;
          response.json().then((results)=>{
            let login=true;
            try {
              if(results.status==='error' && results.loginState==='NO'){//没有登录
                login=false
              }
            }catch(e){
              let login=true;
            }
            // console.log('login',login);
            if(!!login){
              console.log('results',results);
              let randKey = null;
              try {
                if(!!results.data.randKey){
                  randKey = results.data.randKey;
                }
              } catch (e) {
                randKey = null;
                //失败
                this.setState({
                  ...this.setState,
                  message:isNull(results.message,'请求失败！'),
                  btnLoading:false,
                })
              }
              if(!!randKey){
                console.log(this.props.todo,'todo');
                const downLoadA = this.refs.downLoadArea;
                if(this.props.todo=='exportReported'){
                  downLoadA.href = `/miss-anzhu-newhouse-tx-report/reports/exportExcel?randKey=${randKey}`;
                }else if(this.props.todo=='exportConfirmed'){
                  downLoadA.href = `/miss-anzhu-newhouse-tx-view/viewed/exportExcel?randKey=${randKey}`;
                }else if(this.props.todo=='exportGroupBuy'){
                  downLoadA.href = `/miss-anzhu-newhouse-tx-groupbuy/groupbuy/exportExcel?randKey=${randKey}`;
                }else{
                  downLoadA.href = `/miss-anzhu-newhouse-tx-commit/tx/exportExcel?randKey=${randKey}`;
                }
                downLoadA.click();
                this.props.onCancel();
              }
            }else{
              window.dispatch(routerRedux.push('/login'));
            }
          });
        }
      ).catch(function(e) {
        console.log('e',e);
      });
  }
  render(){
    const {
      wrapClassName,
      visible=false,
      todo,
      type,
      onOk,
      onCancel,
      okText='生成报表',
      cancelText='取消',
      title='导出报表',
      width=450,
    }=this.props;
    const {
      downloadPath,
      fileName,
      btnLoading,
      message,
    } = this.state
    console.log('this.state',this.state);
    const modalProps={
      closable:false,
      maskClosable:false,
      title,
      width,
      wrapClassName:`exportModal ${!!wrapClassName?wrapClassName:''}`,
      visible,
      footer:<div>
        <Button type='ghost' onClick={onCancel}>{cancelText}</Button>
        {!!downloadPath && <Button type='primary' loading={btnLoading} onClick={this.onExport}>{okText}</Button>}
      </div>
    }
    return(
      <Modal {...modalProps} afterClose={this.afterClose}>
        {!!visible && <div className='exportModal_content'>
          <div className='downLoadArea'>
            <a ref='downLoadArea' download={fileName} href='javascript:void(0);'></a>
          </div>
          <span className='exportModal_label'>报表导出时间：</span>
          <RangePicker size='large' placeholder={['开始时间','结束时间']} onChange={this.onRangeChange}/>
        </div>}
        <p className='exportModal_msg'>{message}</p>
      </Modal>
    )
  }
}
ExportModal.propTypes = {
  visible:PropTypes.bool.isRequired,
};
