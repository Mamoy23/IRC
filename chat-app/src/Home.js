
import React from "react";
import MsgForm from './MsgForm';
import Messages from './Messages';
import Channels from './Channels';
import io from "socket.io-client";

class Home extends React.Component{

    state = {
        activChannel: '',
        nickname: ''
    }
    
    constructor(props){
        super(props);

        const handleChannel = room => {
            this.setState({activChannel : room});
        }

        this.socket = io('localhost:3001');

        this.socket.emit('USER', this.props.username);

        this.socket.on('CHANGE_CHANNEL', function(data){
            handleChannel(data);
        })
    }

    handleChannel = (room) => {
        this.setState({activChannel : room});
    }

    render(){
        return (
            <div className="container d-flex">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h1>Welcome {this.props.username}</h1>
                            <h2>{this.state.activChannel}</h2>
                        </div>
                        <hr/>
                        <Messages 
                            socket={this.socket}
                            activChannel={this.state.activChannel}
                        />
                    </div>
                    <div className="card-footer">
                        <MsgForm 
                            socket={this.socket}
                            username={this.props.username}
                            activChannel={this.state.activChannel}
                            handleNickname={this.handleNickname}
                        />
                    </div>
                </div>
                <div>
                    <Channels 
                        socket={this.socket}
                        username={this.props.username}
                        handleChannel={this.handleChannel}
                    />
                </div>
            </div>
        );
    }
}

export default Home;