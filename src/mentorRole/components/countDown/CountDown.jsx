import React from 'react'
import {Button} from 'antd'
var CountDown = React.createClass({
  getInitialState: function(){
    return {
      count: 60,
      liked: true
    };
  },
  handleClick: function(){
    if(this.props.isError()){
      return
    }else{
      this.props.click()
      if(this.state.liked){
        this.timer = setInterval(function () {
          if(this.props.isClear){
            clearInterval(this.timer)
          }else{
            var count = this.state.count;
            this.state.liked = false;
            count -= 1;
            if (count === 0) {
              this.setState({
                liked: true
              });
              count = 60;
              clearInterval(this.timer)
            }
            this.setState({
              count: count
            });
          }
        }.bind(this), 1000);
      }
    }
  },
  render: function(){
    var text = this.state.liked ? '获取验证码' : this.state.count + '秒后重发';
    return(
        <Button
          size="large"
          onClick={this.handleClick}
          disabled={!this.state.liked}
          style={{marginTop:"4px"}}
          >
          {text}
        </Button>
    )
  }
})

export default CountDown
