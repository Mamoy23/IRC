import React from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        username: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(username) {
    this.setState({username: username});
  }

  render(){
        if(this.state.username !== ''){
          return <Home username={this.state.username}/>;
        }
        else {
          return <Login handleUser={this.handleChange}/>;
        }
  }
}

export default App;
