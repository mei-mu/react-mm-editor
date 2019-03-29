import { Editor } from 'slate-react';
import { Value } from 'slate';

import React from 'react';
import { Popover } from 'antd';

import SerialComment from './serialComment';
import EmojisData from './Emojis';
import initialValue from './init.json';

import './editor.css';
/**
 * No ops.
 *
 * @type {Function}
 */

const noop = e => e.preventDefault();

export class ReadOnlyEditor extends React.Component {
  render() {
    let value = SerialComment.deserialize(this.props.value);

    return (
      <Editor value={value} readOnly={true} renderNode={this.renderNode} />
    );
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>;
      }
      case 'emoji': {
        const name = node.data.get('name');
        const index = node.data.get('index');
        let icon = node.data.get('icon');
        if (!icon) {
          icon = `https://res.wx.qq.com/mpres/en_US/htmledition/pages/modules/common/emoji/images/smiley/smiley_${index}.png`;
        }
        return (
          <img
            {...props.attributes}
            selected={isFocused}
            onDrop={noop}
            src={icon}
            className="icon_emotion_single"
          />
        );
      }
    }
  };
}

export default class WechatEditor extends React.Component {
  state = {
    showEmoji: false,
    // initialValue为一个空状态
    value: Value.fromJSON(initialValue)
  };

  constructor(props) {
    super(props);

    if (this.props.defaultContent) {
      let value = SerialComment.deserialize(this.props.defaultContent);
      this.state = {
        showEmoji: false,
        value
      };
    }
  }

  /**
   * Render the app.
   *
   * @return {Element} element
   */

  render() {
    let serial = SerialComment.serialize(this.state.value);
    // ios emoji占用两个字符，和微信保持一致 :-)
    let len = serial.length;

    return (
      <div className="emoion_editor_wrp">
        <div className="emotion_editor">
          <Editor
            ref={el => (this.__editor = el)}
            className="edit_area"
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderNode={this.renderNode}
          />
          <div className="editor_toolbar">
            <div className="weui-desktop-popover__wrp">
              <span className="weui-desktop-popover__target">
                <Popover
                  content={this.renderEmoji()}
                  placement="bottom"
                  visible={this.state.showEmoji}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <a
                    href="javascript:void(0);"
                    className="icon_emotion emotion_switch"
                  >
                    表情
                  </a>
                </Popover>
              </span>
            </div>
            {/* <p className='editor_tip'>
              {len < 140 ? (
                <span>
                  还可以输入
                  <em>{140 - len}</em>字
                </span>
              ) : (
                <em style={{ color: 'red' }}>
                  已经超过
                  {`${len - 140}`}
                  个字
                </em>
              )}
            </p> */}
            <div className="emotion_wrp" />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isFocused } = props;

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>;
      }
      case 'emoji': {
        const name = node.data.get('name');
        const index = node.data.get('index');
        let icon = node.data.get('icon');
        if (!icon) {
          icon = `https://res.wx.qq.com/mpres/en_US/htmledition/pages/modules/common/emoji/images/smiley/smiley_${index}.png`;
        }
        return (
          <img
            {...props.attributes}
            selected={isFocused}
            onDrop={noop}
            src={icon}
            className="icon_emotion_single"
          />
        );
      }
    }
  };

  renderEmoji() {
    let child = [];
    let i = 0;
    for (let emoji of EmojisData) {
      let { name, index, icon } = emoji;
      if (!icon) {
        icon = `https://res.wx.qq.com/mpres/en_US/htmledition/pages/modules/common/emoji/images/smiley/smiley_${index}.png`;
      }
      child.push(
        <img
          className="icon_emotion_single"
          src={icon}
          key={'img_' + i}
          onClick={() => this.onClickEmoji(emoji)}
        />
      );
      i++;
      if (i % 16 === 0) {
        child.push(<br key={'br_' + i} />);
      }
    }
    return <div>{child}</div>;
  }

  handleVisibleChange = visible => {
    this.setState({ showEmoji: visible });
  };

  onChange = ({ value }) => {
    this.setState({ value });
    let plainContent = SerialComment.serialize(value);
    if (this.props.onChange) {
      this.props.onChange(plainContent);
    }
  };

  onKeyDown = (event, change) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (event.shiftKey) {
      // console.log('shift + entter, skip');
      return;
    }

    this.props.onSend();

    event.preventDefault();
    return true;
  };

  onClickEmoji = emoji => {
    const { value } = this.state;
    const change = value.change();

    change
      .insertInline({
        type: 'emoji',
        isVoid: true,
        data: { ...emoji }
      })
      .collapseToStartOfNextText()
      .focus();

    this.onChange(change);
  };

  appendContent(text) {
    const { value } = this.state;
    const change = value.change();

    change.insertText(text);

    this.onChange(change);
  }

  clearContent() {
    let value = Value.fromJSON(initialValue);
    const change = value.change();

    this.onChange(change);
  }

  focus = () => {
    this.__editor && this.__editor.focus();
  };
  blur = () => {
    this.__editor && this.__editor.blur();
  };
}
