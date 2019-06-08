import React from 'react';
import EmojiPicker from 'emoji-picker-react';

class MsgForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        message: '',
        nickname: '',
        showEmoji : false
    };

    this.props.socket.on('NICKNAME_SET', (data) => {
       this.setState({nickname: data});
    });
    
    this.sendMessage = ev => {
        ev.preventDefault();
        this.props.socket.emit('SEND_MESSAGE', {
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

  addEmoji = (e) => {
    let emoji = String.fromCodePoint(`0x${e}`)
    this.setState({message: this.state.message + emoji})
  }

  showEmoji = (e) => {
    if(this.state.showEmoji === false)
        this.setState({showEmoji: true})
    else
        this.setState({showEmoji: false})
  }

  render(){
    return (
        <div>
            <form onSubmit={this.sendMessage}>
                <div className="input-group m-1">                
                    <div className="input-group-prepend">
                        <span className="input-group-text" onClick={this.showEmoji}>{String.fromCodePoint(`0x1f642`)}</span>
                    </div>
                    <input type="text" placeholder="Message" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})} className="form-control"/>
                    <div className="input-group-append">
                        <button onClick={this.sendMessage} type="submit" className="btn btn-dark form-control">Send</button>
                    </div>
                </div>
                {this.state.showEmoji ? 
                    <EmojiPicker className="emojis" onEmojiClick={this.addEmoji}/> : 
                    null
                }
            </form>
        </div>
    );
  }
}

export default MsgForm;
