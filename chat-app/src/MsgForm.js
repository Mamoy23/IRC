import React from 'react';

class MsgForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        message: '',
        nickname: '',
    };

    this.props.socket.on('NICKNAME', (data) => {
       this.setState({nickname: data.nickname});
    });

    this.sendMessage = ev => {
        ev.preventDefault();
        this.props.socket.emit('SEND_MESSAGE', {
            author: this.state.nickname ? this.state.nickname : this.props.username,
            message: this.state.message,
        });
        this.setState({message: ''});
    }
  }

  render(){
    return (
        <div>
            <input type="text" placeholder="Message" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} className="form-control"/>
            <button onClick={this.sendMessage} className="btn btn-success form-control">Send</button>
        </div>
    );
  }
}

export default MsgForm;
