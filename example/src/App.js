import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './editor/Editor';

class App extends Component {
  sendMsg = () => {
    console.log('sendmsg');
  };
  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
        <Editor
          ref={el => (this._editor = el)}
          onChange={replyContent => {
            console.log('replycontent', replyContent);
            this.setState({ value: replyContent });
          }}
          onSend={this.sendMsg}
        />
      </div>
    );
  }
}

export default App;
