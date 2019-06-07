import React from 'react';

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        messages: [],
        serverMessages: [],
    };
    const addMessage = data => {
        this.setState({messages: [...this.state.messages, data]});
    };

    const addServerMessage = data => {
        this.setState({serverMessages: [...this.state.serverMessages, data]});
    }

    this.props.socket.on('RECEIVE_MESSAGE', function(data){
        console.log(data);
        addMessage(data);
    });

    // this.props.socket.on('NICKNAME', function(data) {
    //     console.log(data);
    //     addServerMessage({ author: "SERVER", message: `${data.username} is now nicknamed ${data.nickname}` })
    // })

    this.props.socket.on('USERS', function(data) {
      addServerMessage({author: 'SERVER', message: data.join(' - ') + ' connected'});
    })

    // this.props.socket.on('CREATE', function(data) {
    //     addServerMessage({author: 'SERVER', message: data.username+' create channel "'+data.room+'"'});
    // })

    this.props.socket.on('LIST', function(data) {
        console.log(data);
        addServerMessage({author: 'SERVER', message: 'Channels '+ Object.keys(data).join(' - ')});
    })

    this.props.socket.on('RESPONSE', function(data) {
        addServerMessage({author: 'SERVER', message: data});
    })

    // this.props.socket.on('JOIN', function(data) {
    //     addServerMessage({author: 'SERVER', message: data.username+' join channel '+data.room});
    // })
}

render(){
    //console.log(this.props.activChannel);
    return (
        <div>
            {this.state.messages
                .filter(m => m.channel === this.props.activChannel)
                .map((message, i) => message.author.nickname ? (
                    <React.Fragment key={i}>
                        <p><span className="font-weight-bold">{message.author.nickname}</span> : {message.message}</p>
                    </React.Fragment>
                ) : (
                    <React.Fragment key={i}>
                    <p><span className="font-weight-bold">{message.author.username}</span> : {message.message}</p>
                    </React.Fragment>
                )
            )}
            {this.state.serverMessages.map((serverMessage, i) =>
                <p key={i} className="text-secondary font-italic">{serverMessage.message}</p> 
            )}
        </div>
    )
  }
}

export default Messages;
