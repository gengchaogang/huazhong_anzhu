import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Table,Button,Modal,Form,Input,Checkbox} from 'antd';
import regionalism from '../../../commons/assets/areas.json';
import { routerRedux } from 'dva/router';
import './DealCenterIdDetail.css'
import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['违规操作', '非法信息', '其他'];
const options = [
  { label: '违规操作', value: '违规操作' },
  { label: '非法信息', value: '非法信息' },
  { label: '其他', value: '其他' },
];

function getDisplayPath(path){
  if(!path)return "";
  var paths = path.split("/");
  paths.shift();
  if(paths.length){
    if(paths[0] == paths[1]){
      paths.shift();
    }
  }
  return paths.join("-");
}
function DealCenterIdDetail({dealCenterIdDetail,dispatch,form}) {
  console.log("update view");
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
	const {reasons,dataSource,deleteModalStatus,huiFuYinYeModalStatus,stopYinYeModalStatus}=dealCenterIdDetail;
	//删除按钮所对应的模态框回调
	const deleteModalClick=()=>{
		dispatch({
			type:'dealCenterIdDetail/deleteModalClick'
		})
	}
	const deleteModalonOk=()=>{
		dispatch({
			type:'dealCenterIdDetail/tryDelete'
		})
	}
	const deleteModalonCancel=()=>{
		dispatch({
			type:'dealCenterIdDetail/deleteModalonCancel'
		})
	}
	//恢复营业按钮所对应的模态框回调
	const huiFuYinYeModalClick=()=>{
		dispatch({
			type:'dealCenterIdDetail/showReopenModel'
		})
	}
	const huiFuYinYeModalonOk=()=>{
		dispatch({
			type:'dealCenterIdDetail/tryReopen'
		})

	}
	const huiFuYinYeModalonCancel=()=>{
		dispatch({
			type:'dealCenterIdDetail/huiFuYinYeModalonCancel'
		})

	}
	//停止营业按钮所对应的模态框回调
	const stopYinYeClick=()=>{
		dispatch({
			type:'dealCenterIdDetail/preInputCloseReason'
		})
	}
	const stopYinYeModalonOk=()=>{
		// dispatch({
		// 	type:'dealCenterIdDetail/tryStopBuz'
		// })
    form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
      dispatch({
      	type:'dealCenterIdDetail/tryStopBuz',
        payload: values
      })
		});
    form.resetFields();
	}
	const stopYinYeModalonCancel=()=>{
		dispatch({
			type:'dealCenterIdDetail/closeInputCloseReasonDialog'
		})
    form.resetFields();
	}
	//停止营业模态框中多选框的回调
	const onChange=(checkedValues)=>{
  	console.log('checked = ', checkedValues);
	}

  const resetPasswordClick=()=>{
    console.log(dataSource.id,'...');
    dispatch({type:'dealCenterIdDetail/tryResetPassword'});
  };

  const goToEditPage=()=>{
    dispatch(routerRedux.push({
      pathname: `/idManagement/dealCenterIdIndex/newAccount`,
      state: {id: dataSource.id}
    }));
  };

  const licenseNumberView = dataSource.licenseType == "普通营业执照" ? (
    <div>
      <span>注册号：</span>
      <span>{dataSource.commonLicenseNumber}</span>
    </div>
    ):(
      <div>
        <span>统一社会信用代码：</span>
        <span>{dataSource.licenseNumber}</span>
      </div>
    )

  //console.log("detail dataSource>",dataSource);
	return(
		<div>
			<DxPanel title='帐号信息'>
        <div>
				<div>
					<span>帐号：</span>
					<span>{dataSource.loginName}</span>
				</div>
				<div>
					<span>状态：</span>
					<span>{dataSource.status}</span>
          {dataSource.status=="冻结"?
					<div className='reason'>
						<span>原因：</span>
						<span>{dataSource.reasons}</span>
					</div>:''
        }
				</div>
        {dataSource.status!="冻结"?
  				<div>
  					<span>开通时间：</span>
  					<span>{dataSource.createDate}</span>
  				</div>:''
        }
      </div>
      </DxPanel>
			<DxPanel title='交易中心信息'>
				<div>
					<span>交易中名称：</span>
					<span>{dataSource.name}</span>
				</div>
				<div>
					<span>交易中心负责人：</span>
					<span>{dataSource.header}</span>
				</div>
				<div>
					<span>营业地址：</span>
					<span>{getDisplayPath(dataSource.businessPath)+"  "+(dataSource.address||"")}</span>
				</div>
				<div>
					<span>营业电话：</span>
					<span>{dataSource.businessPhone}</span>
				</div>
				<div>
					<span>业务联系人：</span>
					<span>{dataSource.contacts}</span>
				</div>
				<div>
					<span>联系电话：</span>
					<span>{dataSource.contactsPhone}</span>
				</div>
      </DxPanel>
			{/*<DxPanel title='交易服务费'>
				<div>
					<span>交易服务费：</span>
					<span>{(dataSource.tradingServiceCharges||0).toFixed(2)}元</span>
				</div>
      </DxPanel>*/}
			<DxPanel title='企业信息'>
				<div>
					<span>企业名称：</span>
					<span>{dataSource.companyName}</span>
				</div>
				<div>
					<span>企业法人：</span>
					<span>{dataSource.corporation}</span>
				</div>
				<div>
					<span>企业营业执照：</span>
					{!!dataSource.licensePicFirst && <div className='qiYeYingYeZhiZhao' style={{backgroundImage:`URL(${dataSource.licensePicFirst})`}}>&nbsp;</div>}
				</div>
        <div>
          {licenseNumberView}
        </div>
				<div>
					<span>所在城市：</span>
					<span>{getDisplayPath(dataSource.companyFullPath)}</span>
				</div>
				<div>
					<span>详细地址：</span>
					<span>{dataSource.companyAddress}</span>
				</div>
      </DxPanel>
      <div>
			{dataSource.status=='冻结'?<DxPanel title='停止营业信息'>
				<div>
					<span>停止营业时间：</span>
					<span>{dataSource.closeTime}</span>
				</div>
				<div>
					<span>停止营业原因：</span>
					<span>{dataSource.reasons}</span>
				</div>
				<div>
					<span>操作人员：</span>
					<span>运营中心 {dataSource.closeUser}</span>
				</div>
			</DxPanel>:''}
      </div>
      <Button type='primary' onClick={resetPasswordClick}>重置密码</Button>
      <Button type='primary' onClick={goToEditPage}>编辑</Button>
      {/*暂时停用删除功能*/}
      {/*<Button onClick={deleteModalClick}>删除</Button>*/}
      {dataSource.status=='正常'?
        <Button type='primary' onClick={stopYinYeClick}>停止营业</Button>:
        <Button type='primary' onClick={huiFuYinYeModalClick}>恢复营业</Button>
      }
      <Button type='ghost' onClick={()=>{dispatch(routerRedux.goBack())}}>返回</Button>
			{/*以下为删除按钮的模态框*/}
			<Modal title="提示信息" visible={deleteModalStatus}
          onOk={deleteModalonOk} onCancel={deleteModalonCancel}
        >
          <p>确认要删除帐号吗？</p>
      </Modal>
			{/*以下为恢复营业按钮的模态框*/}
			<Modal title="恢复营业" visible={huiFuYinYeModalStatus}
          onOk={huiFuYinYeModalonOk} onCancel={huiFuYinYeModalonCancel}
        >
          <p>确认要恢复营业吗？</p>
      </Modal>
			{/*以下为停止营业按钮的模态框*/}
			<Modal title="停止营业" visible={stopYinYeModalStatus}
          onOk={stopYinYeModalonOk} onCancel={stopYinYeModalonCancel}
        >
        <Form inline style={{margin:'20px 0'}}>
          <FormItem
            label="停止营业原因"
          >
            {getFieldDecorator('reasons', {
              initialValue: reasons.reasons,
            })(
              <CheckboxGroup options={plainOptions} onChange={onChange} />
            )}
          </FormItem>
          <div className='textareaReason'>
            <FormItem>
              {getFieldDecorator('comment', {
                initialValue: reasons.comment,
              })(
                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
          </div>
        </Form>
      </Modal>
      <DxLoadingShadow visible={dealCenterIdDetail.loading} zIndex={1001}/>
		</div>
	)
}


DealCenterIdDetail.propTypes = {

};
function mapStateToProps({ dealCenterIdDetail }) {
	return { dealCenterIdDetail }
}

export default connect(mapStateToProps)(Form.create()(DealCenterIdDetail))
