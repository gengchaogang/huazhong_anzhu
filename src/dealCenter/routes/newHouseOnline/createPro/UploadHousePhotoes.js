import React from 'react'
import {
  Form,
  Upload,
  message,
  Collapse,
  Icon,
  Button
} from 'antd'
import {connect} from 'dva'
import SelectPicture from '../../../../commons/UI/SelectPicture'


const Panel=Collapse.Panel;
const FormItem=Form.Item;

const UploadHousePhotoes=Form.create({
  onFiledsChange:(props,fileds)=>{

  },
  mapPropsToFileds:(props)=>{

  }
})(({uploadHousePhotoes,form,prev,next,dispatch})=>{

const {getFieldDecorator}=form;

  return (
    <div>
      <Collapse activeKey={['1','2']}>
        <Panel header="项目效果图" key='1'>
          <FormItem>
            {
              getFieldDecorator('file',{})(
                <SelectPicture
                  total={50}
                  size={2}
                  async={true}
                />
              )
            }
          </FormItem>
        </Panel>
      </Collapse>
      <Button type="primary" onClick={prev}>上一步</Button>
      <Button type="primary" onClick={next}>下一步</Button>
    </div>
  )
})


function mapStateToProps({uploadHousePhotoes}){
  return {uploadHousePhotoes};
}
export default connect(mapStateToProps)(UploadHousePhotoes)
