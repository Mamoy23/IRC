import React from 'react';


class Login extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        username: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleUser(this.state.username);
  }

  render(){
    return (
      <div className="container m-4">
        <h1 className="text-dark">Internet Relay Chat</h1>
        <form onSubmit={this.handleSubmit}> 
            <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
            <input className="btn btn-dark w-100" type="submit" value="Login" />
        </form>
      </div>
    );
  }
}

export default Login;
