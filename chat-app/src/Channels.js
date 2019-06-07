
import React from "react";

class Channels extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            rooms: [],
        };

        const addRoom = data => {
            this.setState({rooms: data});
        }

        this.props.socket.on('ROOMS', function(data){
            addRoom(data);
        });
        
    }
    handleClick = (room) => {
        this.props.handleChannel(room);
    }
    render(){
        return (
            <div className="container">
                <ul className="list-group">
                    <li className="list-group-item list-group-item-light">Channels</li>
                    {Object.keys(this.state.rooms)
                    .filter(room => this.state.rooms[room].includes(this.props.username))
                    .map((room, i) => 
                        <li key={i} onClick={ev => this.handleClick(room)} className="list-group-item list-group-item-action">{room}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Channels;