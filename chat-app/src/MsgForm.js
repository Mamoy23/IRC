import React from 'react';

class MsgForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        message: '',
        nickname: '',
    };

    this.props.socket.on('NICKNAME_SET', (data) => {
       this.setState({nickname: data});
       //this.props.handleNickname(this.state.nickname);
    });
    
    this.sendMessage = ev => {
        ev.preventDefault();
        this.props.socket.emit('SEND_MESSAGE', {
            //author: this.state.nickname ? this.state.nickname : this.props.username,
            author: {
                username: this.props.username,
                nickname: this.state.nickname
            },
            message: this.state.message,
            channel: this.props.activChannel
        });
        this.setState({message: ''});
    }
  }

  render(){
    return (
        <div>
            <form onSubmit={this.sendMessage}>
                <input type="text" placeholder="Message" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} className="form-control"/>
                <button onClick={this.sendMessage} type="submit" className="btn btn-success form-control">Send</button>
            </form>
        </div>
    );
  }
}

export default MsgForm;
