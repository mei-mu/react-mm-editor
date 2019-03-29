import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Editor from '../editor/Editor';

class App extends Component {
  sendMsg = () => {
    console.log('sendmsg');
  };
  render() {
    return (
      <div className='App'>
        <p>This is a example</p>
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

ReactDOM.render(<App />, document.getElementById('root'));
