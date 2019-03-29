import { Block, Mark, Node, Value } from 'slate';

import EmojisData from './Emojis';

// copy from slate-plain-serializer, 并适配emoji

/**
 * Deserialize a plain text `string` to a Slate value.
 *
 * @param {String} string
 * @return {Value}
 */

function deserialize(string) {
  // 先转化为json，然后转换为value
  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: string.split('\n').map(line => {
        let subnodes = [];
        let len1 = line.length;
        let len2 = EmojisData.length;
        let pre = 0;
        for (let i = 0; i < len1; ) {
          let find = false;
          let subline = line.slice(i);
          for (let j = 0; j < len2; j++) {
            let emoji = EmojisData[j];
            let name = emoji.name;
            if (subline.startsWith(name)) {
              let text = line.slice(pre, i);
              subnodes.push({
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: text
                  }
                ]
              });

              subnodes.push({
                object: 'inline',
                type: 'emoji',
                isVoid: true,
                data: emoji
              });

              i += name.length;
              pre = i;
              find = true;
              break;
            }
          }

          if (!find) {
            i++;
          }
        }

        // 最后一段
        let text = line.slice(pre);
        subnodes.push({
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: text
            }
          ]
        });

        return {
          object: 'block',
          type: 'paragraph',
          isVoid: false,
          data: {},
          nodes: subnodes
        };
      })
    }
  };

  const ret = Value.fromJSON(json);
  return ret;
}

/**
 * Serialize a Slate `value` to a plain text string.
 *
 * @param {Value} value
 * @return {String}
 */

function serialize(value) {
  return serializeNode(value.document);
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node) {
  if (
    node.object == 'document' ||
    (node.object == 'block' && Block.isBlockList(node.nodes))
  ) {
    return node.nodes.map(serializeNode).join('\n');
  } else {
    let nodes = node.nodes;
    let result = '';
    for (let n of nodes) {
      if (n.type === 'emoji') {
        result += n.data.get('name');
      } else {
        result += n.text;
      }
    }
    return result;
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  deserialize,
  serialize
};
