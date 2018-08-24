import React from 'react'
import {connect} from 'dva'
import {
  Button,
  Form,
  Modal
} from 'antd'
import SelectUser from '../../../commons/UI/SelectUser';
const FormItem=Form.Item;

const SelectShenHeObj=Form.create({})(
  function({form,dispatch,secondDeal}){
    const {showSelectShenheObj}=secondDeal;
    const {getFieldDecorator}=form;


    return (
      <Modal
        maskClosable={false}
        visible={showSelectShenheObj}
        onCancel={()=>{
          dispatch({type:'secondDeal/setState',payload:{showSelectShenheObj:false}});
        }}
      >
        <div>
          <Form>
            <FormItem>
              {
                getFieldDecorator('shenheobj',{})(
                  <div>

                    <SelectUser
                      data={[
                        {label:'sdf',value:1},
                        {label:'325345',value:2}
                      ]}
                      value={[1]}
                    />
                  </div>
                )
              }
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
)

export default connect(({secondDeal})=>({secondDeal}))(SelectShenHeObj)
