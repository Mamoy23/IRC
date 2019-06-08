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

    this.props.socket.on('USERS', function(data) {
      addMessage({author: 'SERVER', message: data.join(' - ') + ' connected'});
    })

    this.props.socket.on('LIST', function(data) {
        addMessage({author: 'SERVER', message: 'Channels: '+ Object.keys(data).join(' - ')});
    })

    this.props.socket.on('RESPONSE', function(data) {
        addMessage({author: 'SERVER', message: data});
    })
}

render(){
    return (
        <div>
            {this.state.messages
                .filter(m => m.channel === this.props.activChannel || m.author === 'SERVER')
                .map((message, i) => message.author.nickname ? (
                    <React.Fragment key={i}>
                        <p><span className="font-weight-bold">{message.author.nickname}</span> : {message.message}</p>
                    </React.Fragment>
                    ) : message.author === 'SERVER' ? (
                    <p key={i} className="text-secondary font-italic">{message.message}</p> 
                    ) :  (
                    <React.Fragment key={i}>
                        <p><span className="font-weight-bold">{message.author.username}</span> : {message.message}</p>
                    </React.Fragment>
                    )
                )
            }
        </div>
    )
  }
}

export default Messages;
