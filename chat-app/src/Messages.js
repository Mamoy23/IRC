import React from 'react';

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        messages: [],
    };
    const addMessage = data => {
        this.setState({messages: [...this.state.messages, data]});
    };

    this.props.socket.on('RECEIVE_MESSAGE', function(data){
        addMessage(data);
    });

    this.props.socket.on('NICKNAME', function(data) {
        addMessage({ author: "BREAKING NEWS", message: `User ${data.username} is now nicknamed ${data.nickname}` })
    })

    this.props.socket.on('USERS', function(data) {
      addMessage({author: 'USERS CONNECTED', message: data.join(', ')});
    })
}

render(){
    return (
        <div>
            {this.state.messages.map((message, i) => 
                <React.Fragment key={i}>
                <p><span className="font-weight-bold">{message.author}</span> : {message.message}</p>
                </React.Fragment>
            )}
        </div>
    )
  }
}

export default Messages;
