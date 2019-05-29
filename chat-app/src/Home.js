
import React from "react";
import MsgForm from './MsgForm';
import Messages from './Messages';
import io from "socket.io-client";

class Home extends React.Component{

    constructor(props){
        super(props);

        this.socket = io('localhost:3001');

        this.socket.emit('USER', this.props.username);
    }

    render(){
        return (
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">Welcome {this.props.username}</div>
                        <hr/>
                        <Messages socket={this.socket}/>
                    </div>
                    <div className="card-footer">
                        <MsgForm 
                            socket={this.socket}
                            username={this.props.username}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;